import { post } from "../../../infra/rest";
import {
  AuthorizeUserPayload,
  AuthorizeUserResponse,
} from "../typings";

export const authorizeUser = async (
  serverRoute: string,
  formData: AuthorizeUserPayload,
) => {
  return post<AuthorizeUserResponse, AuthorizeUserPayload>(
    serverRoute,
    false,
    formData,
    false,
  );
};

export const changePassword = async (
  formData: { [key: string]: string; },
) => {
  return post<AuthorizeUserResponse, { [key: string]: string }>(
    `/api/auth/change-password`,
    true,
    formData
  );
};
