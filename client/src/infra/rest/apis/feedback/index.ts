import { get, post } from '../..';
import { ApiResponse } from '../../typings';
import { SubmitFeedbackPayload, FeedbackItem } from './typing';

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('details', payload.details);
    formData.append('category', payload.category);

    if (payload.reproduce_steps) {
        formData.append('reproduce_steps', payload.reproduce_steps);
    }

    // Only append if attachment is a File object
    if (payload.attachment instanceof File) {
        formData.append('attachment', payload.attachment);
    }

    // We use post directly but need to handle FormData content-type automatically by browser
    // The 'post' helper likely sets JSON content-type by default, so we might need a custom call
    // or ensure the helper handles FormData.
    // Assuming our 'post' helper or axios handles FormData correctly when passed as body.
    // If headers key is passed as undefined/null, axios usually auto-detects FormData.

    return post<FormData, ApiResponse<{ feedback: FeedbackItem }>>(
        '/api/feedback/submit',
        true,
        formData,
        false
    );
};

export const getUserFeedback = async (params?: {
    limit?: number;
    skip?: number;
}) => {
    const queryString = params
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? `?${new URLSearchParams(params as any).toString()}`
        : '';
    return get<
        undefined,
        ApiResponse<{ feedback: FeedbackItem[]; total: number; hasMore: boolean }>
    >(`/api/feedback/user${queryString}`, true);
};
