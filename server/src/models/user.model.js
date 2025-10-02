import { model } from 'mongoose';
import userSchema from '../schemas/user.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const User = model(COLLECTION_NAMES.USERS, userSchema);

export default User;
