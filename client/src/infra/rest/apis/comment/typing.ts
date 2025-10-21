export interface AddCommentPayload {
  _id: string;
  comment: string;
  project_author: string;
  replying_to: string;
  notification_id: string;
}

export interface AddCommentResponse {
  _id: string;
  comment: string;
  createdAt: Date;
  user_id: string;
  children: [];
}

export interface GetCommentsPayload {
  project_id?: string;
  skip?: number;
}

export interface GetCommentsResponse {
  _id: string;
  project_id: string;
  project_author: string;
  comment: string;
  children: [];
  commented_by: {
    personal_info: {
      fullname: string;
      username: string;
      profile_img: string;
    };
  };
  isReply: boolean;
  parent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetRepliesPayload {
  comment_id?: string;
  skip?: number;
}
