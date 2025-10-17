import { model } from 'mongoose';
import NOTIFICATION_SCHEMA from '../schemas/notification.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const NOTIFICATION = model(COLLECTION_NAMES.NOTIFICATIONS, NOTIFICATION_SCHEMA);

export default NOTIFICATION;
