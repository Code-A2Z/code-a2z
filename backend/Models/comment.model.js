import mongoose from "mongoose";
import commentSchema from "../Schemas/comment.schema.js";

const Comment = mongoose.model("comments", commentSchema);

export default Comment;
