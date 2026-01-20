export enum FeedbackCategory {
    ARTICLES = 'articles',
    CHATS = 'chats',
    CODE = 'code',
}

export interface SubmitFeedbackPayload {
    title: string;
    details: string;
    category: FeedbackCategory;
    reproduce_steps?: string;
    attachment?: File | null;
}

export interface FeedbackItem {
    _id: string;
    user_id: string;
    title: string;
    details: string;
    category: FeedbackCategory;
    reproduce_steps?: string;
    attachment_url?: string;
    attachment_public_id?: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: string;
    updatedAt: string;
}
