import { useContext, useState, useEffect } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import CommentField from "./CommentField";
import { ProjectContext } from "../pages/Project";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
    let { commented_by: { personal_info: { profile_img, fullname, username: commented_by_username } }, commentedAt, comment, _id, children } = commentData;

    let { project, project: { comments, comments: { results: commentsArr }, activity, activity: { total_parent_comments }, author: { personal_info: { username: blog_author } } }, setProject, setTotalParentCommentsLoaded } = useContext(ProjectContext);

    let { userAuth: { access_token, username } } = useContext(UserContext);

    const [isReplying, setReplying] = useState(false);
    const [isReplyLoaded, setIsReplyLoaded] = useState(commentData.isReplyLoaded || false);
    const [replies, setReplies] = useState(commentData.replies || []);

    // Update replies when commentData changes
    useEffect(() => {
        if (commentData.replies) {
            setReplies(commentData.replies);
            setIsReplyLoaded(commentData.isReplyLoaded);
        }
    }, [commentData.replies, commentData.isReplyLoaded]);

    const loadReplies = async ({ skip = 0 }) => {
        if (children && children.length) {
            try {
                const { data: { replies: newReplies } } = await axios.post(
                    import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/get-replies", 
                    { _id, skip }
                );

                // Format replies with proper nesting structure
                const formattedReplies = newReplies.map(reply => ({
                    ...reply,
                    isReply: true,
                    parent: _id,
                    childrenLevel: commentData.childrenLevel + 1,
                    children: reply.children || [],
                    replies: [],
                    isReplyLoaded: false
                }));

                setReplies(formattedReplies);
                setIsReplyLoaded(true);

                // Update the comment in the main array
                const updateCommentsWithReplies = (comments) => {
                    return comments.map(comment => {
                        if (comment._id === _id) {
                            return {
                                ...comment,
                                replies: formattedReplies,
                                isReplyLoaded: true
                            };
                        } else if (comment.replies && comment.replies.length) {
                            return {
                                ...comment,
                                replies: updateCommentsWithReplies(comment.replies)
                            };
                        }
                        return comment;
                    });
                };

                const updatedCommentsArr = updateCommentsWithReplies(commentsArr);

                setProject(prevProject => ({
                    ...prevProject,
                    comments: {
                        ...prevProject.comments,
                        results: updatedCommentsArr
                    }
                }));
            } catch (err) {
                console.log(err);
                toast.error("Failed to load replies. Please try again.");
                setIsReplyLoaded(false);
            }
        }
    }

    const hideReplies = () => {
        setReplies([]);
        setIsReplyLoaded(false);

        // Update the comment in the main array
        const updateCommentsWithHiddenReplies = (comments) => {
            return comments.map(comment => {
                if (comment._id === _id) {
                    return {
                        ...comment,
                        replies: [],
                        isReplyLoaded: false
                    };
                } else if (comment.replies && comment.replies.length) {
                    return {
                        ...comment,
                        replies: updateCommentsWithHiddenReplies(comment.replies)
                    };
                }
                return comment;
            });
        };

        const updatedCommentsArr = updateCommentsWithHiddenReplies(commentsArr);

        setProject(prevProject => ({
            ...prevProject,
            comments: {
                ...prevProject.comments,
                results: updatedCommentsArr
            }
        }));
    }

    const handleReplyClick = () => {
        if (!access_token) {
            return toast.error("Please login to reply");
        }
        setReplying(preVal => !preVal);
    }

    const deleteComment = async (e) => {
        e.target.setAttribute("disabled", true);

        try {
            await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/delete-comment", 
                { _id }, 
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            );

            // If this is a reply, update the parent's children array and replies
            if (commentData.isReply && commentData.parent) {
                const updateCommentsAfterDelete = (comments) => {
                    return comments.map(comment => {
                        if (comment._id === commentData.parent) {
                            return {
                                ...comment,
                                children: comment.children.filter(childId => childId !== _id),
                                replies: comment.replies ? comment.replies.filter(reply => reply._id !== _id) : []
                            };
                        } else if (comment.replies && comment.replies.length) {
                            return {
                                ...comment,
                                replies: updateCommentsAfterDelete(comment.replies)
                            };
                        }
                        return comment;
                    });
                };

                const updatedCommentsArr = updateCommentsAfterDelete(commentsArr);

                setProject(prevProject => ({
                    ...prevProject,
                    comments: {
                        ...prevProject.comments,
                        results: updatedCommentsArr
                    },
                    activity: {
                        ...prevProject.activity,
                        total_comments: prevProject.activity.total_comments - 1
                    }
                }));
            } else {
                // Remove parent comment and all its replies
                const updatedCommentsArr = commentsArr.filter(comment => comment._id !== _id);
                
                // Count total replies recursively
                const countReplies = (comment) => {
                    let count = 0;
                    if (comment.children) {
                        count += comment.children.length;
                        comment.children.forEach(child => {
                            const childComment = commentsArr.find(c => c._id === child);
                            if (childComment) {
                                count += countReplies(childComment);
                            }
                        });
                    }
                    return count;
                };

                const totalReplies = countReplies(commentData);
                
                setProject(prevProject => ({
                    ...prevProject,
                    comments: {
                        ...prevProject.comments,
                        results: updatedCommentsArr
                    },
                    activity: {
                        ...prevProject.activity,
                        total_comments: prevProject.activity.total_comments - (1 + totalReplies),
                        total_parent_comments: prevProject.activity.total_parent_comments - 1
                    }
                }));

                setTotalParentCommentsLoaded(prev => prev - 1);
            }

            e.target.removeAttribute("disabled");
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete comment. Please try again.");
            e.target.removeAttribute("disabled");
        }
    }

    return (
        <div className="w-full">
            <div className={"my-5 p-6 rounded-md border border-gray-100"} style={{ marginLeft: `${leftVal * 20}px` }}>
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">
                        {fullname} @{commented_by_username}
                        {commentData.isReply && <span className="text-gray-500 text-sm ml-2">replied to a comment</span>}
                    </p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>

                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 items-center mt-5">
                    {children && children.length > 0 && (
                        isReplyLoaded ? (
                            <button
                                onClick={hideReplies}
                                className="text-gray-500 p-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-2"
                            >
                                <i className="fi fi-rs-comment-dots"></i> Hide Replies
                            </button>
                        ) : (
                            <button
                                onClick={() => loadReplies({ skip: 0 })}
                                className="text-gray-500 p-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-2"
                            >
                                <i className="fi fi-rs-comment-dots"></i> Show {children.length} {children.length === 1 ? "Reply" : "Replies"}
                            </button>
                        )
                    )}

                    <button className="underline" onClick={handleReplyClick}>Reply</button>

                    {(username === commented_by_username || username === blog_author) && (
                        <button
                            onClick={deleteComment}
                            className="p-2 px-3 rounded-md border border-gray-100 ml-auto hover:bg-red-50 hover:text-red-500 flex items-center"
                        >
                            <i className="fi fi-rr-trash"></i>
                        </button>
                    )}
                </div>

                {isReplying && (
                    <div className="mt-8">
                        <CommentField 
                            action="reply" 
                            index={index} 
                            replyingTo={_id} 
                            setReplying={setReplying}
                        />
                    </div>
                )}

                {/* Display replies if loaded */}
                {isReplyLoaded && replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l border-gray-100">
                        {replies.map((reply, i) => (
                            <CommentCard 
                                key={reply._id}
                                index={i} 
                                leftVal={leftVal + 1}
                                commentData={reply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentCard;
