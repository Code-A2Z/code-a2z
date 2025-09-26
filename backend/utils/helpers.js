import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../Models/user.model.js";

export const emailRegex = /^\w+([/.-]?\w+)*@\w+([/.-]?\w+)*(\.\w{2,3})+$/;
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export const formatDataToSend = (user) => {

    // Generate JWT Token
    const access_token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_ACCESS_KEY, { expiresIn: "7d" });

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        role: user.role
    };
};

export const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({ "personal_info.username": username });
    if (isUsernameNotUnique) username += nanoid().substring(0, 5);
    return username;
};
