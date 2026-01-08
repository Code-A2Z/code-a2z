import { gh } from "./getauthenticated.js";
export async function getPRmetrics(owner,repo){
    const prs=await gh(`/repos/${owner}/${repo}/pulls?state=all`);
    return prs
    .filter(pr=>pr.merged_at).map(pr=>({
        prnumber:pr.number,
        mergetimehours:(new Date(pr.merged_at)-new Date(pr.created_at))/36e5
    }));
}