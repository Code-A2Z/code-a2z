import { model } from 'mongoose';
import projectSchema from '../schemas/project.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const Project = model(COLLECTION_NAMES.PROJECTS, projectSchema);

export default Project;
