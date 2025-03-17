import { Schema } from "mongoose";

const commentSchema = Schema(
    {
        project_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'projects'
        },
        project_author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'projects',
        },
        comment: {
            type: String,
            required: true
        },
        children: {
            type: [Schema.Types.ObjectId],
            ref: 'comments'
        },
        commented_by: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'users'
        },
        isReply: {
            type: Boolean,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'comments'
        }

    },
    {
        timestamps: {
            createdAt: 'commentedAt'
        }
    }
)

export default commentSchema;
