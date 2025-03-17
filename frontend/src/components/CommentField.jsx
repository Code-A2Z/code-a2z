import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { ProjectContext } from "../pages/Project";

const CommentField = ({ action }) => {

    let { project, project: { _id, author: { _id: project_author }, comments, activity, activity: { total_comments, total_parent_comments } }, setProject, totalParentCommentsLoaded, setTotalParentCommentsLoaded } = useContext(ProjectContext);

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
            _id, comment, project_author
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                setComment('');

                data.commented_by = { personal_info: { username, fullname, profile_img } };

                let newCommentArr;

                data.childrenLevel = 0;

                newCommentArr = [data]

                let parentCommentIncrementval = 1;

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
