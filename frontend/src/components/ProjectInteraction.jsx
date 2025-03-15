import { useContext } from "react";
import { ProjectContext } from "../pages/Project";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const ProjectInteraction = () => {

    let { project: { project_id, title, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setProject } = useContext(ProjectContext);

    let { userAuth: { username } } = useContext(UserContext);

    return (
        <>
            <hr className="border-gray-200 my-2" />

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                        <i className="fi fi-rr-heart"></i>
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
