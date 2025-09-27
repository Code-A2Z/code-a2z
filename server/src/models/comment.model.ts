import { model } from "mongoose";
import commentSchema from "../schemas/comment.schema";

const Comment = model("comments", commentSchema);

export default Comment;
