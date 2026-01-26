module.exports = async ({ github, context, core }) => {
    try {
        const { owner, repo } = context.repo;

        // --- Constants ---
        const ISSUE_DEADLINE_DAYS = 7; // Fixed deadline for all issues
        const MAX_ASSIGNED_ISSUES = 2;
        const PROJECT_NUMBER = 1;
        const WARNING_HOURS_BEFORE_DEADLINE = 24;

        // --- Helper Functions ---

        // Add a comment to an issue
        async function addComment(issueNumber, body) {
            await github.rest.issues.createComment({
                owner,
                repo,
                issue_number: issueNumber,
                body,
            });
        }

        // Assign a user to an issue
        async function assignUser(issueNumber, username) {
            console.log(`Assigning issue #${issueNumber} to @${username}`);
            await github.rest.issues.addAssignees({
                owner,
                repo,
                issue_number: issueNumber,
                assignees: [username],
            });
        }

        // Unassign a user from an issue
        async function unassignUser(issueNumber, username) {
            console.log(`Unassigning @${username} from issue #${issueNumber}`);
            await github.rest.issues.removeAssignees({
                owner,
                repo,
                issue_number: issueNumber,
                assignees: [username],
            });
        }

        // Check if a user has too many assigned issues
        async function checkUserAssignmentLimit(username) {
            const response = await github.rest.issues.listForRepo({
                owner,
                repo,
                state: 'open',
                assignee: username,
            });
            return response.data.length >= MAX_ASSIGNED_ISSUES;
        }

        // Sync issue to Project V2 with idempotency
        async function syncIssueToProject(issueNodeId, statusName) {
            if (!issueNodeId) {
                console.warn('Cannot sync to project: missing node_id');
                return;
            }

            // 1. Find the Project details
            const projectQuery = `
              query($org: String!, $number: Int!) {
                organization(login: $org) {
                  projectV2(number: $number) {
                    id
                    fields(first: 20) {
                      nodes {
                        ... on ProjectV2SingleSelectField {
                          id
                          name
                          options {
                            id
                            name
                          }
                        }
                      }
                    }
                    items(first: 100) {
                      nodes {
                        id
                        content {
                          ... on Issue {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            `;

            let projectData;
            try {
                projectData = await github.graphql(projectQuery, {
                    org: owner,
                    number: PROJECT_NUMBER
                });
            } catch (error) {
                console.log("Error querying project:", error.message);
                return;
            }

            const project = projectData.organization.projectV2;
            if (!project) {
                console.warn('Project not found');
                return;
            }

            // 2. Check if item already exists in project
            let itemId = null;
            const existingItem = project.items.nodes.find(
                item => item.content && item.content.id === issueNodeId
            );

            if (existingItem) {
                itemId = existingItem.id;
                console.log('Issue already in project, updating status');
            } else {
                // Add item to project
                const addMutation = `
                  mutation($projectId: ID!, $contentId: ID!) {
                    addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
                      item {
                        id
                      }
                    }
                  }
                `;

                try {
                    const addResult = await github.graphql(addMutation, {
                        projectId: project.id,
                        contentId: issueNodeId
                    });
                    itemId = addResult.addProjectV2ItemById.item.id;
                    console.log('Added issue to project');
                } catch (error) {
                    // Might fail if already added by another process
                    console.log('Failed to add to project (might already exist):', error.message);
                    return;
                }
            }

            // 3. Find Status Field and Option
            const statusField = project.fields.nodes.find(f => f.name === 'Status');
            if (!statusField) {
                console.warn('Status field not found in project');
                return;
            }

            const statusOption = statusField.options.find(o => o.name.toLowerCase() === statusName.toLowerCase());
            if (!statusOption) {
                console.log(`Status option '${statusName}' not found in project.`);
                return;
            }

            // 4. Update Field
            const updateMutation = `
              mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) {
                updateProjectV2ItemFieldValue(
                  input: {
                    projectId: $projectId
                    itemId: $itemId
                    fieldId: $fieldId
                    value: { singleSelectOptionId: $value }
                  }
                ) {
                  projectV2Item {
                    id
                  }
                }
              }
            `;

            await github.graphql(updateMutation, {
                projectId: project.id,
                itemId: itemId,
                fieldId: statusField.id,
                value: statusOption.id
            });
            console.log(`Updated project status to: ${statusName}`);
        }

        // --- Main Logic Handlers ---

        // Handle Issue Opened/Edited/Reopened
        if (['opened', 'edited', 'reopened'].includes(context.payload.action) && context.eventName === 'issues') {
            const issue = context.payload.issue;
            const body = issue.body || "";

            const wantsToWork = /Would you like to work on this issue\?[\s\S]*?Yes/i.test(body);

            if (wantsToWork) {
                if (issue.assignees && issue.assignees.length > 0) {
                    console.log(`Issue #${issue.number} is already assigned. Skipping auto-assignment.`);
                    return;
                }

                const username = issue.user.login;
                const limitReached = await checkUserAssignmentLimit(username);

                if (limitReached) {
                    await addComment(issue.number, `Hey @${username}, you already have ${MAX_ASSIGNED_ISSUES} or more assigned issues. Please complete them before exploring new ones.`);
                    return;
                }

                await assignUser(issue.number, username);
                try {
                    await syncIssueToProject(issue.node_id, "In Progress");
                } catch (err) {
                    console.error("Failed to sync to project:", err.message);
                }

                await addComment(issue.number, `Hey @${username}, this issue is assigned to you! 🚀\nPlease ensure you submit a PR within the timeline.`);
            }
        }

        // Handle Issue Comments (/assign)
        if (context.eventName === 'issue_comment' && context.payload.action === 'created') {
            const comment = context.payload.comment;
            const issue = context.payload.issue;
            const body = comment.body.trim();

            if (body.toLowerCase().includes('/assign')) {
                if (issue.assignees && issue.assignees.length > 0) {
                    const assigneeName = issue.assignees[0].login;
                    await addComment(issue.number, `This issue is already assigned to @${assigneeName}. Please check other available issues.`);
                    return;
                }

                const username = comment.user.login;
                const limitReached = await checkUserAssignmentLimit(username);

                if (limitReached) {
                    await addComment(issue.number, `Hey @${username}, you already have ${MAX_ASSIGNED_ISSUES} or more assigned issues. Please complete them before exploring new ones.`);
                    return;
                }

                await assignUser(issue.number, username);

                try {
                    await syncIssueToProject(issue.node_id, "In Progress");
                } catch (err) {
                    console.error("Failed to sync to project:", err.message);
                }

                await addComment(issue.number, `Hey @${username}, this issue is assigned to you! 🚀`);
            }
        }

        // Handle Scheduled Deadline Checks
        if (context.eventName === 'schedule') {
            let issues = [];
            let fetchedFromProject = false;

            // Try to fetch from Project first (OS - TASK TRACKER)
            try {
                const projectQuery = `
                  query($org: String!, $number: Int!) {
                    organization(login: $org) {
                      projectV2(number: $number) {
                        items(first: 100) {
                          nodes {
                            content {
                              ... on Issue {
                                id
                                number
                                repository { name owner { login } }
                                assignees(first: 10) { nodes { login } }
                                state
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `;

                const projectData = await github.graphql(projectQuery, {
                    org: owner,
                    number: PROJECT_NUMBER
                });

                const nodes = projectData.organization.projectV2.items.nodes;

                // Filter and map
                issues = nodes
                    .map(n => n.content)
                    .filter(i => i && Object.keys(i).length > 0 && i.state === 'OPEN' && i.repository.name === repo && i.repository.owner.login === owner && !i.pullRequest) // GraphQL "Issue" type doesn't have pullRequest field usually, but if it was a PullRequest object it would be distinct. The union type is usually IssueOrPullRequest. We used "... on Issue" so it should ONLY be issues. But adding safety doesn't hurt if the graphQL schema allows it. Actually, "... on Issue" guarantees it's an Issue. But let's verify fallback.
                    .map(i => ({
                        number: i.number,
                        node_id: i.id,
                        assignees: i.assignees.nodes,
                        labels: i.labels.nodes,
                        // Add explicit flag for logic downstream if needed, but the filter above handles it. 
                    })); if (issues.length > 0) {
                        console.log(`Fetched ${issues.length} issues from OS - TASK TRACKER project.`);
                        fetchedFromProject = true;
                    }
            } catch (err) {
                console.log("Failed to fetch from project (fallback to repo search):", err.message);
            }

            // Fallback to Repo Search if Project fetch failed or returned empty
            if (!fetchedFromProject) {
                console.log("Fetching issues via GraphQL repo search...");
                const searchQuery = `repo:${owner}/${repo} is:issue is:open assignee:*`;

                try {
                    // Use GraphQL to fetch all assigned issues using cursor-based pagination
                    let compiledIssues = [];
                    let hasNextPage = true;
                    let endCursor = null;

                    while (hasNextPage) {
                        const query = `
                            query($searchQuery: String!, $after: String) {
                                search(query: $searchQuery, type: ISSUE, first: 100, after: $after) {
                                    pageInfo {
                                        hasNextPage
                                        endCursor
                                    }
                                    nodes {
                                        ... on Issue {
                                            number
                                            id
                                            assignees(first: 10) {
                                                nodes {
                                                    login
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        `;

                        const data = await github.graphql(query, { searchQuery, after: endCursor });
                        const search = data.search;

                        if (search.nodes) {
                            const pageIssues = search.nodes.map(node => ({
                                number: node.number,
                                node_id: node.id,
                                assignees: node.assignees.nodes
                            }));
                            compiledIssues = compiledIssues.concat(pageIssues);
                        }

                        hasNextPage = search.pageInfo.hasNextPage;
                        endCursor = search.pageInfo.endCursor;

                        if (hasNextPage) {
                            console.log(`Fetching next page of issues (cursor: ${endCursor})`);
                        }
                    }

                    issues = compiledIssues;
                    console.log(`Fetched ${issues.length} assigned issues using GraphQL fallback.`);

                } catch (err) {
                    console.error("GraphQL fallback search failed:", err.message);
                    throw err; // Re-throw to ensure we don't silently fail the schedule check
                }
            }

            const now = new Date();

            for (const issue of issues) {
                const daysAllowed = ISSUE_DEADLINE_DAYS;

                // Get assignment events
                const events = await github.paginate(github.rest.issues.listEvents, {
                    owner,
                    repo,
                    issue_number: issue.number
                });

                // Track if we've already synced this issue to avoid duplicate calls
                let projectSynced = false;

                // Check each assignee individually
                const assignees = issue.assignees || [];
                for (const assigneeObj of assignees) {
                    const assignee = assigneeObj.login;

                    // Find the last 'assigned' event FOR THIS USER
                    const userAssignedEvents = events.filter(e => e.event === 'assigned' && e.assignee && e.assignee.login === assignee);
                    if (userAssignedEvents.length === 0) continue;

                    const lastAssigned = userAssignedEvents[userAssignedEvents.length - 1];
                    const assignedDate = new Date(lastAssigned.created_at);

                    const deadline = new Date(assignedDate);
                    deadline.setDate(assignedDate.getDate() + daysAllowed);

                    const warningDate = new Date(deadline);
                    warningDate.setTime(deadline.getTime() - (WARNING_HOURS_BEFORE_DEADLINE * 60 * 60 * 1000));

                    // Check for timeout
                    if (now > deadline) {
                        await unassignUser(issue.number, assignee);

                        // Only sync once per issue
                        if (!projectSynced && issue.node_id) {
                            try {
                                await syncIssueToProject(issue.node_id, "Todo");
                                projectSynced = true;
                            } catch (err) {
                                console.error("Failed to sync to project:", err.message);
                            }
                        }

                        await addComment(issue.number, `Hey @${assignee}, the deadline for this issue has passed. It has been unassigned.`);
                    }
                    // Check for warning (only warn once)
                    else if (now > warningDate) {
                        const comments = await github.rest.issues.listComments({
                            owner,
                            repo,
                            issue_number: issue.number
                        });
                        // check if we already warned THIS user
                        const botComments = comments.data.filter(c => c.user.type === 'Bot' && c.body.includes(`@${assignee}`) && c.body.includes('deadline is approaching'));

                        if (botComments.length === 0) {
                            await addComment(issue.number, `Hey @${assignee}, just a friendly reminder that the deadline for this issue is approaching (approx. 24h left).`);
                        }
                    }
                }
            }
        }

    } catch (error) {
        console.error(error);
        core.setFailed(`Action failed with error: ${error.message}`);
    }
};
