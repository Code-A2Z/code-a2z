import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { ProjectContext } from "../pages/Project";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {

    let { project, project: { _id, author: { _id: project_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } }, setProject, totalParentCommentsLoaded, setTotalParentCommentsLoaded } = useContext(ProjectContext);

    let { userAuth: { access_token, username, fullname, profile_img } } = useContext(UserContext);

    const [comment, setComment] = useState('');

    const handleComment = () => {
        if (!access_token) {
            return toast.error("Please login to comment");
        }
        if (!comment.length) {
            return toast.error("Write something to leave a comment...");
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/comment", {
            _id, comment, project_author, replying_to: replyingTo
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                setComment('');

                const newCommentData = {
                    ...data,
                    commented_by: {
                        personal_info: {
                            username,
                            fullname,
                            profile_img
                        }
                    },
                    children: [],
                    replies: [],
                    isReplyLoaded: false
                };

                let newCommentArr;

                if (replyingTo) {
                    // Find the parent comment (could be a reply itself)
                    const parentCommentIndex = commentsArr.findIndex(comment => {
                        // Check in main comments array
                        if (comment._id === replyingTo) return true;

                        // Check in replies array recursively
                        if (comment.replies && comment.replies.length) {
                            return comment.replies.some(reply => reply._id === replyingTo);
                        }
                        return false;
                    });

                    if (parentCommentIndex !== -1) {
                        const updateReplies = (replies) => {
                            return replies.map(reply => {
                                if (reply._id === replyingTo) {
                                    // This is the direct parent of our new reply
                                    newCommentData.isReply = true;
                                    newCommentData.parent = replyingTo;
                                    newCommentData.childrenLevel = reply.childrenLevel + 1;

                                    if (!reply.children) reply.children = [];
                                    reply.children.push(newCommentData._id);

                                    if (!reply.replies) reply.replies = [];
                                    reply.replies.push(newCommentData);
                                    reply.isReplyLoaded = true;

                                    return reply;
                                } else if (reply.replies && reply.replies.length) {
                                    // Check nested replies
                                    return {
                                        ...reply,
                                        replies: updateReplies(reply.replies)
                                    };
                                }
                                return reply;
                            });
                        };

                        const parentComment = commentsArr[parentCommentIndex];

                        if (parentComment._id === replyingTo) {
                            // Replying to a main comment
                            newCommentData.isReply = true;
                            newCommentData.parent = replyingTo;
                            newCommentData.childrenLevel = parentComment.childrenLevel + 1;

                            parentComment.children.push(newCommentData._id);

                            if (parentComment.isReplyLoaded) {
                                if (!parentComment.replies) {
                                    parentComment.replies = [];
                                }
                                parentComment.replies.push(newCommentData);
                            }
                        } else if (parentComment.replies) {
                            // Replying to a nested reply
                            parentComment.replies = updateReplies(parentComment.replies);
                        }

                        newCommentArr = [...commentsArr];
                        newCommentArr[parentCommentIndex] = parentComment;
                    } else {
                        newCommentArr = [...commentsArr];
                    }
                    setReplying(false);
                } else {
                    // New parent comment
                    newCommentData.childrenLevel = 0;
                    newCommentArr = [newCommentData, ...commentsArr];
                }

                let parentCommentIncrementval = replyingTo ? 0 : 1;

                setProject({
                    ...project,
                    comments: {
                        ...comments,
                        results: newCommentArr
                    },
                    activity: {
                        ...activity,
                        total_comments: total_comments + 1,
                        total_parent_comments: total_parent_comments + parentCommentIncrementval
                    }
                });

                setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementval);
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to post comment. Please try again.");
            })
    }

    return (
        <>
            <Toaster />

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-gray-500 resize-none h-[150px] overflow-auto"
            >
            </textarea>
            <button
                className="btn-dark mt-5 px-10"
                onClick={handleComment}
            >
                {action}
            </button>
        </>
    );
}

export default CommentField;
