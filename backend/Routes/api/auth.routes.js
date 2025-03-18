import express from "express";
import { signup, login, googleAuth, changePassword } from "../../Controllers/auth.controller.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/google-auth", googleAuth);
authRoutes.post("/change-password", authenticateUser, changePassword);

export default authRoutes;
