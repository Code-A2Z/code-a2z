import { model } from 'mongoose';
import USER_SCHEMA from '../schemas/user.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const USER = model(COLLECTION_NAMES.USERS, USER_SCHEMA);

export default USER;
