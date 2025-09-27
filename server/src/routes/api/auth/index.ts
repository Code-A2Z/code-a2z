import express from "express";

// Import authentication middleware
import authenticateUser from "../../../middlewares/auth.middleware";

// Import controller functions
import signup from "./controllers/signup";
import login from "./controllers/login";
import changePassword from "./controllers/change-password";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/change-password", authenticateUser, changePassword);

export default authRoutes;
