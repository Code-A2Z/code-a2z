import { useContext, useState } from "react";
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
    const [isReplyLoaded, setIsReplyLoaded] = useState(false);
    const [replies, setReplies] = useState([]);

    const loadReplies = async ({ skip = 0 }) => {
        if (children.length) {
            try {
                const { data: { replies: newReplies } } = await axios.post(
                    import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/get-replies", 
                    { _id, skip }
                );

                // Format replies with proper nesting structure
                const formattedReplies = newReplies.map(reply => ({
                    ...reply,
                    isReply: true,
                    childrenLevel: commentData.childrenLevel + 1
                }));

                setReplies(formattedReplies);
                setIsReplyLoaded(true);
            } catch (err) {
                console.log(err);
                setIsReplyLoaded(false);
            }
        }
    }

    const hideReplies = () => {
        setReplies([]);
        setIsReplyLoaded(false);
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

            // If this is a reply, update the parent's children array
            if (commentData.isReply && commentData.parent) {
                const parentComment = commentsArr.find(c => c._id === commentData.parent);
                if (parentComment) {
                    parentComment.children = parentComment.children.filter(childId => childId !== _id);
                }
            }

            // Remove this comment from the array if it's a parent comment
            if (!commentData.isReply) {
                commentsArr.splice(index, 1);

                setProject(prevProject => ({
                    ...prevProject,
                    comments: {
                        ...prevProject.comments,
                        results: [...commentsArr]
                    },
                    activity: {
                        ...prevProject.activity,
                        total_parent_comments: prevProject.activity.total_parent_comments - 1
                    }
                }));

                setTotalParentCommentsLoaded(prev => prev - 1);
            }

            e.target.removeAttribute("disabled");
        } catch (err) {
            console.log(err);
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
                    <div className="mt-4">
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
