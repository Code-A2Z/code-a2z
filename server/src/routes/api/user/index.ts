import express from 'express';

// Import authentication middleware
import authenticateUser from '../../../middlewares/auth.middleware';

// Import controller functions
import searchUser from './controllers/search-user';
import getProfile from './controllers/get-profile';
import updateProfileImg from './controllers/update-profile-img';
import updateProfile from './controllers/update-profile';

const userRoutes = express.Router();

userRoutes.post("/search", searchUser);
userRoutes.post("/profile", getProfile);
userRoutes.post("/update-profile-img", authenticateUser, updateProfileImg);
userRoutes.post("/update-profile", authenticateUser, updateProfile);

export default userRoutes;
