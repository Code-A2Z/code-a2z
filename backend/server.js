import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import router from "./Routes/index.js";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 8000;
const CLIENT_URLS = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map(u => u.trim());

// Middleware
server.use(express.json());
server.use(cookieParser());
server.set("trust proxy", 1);
server.use(cors({
    origin: CLIENT_URLS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

//CORS
server.use(cors({
    origin: process.env.VITE_SERVER_DOMAIN, // Allow only your frontend
    credentials: true
}));

// Connect to Database
connectDB();

// Routes
server.get("/", (req, res) => res.send("Backend is running..."));
server.get("/health", (req, res) => res.status(200).json({ ok: true }));
server.use("/api", router);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
