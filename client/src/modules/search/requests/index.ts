import { post } from "../../../infra/rest";
import { SearchUserByNameResponse } from "../typings";

export const searchUserByName = async (query: string) => {
  return post<SearchUserByNameResponse, { query: string }>(
    "/api/user/search",
    false,
    {
      query,
    }
  )
};
