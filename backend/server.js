import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import router from "./Routes/index.js";


// Security
import { securityMiddleware } from './Middlewares/security/security.js'


dotenv.config();

const server = express();
const PORT = process.env.PORT || 8000;

// Middleware
server.use(express.json());
server.use(cors());

// Security middlewares 
securityMiddleware(server);

// Connect to Database
connectDB();

// Routes
server.get("/", (req, res) => res.send("Backend is running..."));
server.use("/api", router);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));