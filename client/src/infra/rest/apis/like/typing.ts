export interface LikeProjectPayload {
  project_id: string;
  is_liked_by_user: boolean;
}

export interface LikeProjectResponse {
  total_likes: number;
  liked_by_user: boolean;
}
