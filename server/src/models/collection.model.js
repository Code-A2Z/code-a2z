import { model } from 'mongoose';
import COLLECTION_SCHEMA from '../schemas/collection.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const COLLECTION = model(COLLECTION_NAMES.COLLECTIONS, COLLECTION_SCHEMA);

export default COLLECTION;
