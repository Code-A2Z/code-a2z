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
  current_password: string;
  new_password: string;
}
