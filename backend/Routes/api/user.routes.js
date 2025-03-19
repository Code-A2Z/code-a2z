import express from 'express';
import { getProfile, searchUser, updateProfileImg } from '../../Controllers/user.controller.js';
import { authenticateUser } from '../../Middlewares/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.post("/search", searchUser);
userRoutes.post("/profile", getProfile);
userRoutes.post("/update-profile-img", authenticateUser, updateProfileImg);

export default userRoutes;
