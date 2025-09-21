import { model } from "mongoose";
import userSchema from "../schemas/user.schema";

const User = model("users", userSchema);

export default User;
