import express from 'express';

import {
    authenticateUser
} from '../../Middlewares/auth.middleware.js';

import {
    getProfile,
    searchUser,
    updateProfile,
    updateProfileImg
} from '../../Controllers/user.controller.js';


const userRoutes = express.Router();

userRoutes.get("/search", searchUser);
userRoutes.get("/profile", getProfile);

// Protected routes
userRoutes.patch("/update-profile-img", authenticateUser, updateProfileImg);
userRoutes.patch("/update-profile", authenticateUser, updateProfile);


export default userRoutes;
