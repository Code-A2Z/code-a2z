import express from "express";
import authenticateUser from "../../middlewares/auth.middleware.js";
import { signup, login, changePassword } from "../../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/change-password", authenticateUser, changePassword);

export default authRoutes;
