import express from "express";
import { signup, login, changePassword } from "../../Controllers/auth.controller.js";
import jwt from "jsonwebtoken";
import User from "../../Models/user.model.js";
import { formatDataToSend } from "../../utils/helpers.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/change-password", authenticateUser, changePassword);

// read cookie and return user payload if valid
authRoutes.get("/session", async (req, res) => {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ error: "No session" });
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid session" });
        try {
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ error: "User not found" });
            const payload = formatDataToSend(user);
            return res.status(200).json(payload);
        } catch (e) {
            return res.status(500).json({ error: "Failed to load session" });
        }
    });
});

// Logout: clear cookie
authRoutes.post("/logout", (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    return res.status(200).json({ message: "Logged out" });
});

export default authRoutes;
