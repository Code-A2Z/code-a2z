import { model } from 'mongoose';
import subscriberSchema from '../schemas/subscriber.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const Subscriber = model(COLLECTION_NAMES.SUBSCRIBERS, subscriberSchema);

export default Subscriber;
