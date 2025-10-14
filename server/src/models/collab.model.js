import { model } from 'mongoose';
import collabSchema from '../schemas/collab.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const Collab = model(COLLECTION_NAMES.COLLABS, collabSchema);

export default Collab;
