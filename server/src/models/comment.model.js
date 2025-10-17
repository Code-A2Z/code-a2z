import { model } from 'mongoose';
import COMMENT_SCHEMA from '../schemas/comment.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const COMMENT = model(COLLECTION_NAMES.COMMENTS, COMMENT_SCHEMA);

export default COMMENT;
