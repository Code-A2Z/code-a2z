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
