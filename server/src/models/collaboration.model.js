import { model } from 'mongoose';
import COLLABORATION_SCHEMA from '../schemas/collaboration.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const COLLABORATION = model(
  COLLECTION_NAMES.COLLABORATION,
  COLLABORATION_SCHEMA
);

export default COLLABORATION;
