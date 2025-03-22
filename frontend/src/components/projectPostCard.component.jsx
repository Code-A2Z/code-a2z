// root packages 
import { Link } from "react-router-dom";

// common files 
import { getDay } from "../common/date";

const ProjectPostCard = ({ content, author }) => {

    let { publishedAt, tags, title, des, banner, activity: { total_likes }, project_id: id } = content;
    let { fullname, profile_img, username } = author;
    return (
        <Link to={`/project/${id}`} className="flex gap-8 items-center border-b border-gray-200 pb-5 mb-4">
            <div className="w-full">
                <div className="flex gap-2 items-center mb-7">
                    <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{getDay(publishedAt)}</p>
                </div>

                <h1 className="project-title">{title}</h1>
                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{des}</p>

                <div className="flex gap-4 mt-7">
                    <span className="tag py-1 px-4">{tags[0]}</span>
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-heart text-xl"></i>
                        {total_likes}
                    </span>
                </div>
            </div>
            <div className="h-28 aspect-square bg-gray-200">
                <img src={banner} alt="" className="w-full h-full aspect-square object-cover" />
            </div>
        </Link>
    )
}

export default ProjectPostCard;
