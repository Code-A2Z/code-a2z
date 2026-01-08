import { gh } from "./getauthenticated.js";
export async function getIssueMetrics(owner, repo) {
  const issues = await gh(`/repos/${owner}/${repo}/issues?state=all`);

  return issues
    .filter(i => i.closed_at)
    .map(i => ({
      issue: i.number,
      resolutionHours:
        (new Date(i.closed_at) - new Date(i.created_at)) / 36e5
    }));
}
