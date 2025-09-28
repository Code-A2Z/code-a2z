import { model } from 'mongoose';
import notificationSchema from '../schemas/notification.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const Notification = model(COLLECTION_NAMES.NOTIFICATIONS, notificationSchema);

export default Notification;
