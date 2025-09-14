import { nanoid } from "nanoid";
import User from "../models/user.model";

const generateUsername = async (email: string) => {
  let username = email.split("@")[0];
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username });
  if (isUsernameNotUnique) username += nanoid().substring(0, 5);
  return username;
};

export default generateUsername;
