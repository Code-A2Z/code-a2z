import express from "express";
import { register, login, googleAuth, changePassword } from "../../Controllers/auth.controller.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/oauth/google", googleAuth);
authRoutes.patch("/password", authenticateUser, changePassword);

export default authRoutes;
