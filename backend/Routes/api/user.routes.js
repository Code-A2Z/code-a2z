import express from 'express';
import { getProfile, searchUser } from '../../Controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.post("/search", searchUser);
userRoutes.post("/profile", getProfile);

export default userRoutes;
