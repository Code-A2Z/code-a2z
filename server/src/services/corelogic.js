import { getUserRepos } from "./getrepos.js";
import { getfiles } from "./getfiles.js";
import { getPRmetrics } from "./getprs.js";
import { getIssueMetrics } from "./getresolutiontime.js";
import { getlanguages } from "./getlanguages.js";
import { detectCapabilities } from "./featureDetector.js";

export async function analyzeUser(username) {
  const repos = await getUserRepos(username);
  const analysisResults = [];

  for (const repo of repos) {
    console.log("Repo:", repo.owner.login, repo.name);

    console.log("Fetching files...");
    const files = await getfiles(repo.owner.login, repo.name);

    const capabilities = detectCapabilities(files, []);

    console.log("Fetching PRs...");
    const prMetrics = await getPRmetrics(repo.owner.login, repo.name);

    console.log("Fetching issues...");
    const issueMetrics = await getIssueMetrics(repo.owner.login, repo.name);

    console.log("Fetching languages...");
    const languages = await getlanguages(repo);

    analysisResults.push({
      repo: repo.name,
      languages: Object.keys(languages),
      capabilities,
      avgPRMergeTime:
        prMetrics.length
          ? prMetrics.reduce((a, b) => a + b.mergetimehours, 0) /
            prMetrics.length
          : null,
      avgIssueResolutionTime:
        issueMetrics.length
          ? issueMetrics.reduce((a, b) => a + b.resolutionHours, 0) /
            issueMetrics.length
          : null
    });
  }

  return analysisResults;
}
