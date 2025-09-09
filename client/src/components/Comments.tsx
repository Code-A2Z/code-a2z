import { useContext } from "react";
import { ProjectContext } from "../pages/Project";
import CommentField from "./CommentField";
import axios from "axios";
import NoDataMessage from "./NoData";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./CommentCard";

export const fetchComments = async ({ skip = 0, project_id, setParentCommentCountFun, comment_arry = null }) => {
    let res;

    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/get-comments", { project_id, skip })
        .then(({ data }) => {
            data.map(comment => {
                comment.childrenLevel = 0;
            })

            setParentCommentCountFun(preVal => preVal + data.length);

            if (comment_arry === null) {
                res = { results: data }
            } else {
                res = { results: [...comment_arry, ...data] }
            }
        })
        .catch(err => {
            console.log(err);
        })

    return res;
}

const CommentsContainer = () => {

    let { project, project: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, setProject } = useContext(ProjectContext);

    const loadMoreComments = async () => {
        let newCommentsArr = await fetchComments({ skip: totalParentCommentsLoaded, project_id: _id, setParentCommentCountFun: setTotalParentCommentsLoaded, comment_arry: commentsArr });

        setProject({ ...project, comments: newCommentsArr });
    }

    return (
        <div
            className={
                "max-sm:w-full fixed " +
                (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
                " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 " +
                "bg-white dark:bg-[#121212] shadow-2xl dark:shadow-lg text-black dark:text-gray-200 p-8 px-16 overflow-y-auto overflow-x-hidden"
            }
        >

            <div className="relative">
                <h1 className="font-medium text-xl">Comments</h1>
                <p className="text-lg mt-2 w-[70%] text-gray-500 line-clamp-1">{title}</p>

                <button
                    onClick={() => setCommentsWrapper(!commentsWrapper)}
                    className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-gray-100 dark:bg-[#09090b]"
                >
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button>
            </div>

            <hr className="border-gray-100 my-8 w-[120%] -ml-10" />

            <CommentField action="comment" setReplying={() => {}} />

            {
                commentsArr && commentsArr.length ?
                    commentsArr.map((comment, i) => {
                        return (
                            <AnimationWrapper key={i}>
                                <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
                            </AnimationWrapper>
                        )
                    }) :
                    <NoDataMessage message="No Comments" />
            }

            {
                total_parent_comments > totalParentCommentsLoaded ?
                    <button
                        onClick={loadMoreComments}
                        className="text-gray-500 p-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-2"
                    >
                        Load More
                    </button>
                    : ""
            }
        </div>
    )
}

export default CommentsContainer;
