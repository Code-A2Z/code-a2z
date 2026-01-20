import { model } from 'mongoose';
import FEEDBACK_SCHEMA from '../schemas/feedback.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const FEEDBACK = model(COLLECTION_NAMES.FEEDBACK, FEEDBACK_SCHEMA);

export default FEEDBACK;
