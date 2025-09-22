export interface Comment {
  _id: string;
  user_id: string;
  comment: string;
  commentedAt: string;
  children: string[];
  childrenLevel?: number;
};
