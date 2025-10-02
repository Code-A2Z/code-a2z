export interface User {
  access_token: string | null;
  username: string;
  name: string;
  email: string;
  profile_img: string;
  fullname: string;
  role: number;
  new_notification_available: boolean;
}
