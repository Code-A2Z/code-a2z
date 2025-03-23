import express from "express";

import {
    authenticateUser
} from "../../Middlewares/auth.middleware.js";

import {
    getComments,
    getReplies,
    addComment,
    deleteComment
} from "../../Controllers/comment.controller.js";


const commentRoutes = express.Router();

commentRoutes.get("/get", getComments);
commentRoutes.get("/replies", getReplies);

// User protected routes
commentRoutes.post("/comment", authenticateUser, addComment);
commentRoutes.delete("/delete", authenticateUser, deleteComment);


export default commentRoutes;
