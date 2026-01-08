import { gh } from "./getauthenticated.js";
export async function getfiles(owner,repo){
    return gh(`/repos/${owner}/${repo}/contents`);
}
