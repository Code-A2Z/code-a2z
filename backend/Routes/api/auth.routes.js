import express from "express";

import { 
    authenticateUser 
} from "../../Middlewares/auth.middleware.js";

import {
    register,
    login,
    googleAuth,
    changePassword
} from "../../Controllers/auth.controller.js";


const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/oauth/google", googleAuth);

// User protected routes
authRoutes.patch("/password", authenticateUser, changePassword);


export default authRoutes;
