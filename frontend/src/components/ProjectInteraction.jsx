import { useContext, useEffect } from "react";
import { ProjectContext } from "../pages/Project";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const ProjectInteraction = () => {

    let { project, project: { _id, project_id, title, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setProject, islikedByUser, setLikedByUser } = useContext(ProjectContext);

    let { userAuth: { username, access_token } } = useContext(UserContext);

    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/like-status", { _id }, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
                .then(({ data: { isLiked } }) => {
                    setLikedByUser(Boolean(isLiked));
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [])

    const handleLike = () => {
        if (access_token) {
            setLikedByUser(preVal => !preVal);
            !islikedByUser ? total_likes++ : total_likes--;
            setProject({ ...project, activity: { ...activity, total_likes } });

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/like", { _id, islikedByUser }, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
                .then(({ data }) => {
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            toast.error("Please login to like this project");
        }
    }

    return (
        <>
            <Toaster />

            <hr className="border-gray-200 my-2" />

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleLike}
                        className={"w-10 h-10 rounded-full flex items-center justify-center " + (islikedByUser ? "bg-red-100 text-red-500" : "bg-gray-100")}
                    >
                        <i className={"fi " + (islikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                    </button>
                    <p className="text-xl text-gray-700">{total_likes}</p>

                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-gray-700">{total_comments}</p>
                </div>

                <div className="flex gap-6 items-center">

                    {
                        username === author_username ?
                            <Link to={`/editor/${project_id}`} className="underline hover:text-purple">Edit</Link> :
                            ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}$url=${location.href}`}>
                        <i className="fi fi-brands-twitter text-xl hover:text-[#1DA1F2]"></i>
                    </Link>
                </div>
            </div>

            <hr className="border-gray-200 my-2" />
        </>
    )
}

export default ProjectInteraction;
