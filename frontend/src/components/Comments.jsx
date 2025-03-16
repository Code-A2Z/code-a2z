import { useContext } from "react";
import { ProjectContext } from "../pages/Project";
import CommentField from "./CommentField";

const CommentsContainer = () => {

    let { project: { title }, commentsWrapper, setCommentsWrapper } = useContext(ProjectContext);

    return (
        <div className={"max-sm:w-full fixed " + (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}>

            <div className="relative">
                <h1 className="font-medium text-xl">Comments</h1>
                <p className="text-lg mt-2 w-[70%] text-gray-500 line-clamp-1">{title}</p>

                <button
                    onClick={() => setCommentsWrapper(preVal => !preVal)}
                    className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-gray-100"
                >
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button>
            </div>

            <hr className="border-gray-100 my-8 w-[120%] -ml-10" />

            <CommentField action="comment" />
        </div>
    )
}

export default CommentsContainer;
