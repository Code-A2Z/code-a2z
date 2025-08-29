import mongoose from 'mongoose';
import collaborationSchema from '../Schemas/collaboration.schema.js';

const collaboration = mongoose.model('collaborators', collaborationSchema);

export default collaboration;