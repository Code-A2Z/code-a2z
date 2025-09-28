export interface Comment {
  _id: string;
  user_id: string;
  comment: string;
  commentedAt: string;
  children: string[];
  childrenLevel?: number;
  isReplyLoaded?: boolean; // Dynamic property for UI state
}

// Re-export types from other files
export * from './project';
export * from './user';
export * from './profile';
export * from './notification';
