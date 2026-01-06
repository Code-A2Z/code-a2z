import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import getProfile from '../../controllers/user/get-profile.js';
import getCurrentUser from '../../controllers/user/get-current-user.js';
import searchUser from '../../controllers/user/search-user.js';
import updateProfile from '../../controllers/user/update-profile.js';
import updateProfileImg from '../../controllers/user/update-profile-img.js';

const userRoutes = express.Router();

userRoutes.get('/search', searchUser);
userRoutes.get('/profile', getProfile);
userRoutes.get('/me', authenticateUser, getCurrentUser);
userRoutes.patch('/update-profile-img', authenticateUser, updateProfileImg);
userRoutes.patch('/update-profile', authenticateUser, updateProfile);

export default userRoutes;
