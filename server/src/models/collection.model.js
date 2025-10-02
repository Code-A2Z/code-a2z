import { model } from 'mongoose';
import collectionSchema from '../schemas/collection.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const Collection = model(COLLECTION_NAMES.COLLECTIONS, collectionSchema);

export default Collection;
