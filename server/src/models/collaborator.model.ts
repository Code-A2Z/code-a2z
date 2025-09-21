import { model } from 'mongoose';
import collaboratorSchema from '../schemas/collaborator.schema';

const Collaborator = model('collaborators', collaboratorSchema);

export default Collaborator;
