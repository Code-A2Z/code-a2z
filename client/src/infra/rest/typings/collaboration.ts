export enum COLLABORATION_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface COLLABORATION_DB_STATE {
  _id: string;
  user_id: string; // The collaborator sending the invite request
  project_id: string;
  author_id: string; // The owner of the project
  status: COLLABORATION_STATUS;
  token: string;
  joinedAt: Date;
  updatedAt: Date;
}
