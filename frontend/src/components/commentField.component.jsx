// root packages 
import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

// pages files 
import { ProjectContext } from "../pages/Project.page";

// src files 
import { UserContext } from "../App";

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

                data.commented_by = { personal_info: { username, fullname, profile_img } };

                let newCommentArr;

                if (replyingTo) {
                    commentsArr[index].children.push(data._id);
                    data.childrenLevel = commentsArr[index].childrenLevel + 1;
                    data.parentIndex = index;
                    commentsArr[index].isReplyLoaded = true;
                    commentsArr.splice(index + 1, 0, data);
                    newCommentArr = commentsArr;
                    setReplying(false);
                } else {
                    data.childrenLevel = 0;
                    newCommentArr = [data, ...commentsArr];
                }

                let parentCommentIncrementval = replyingTo ? 0 : 1;

                setProject({ ...project, comments: { ...comments, results: newCommentArr }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrementval } })

                setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementval);
            })
            .catch(err => {
                console.log(err);
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
