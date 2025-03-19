import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./NotificationCommentField";
import { UserContext } from "../App";

const NotificationCard = ({ data, index, notificationState }) => {

    let [isReplying, setIsReplying] = useState(false);

    let { type, reply, createdAt, comment, replied_on_comment, user, user: { personal_info: { fullname, username, profile_img } }, project: { _id, project_id, title }, _id: notification_id } = data;

    let { userAuth: { username: author_username, profile_img: author_profile_img, access_token } } = useContext(UserContext);

    const handleReplyClick = () => {
        setIsReplying(preVal => !preVal);
    }

    return (
        <div className="p-6 border-b border-gray-100 border-l-black">
            <div className="flex gap-5 mb-3">
                <img src={profile_img} alt="" className="w-14 h-14 flex-none rounded-full" />
                <div className="w-full">
                    <h1 className="font-medium text-xl text-gray-500">
                        <span className="lg:inline-block hidden capitalize">{fullname}</span>
                        <Link to={`/user/${username}`} className="mx-1 text-black underline">@{username}</Link>
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
                            <div className="p-4 mt-4 rounded-md bg-gray-100">
                                <p>{replied_on_comment.comment}</p>
                            </div> :
                            <Link to={`/project/${project_id}`} className="font-medium text-gray-500 hover:underline line-clamp-1">
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
                                reply ?
                                    <button
                                        className="underline hover:text-black"
                                        onClick={handleReplyClick}
                                    >
                                        Reply
                                    </button>
                                    : ""
                            }

                            <button
                                className="underline hover:text-black"
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
                    <div className="ml-20 p-5 bg-gray-100 mt-5 rounded-md">
                        <div className="flex gap-3 mb-3">
                            <img src={author_profile_img} className="w-8 h-8 rounded-full" alt="" />

                            <div>
                                <h1 className="font-medium text-xl text-gray-500">
                                    <Link to={`/user/${author_username}`} className="mx-1 text-black underline">@{author_username}</Link>

                                    <span className="font-normal">replied to</span>

                                    <Link to={`/user/${username}`} className="mx-1 text-black underline">@{username}</Link>
                                </h1>
                            </div>
                        </div>

                        <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>
                    </div>
                    : ""
            }
        </div>
    );
}

export default NotificationCard;
