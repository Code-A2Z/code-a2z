export interface signUpPayload {
  fullname: string;
  email: string;
  password: string;
}

export interface loginPayload {
  email: string;
  password: string;
}

export interface changePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
