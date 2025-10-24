import { model } from 'mongoose';
import SUBSCRIBER_SCHEMA from '../schemas/subscriber.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const SUBSCRIBER = model(COLLECTION_NAMES.SUBSCRIBERS, SUBSCRIBER_SCHEMA);

export default SUBSCRIBER;
