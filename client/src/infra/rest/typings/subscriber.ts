export interface SUBSCRIBER_DB_STATE {
  _id: string;
  email: string;
  is_subscribed: boolean;
  subscribed_at: Date;
  unsubscribed_at: Date | null;
  joinedAt: Date;
  updatedAt: Date;
}
