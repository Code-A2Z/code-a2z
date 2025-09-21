import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";
import router from "./routes";
import { errorHandler } from "./middlewares/error.handler";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 8000;

// Middleware
server.use(express.json());
server.use(cors());
server.use(errorHandler);

// Connect to Database
connectDB();

// Routes
server.get("/", (_, res) => res.send("Backend is running..."));
server.use("/api", router);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
