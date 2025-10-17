export interface LikeProjectPayload {
  project_id: string;
  isLikedByUser: boolean;
}

export interface LikeProjectResponse {
  total_likes: number;
  liked_by_user: boolean;
}
