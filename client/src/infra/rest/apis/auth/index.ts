import { patch, post } from '../..';
import { UserDBState } from '../../../../shared/typings';
import ApiResponse, { BaseApiResponse } from '../../typing';
import { signUpPayload, loginPayload, changePasswordPayload } from './typing';

export const signUp = async (signUpPayload: signUpPayload) => {
  return post<signUpPayload, ApiResponse<UserDBState>>(
    '/api/auth/signup',
    false,
    signUpPayload,
    false
  );
};

export const login = async (loginPayload: loginPayload) => {
  return post<loginPayload, ApiResponse<UserDBState>>(
    '/api/auth/login',
    false,
    loginPayload,
    false
  );
};

export const refreshToken = async () => {
  return post<undefined, BaseApiResponse>(
    `/api/auth/refresh-token`,
    true,
    undefined,
    false
  );
};

export const logout = async () => {
  return post<undefined, BaseApiResponse>(
    `/api/auth/logout`,
    true,
    undefined,
    false
  );
};

export const changePassword = async (
  changePasswordPayload: changePasswordPayload
) => {
  return patch<changePasswordPayload, BaseApiResponse>(
    `/api/auth/change-password`,
    true,
    changePasswordPayload,
    false
  );
};
