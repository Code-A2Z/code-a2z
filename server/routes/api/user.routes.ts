import express from 'express';
import authenticateUser from '../../middlewares/auth.middleware';
import {
  getProfile,
  searchUser,
  updateProfile,
  updateProfileImg,
} from '../../controllers/user.controller';

const userRoutes = express.Router();

userRoutes.post("/search", searchUser);
userRoutes.post("/profile", getProfile);
userRoutes.post("/update-profile-img", authenticateUser, updateProfileImg);
userRoutes.post("/update-profile", authenticateUser, updateProfile);

export default userRoutes;
