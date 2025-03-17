import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import CommentField from "./CommentField";
import { ProjectContext } from "../pages/Project";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment, _id, children } = commentData;

    let { project, project: { comments, comments: { results: commentsArr } }, setProject } = useContext(ProjectContext);

    let { userAuth: { access_token } } = useContext(UserContext);

    const [isReplying, setReplying] = useState(false);

    const removeCommentsCards = (startingPoint) => {
        if (commentsArr[startingPoint]) {
            while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {
                commentsArr.splice(startingPoint, 1);
                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }

        setProject({ ...project, comments: { results: commentsArr } });
    }

    const loadReplies = ({ skip = 0 }) => {
        if (children.length) {
            hideReplies();
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/get-replies", { _id, skip })
                .then(({ data: { replies } }) => {
                    commentData.isReplyLoaded = true;
                    for (let i = 0; i < replies.length; i++) {
                        replies[i].childrenLevel = commentData.childrenLevel + 1;
                        commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
                    }
                    setProject({ ...project, comments: { ...comments, results: commentsArr } });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const hideReplies = () => {
        commentData.isReplyLoaded = false;
        removeCommentsCards(index + 1);
    }

    const handleReplyClick = () => {
        if (!access_token) {
            return toast.error("Please login to reply");
        }
        setReplying(preVal => !preVal);
    }

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-gray-100">
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />

                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>

                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 items-center mt-5">
                    {
                        commentData.isReplyLoaded ?
                            <button
                                onClick={hideReplies}
                                className="text-gray-500 p-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-2"
                            >
                                <i className="fi fi-rs-comment-dots"></i> Hide Reply
                            </button> :
                            <button
                                onClick={loadReplies}
                                className="text-gray-500 p-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-2"
                            >
                                <i className="fi fi-rs-comment-dots"></i> {children.length} Reply
                            </button>
                    }

                    <button className="underline" onClick={handleReplyClick}>Reply</button>
                </div>

                {
                    isReplying ?
                        <div className="mt-8">
                            <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
                        </div>
                        : ""
                }
            </div>
        </div>
    )
}

export default CommentCard;
