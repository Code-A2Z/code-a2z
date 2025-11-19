import { model } from 'mongoose';
import USER_SCHEMA from '../schemas/user.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

// Add role field to USER_SCHEMA if not already present
USER_SCHEMA.add({
  role: {
    type: String,
    enum: ["USER", "COLLABORATOR", "MAINTAINER", "ADMIN"],
    default: "USER"
  }
});

const USER = model(COLLECTION_NAMES.USERS, USER_SCHEMA);

export default USER;
