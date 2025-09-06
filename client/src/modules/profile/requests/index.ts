import { post } from "../../../infra/rest"
import { GetUserProfileResponse } from "../typings";

export const getUserProfile = async (username: string) => {
  return post<GetUserProfileResponse, { username: string }>(
    `/api/user/profile`,
    false,
    {
      username,
    }
  )
};
