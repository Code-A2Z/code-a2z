import { gh } from "./getauthenticated.js";

export async function getUserRepos(username) {
  const data = await gh(`/users/${username}/repos?per_page=1`);

  if (!Array.isArray(data)) {
    throw new Error("Repos API failed");
  }

  return data;
}
