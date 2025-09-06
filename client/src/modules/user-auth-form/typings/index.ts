export interface AuthorizeUserPayload {
  email: string;
  password: string;
  fullname?: string;
}

export interface AuthorizeUserResponse {
  access_token: string;
  profile_img: string;
  username: string;
  fullname: string;
  role: number;
};