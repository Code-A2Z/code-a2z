import { patch, post } from '../..';
import { USER_DB_STATE } from '../../typings';
import { ApiResponse, BaseApiResponse } from '../../typings';
import { signUpPayload, loginPayload, changePasswordPayload } from './typing';

export const signUp = async (signUpPayload: signUpPayload) => {
  return post<
    signUpPayload,
    ApiResponse<{ user: USER_DB_STATE; access_token: string }>
  >('/api/auth/signup', false, signUpPayload);
};

export const login = async (loginPayload: loginPayload) => {
  return post<
    loginPayload,
    ApiResponse<{ user: USER_DB_STATE; access_token: string }>
  >('/api/auth/login', false, loginPayload);
};

export const refreshToken = async () => {
  return post<undefined, ApiResponse<{ access_token: string }>>(
    `/api/auth/refresh`,
    true
  );
};

export const logout = async () => {
  return post<undefined, BaseApiResponse>(`/api/auth/logout`, true);
};

export const changePassword = async (
  changePasswordPayload: changePasswordPayload
) => {
  return patch<changePasswordPayload, BaseApiResponse>(
    `/api/auth/change-password`,
    true,
    changePasswordPayload
  );
};
