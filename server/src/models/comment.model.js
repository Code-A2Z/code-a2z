import { model } from 'mongoose';
import commentSchema from '../schemas/comment.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const Comment = model(COLLECTION_NAMES.COMMENTS, commentSchema);

export default Comment;
