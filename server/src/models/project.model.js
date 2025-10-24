import { model } from 'mongoose';
import PROJECT_SCHEMA from '../schemas/project.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const PROJECT = model(COLLECTION_NAMES.PROJECTS, PROJECT_SCHEMA);

export default PROJECT;
