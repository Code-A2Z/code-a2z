import { gh } from "./getauthenticated.js";

export async function getlanguages(repo) {
  return gh(`/repos/${repo.owner.login}/${repo.name}/languages`);
}
