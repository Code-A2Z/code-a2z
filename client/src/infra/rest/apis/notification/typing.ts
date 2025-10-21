export interface GetNotificationsPayload {
  page?: number;
  filter?: 'all' | 'like' | 'comment' | 'reply';
  deletedDocCount?: number;
}

export interface AllNotificationsCountPayload {
  filter?: 'all' | 'like' | 'comment' | 'reply';
}
