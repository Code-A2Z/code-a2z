import { useContext } from "react";
import { ProjectContext } from "../pages/Project";
import CommentField from "./CommentField";
import axios from "axios";
import NoDataMessage from "./NoData";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./CommentCard";

export const fetchComments = async ({ skip = 0, project_id, setParentCommentCountFun, comment_arry = null }) => {
    let res;

    try {
        // Only fetch parent comments (not replies)
        const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/get-comments", {
            project_id,
            skip,
            isReply: false // Only get parent comments
        });

        if (data.length) {
            const updatedData = data.map(comment => ({
                ...comment,
                childrenLevel: 0,
                isReplyLoaded: false
            }));

            setParentCommentCountFun(skip + updatedData.length);

            if (comment_arry === null) {
                res = { results: updatedData };
            } else {
                // Only append new parent comments
                res = { results: [...comment_arry, ...updatedData] };
            }
        } else {
            res = comment_arry === null ? { results: [] } : { results: comment_arry };
        }
    } catch (err) {
        console.log(err);
        res = comment_arry === null ? { results: [] } : { results: comment_arry };
    }

    return res;
}

const CommentsContainer = () => {
    let { project, project: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, setProject } = useContext(ProjectContext);

    const loadMoreComments = async () => {
        const newCommentsArr = await fetchComments({
            skip: totalParentCommentsLoaded,
            project_id: _id,
            setParentCommentCountFun: setTotalParentCommentsLoaded,
            comment_arry: commentsArr || []
        });

        if (newCommentsArr && newCommentsArr.results) {
            setProject(prevProject => ({
                ...prevProject,
                comments: newCommentsArr
            }));
        }
    }

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

            {
                commentsArr && commentsArr.length ?
                    // Only display parent comments (where isReply is false)
                    commentsArr.filter(comment => !comment.isReply).map((comment, i) => {
                        return (
                            <AnimationWrapper key={comment._id}>
                                <CommentCard
                                    index={i}
                                    leftVal={0}
                                    commentData={comment}
                                />
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
