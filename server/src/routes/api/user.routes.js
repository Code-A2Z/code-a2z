import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import getProfile from '../../controllers/user/get-profile.js';
import searchUser from '../../controllers/user/search-user.js';
import updateProfile from '../../controllers/user/update-profile.js';
import updateProfileImg from '../../controllers/user/update-profile-img.js';

const userRoutes = express.Router();

userRoutes.post('/search', searchUser);
userRoutes.post('/profile', getProfile);
userRoutes.post('/update-profile-img', authenticateUser, updateProfileImg);
userRoutes.post('/update-profile', authenticateUser, updateProfile);

export default userRoutes;
