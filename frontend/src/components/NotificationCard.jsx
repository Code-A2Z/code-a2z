import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./NotificationCommentField";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationState }) => {

    let [isReplying, setIsReplying] = useState(false);

    let { seen, type, reply, createdAt, comment, replied_on_comment, user, user: { personal_info: { fullname, username, profile_img } }, project: { _id, project_id, title }, _id: notification_id } = data;

    let { userAuth: { username: author_username, profile_img: author_profile_img, access_token } } = useContext(UserContext);

    let { notifications, notifications: { results, totalDocs }, setNotifications } = notificationState;

    const handleReplyClick = () => {
        setIsReplying(preVal => !preVal);
    }

    const handleDelete = (comment_id, type, target) => {

        target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/delete-comment", { _id: comment_id }, { withCredentials: true })
            .then(() => {
                if (type === "comment") {
                    results.splice(index, 1);
                } else {
                    delete results[index].reply;
                }

                target.removeAttribute("disabled");
                setNotifications({ ...notifications, results, totalDocs: totalDocs - 1, deleteDocCount: notifications.deleteDocCount + 1 });
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className={"p-6 border-b border-gray-100 border-l-black " + (!seen ? "border-l-2" : "")}>
            <div className="flex gap-5 mb-3">
                <img src={profile_img} alt="" className="w-14 h-14 flex-none rounded-full" />
                <div className="w-full">
                    <h1 className="font-medium text-xl text-gray-500">
                        <span className="lg:inline-block hidden capitalize">{fullname}</span>
                        <Link
                            to={`/user/${username}`}
                            className="mx-1 text-black underline hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                        >
                            @{username}
                        </Link>
                        <span className="font-normal">
                            {
                                type === 'like' ? "liked your project" :
                                    type === 'comment' ? "commented on" :
                                        "replied on"
                            }
                        </span>
                    </h1>

                    {
                        type === 'reply' ?
                            <div className="p-4 mt-4 rounded-md bg-gray-100 dark:bg-gray-700">
                                <p>{replied_on_comment.comment}</p>
                            </div> :
                            <Link
                                to={`/project/${project_id}`}
                                className="font-medium text-gray-500 hover:underline line-clamp-1 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                {`"${title}"`}
                            </Link>
                    }
                </div>
            </div>

            {
                type !== 'like' ?
                    <p className="ml-14 pl-5 font-gelasio text-xl my-5">{comment.comment}</p>
                    : ""
            }

            <div className="ml-14 pl-5 mt-3 text-gray-500 flex gap-8">
                <p>{getDay(createdAt)}</p>

                {
                    type !== 'like' ?
                        <>
                            {
                                !reply ?
                                    <button
                                        className="underline hover:text-black dark:hover:text-white"
                                        onClick={handleReplyClick}
                                    >
                                        Reply
                                    </button>
                                    : ""
                            }

                            <button
                                className="underline hover:text-black dark:hover:text-white"
                                onClick={(e) => handleDelete(comment._id, "comment", e.target)}
                            >
                                Delete
                            </button>
                        </>
                        : ""
                }
            </div>

            {
                isReplying ?
                    <div className="mt-8">
                        <NotificationCommentField _id={_id} project_author={user} index={index} replyingTo={comment._id} setReplying={setIsReplying} notification_id={notification_id} notificationData={notificationState} />
                    </div>
                    : ""
            }

            {
                reply ?
                    <div className="ml-20 p-5 bg-gray-100 dark:bg-gray-700 mt-5 rounded-md">
                        <div className="flex gap-3 mb-3">
                            <img src={author_profile_img} className="w-8 h-8 rounded-full" alt="" />

                            <div>
                                <h1 className="font-medium text-xl text-gray-500">
                                    <Link to={`/user/${author_username}`} className="mx-1 text-black dark:text-white underline">@{author_username}</Link>

                                    <span className="font-normal">replied to</span>

                                    <Link to={`/user/${username}`} className="mx-1 text-black dark:text-white underline">@{username}</Link>
                                </h1>
                            </div>
                        </div>

                        <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>

                        <button
                            className="underline hover:text-black hover:dark:text-white ml-14 mt-2"
                            onClick={(e) => handleDelete(reply._id, "reply", e.target)}
                        >
                            Delete
                        </button>

                    </div>
                    : ""
            }
        </div>
    );
}

export default NotificationCard;
