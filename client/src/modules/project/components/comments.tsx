import { useAtom, useAtomValue, useSetAtom } from "jotai";
import CommentField from "./commentField";
import CommentCard from "./commentCard";
import NoDataMessage from "../../../shared/components/atoms/no-data-msg";
import AnimationWrapper from "../../../shared/components/atoms/page-animation";
import { ProjectAtom } from "../../../shared/states/project";
import { CommentsWrapperAtom, TotalParentCommentsLoadedAtom } from "../states";
import { Comment } from "../../../shared/typings";
import { getComments } from "../requests";

export const fetchComments = async ({
  skip = 0,
  project_id,
  setParentCommentCountFun,
  comment_arry = null,
}: {
  skip?: number;
  project_id: string;
  setParentCommentCountFun: (val: number) => void;
  comment_arry?: Comment[] | null;
}) => {
  try {
    const response = await getComments({ project_id, skip });
    response.forEach((comment: Comment) => {
      comment.childrenLevel = 0;
    });

    setParentCommentCountFun(response.length);

    if (comment_arry === null) {
      return { results: response };
    } else {
      return { results: [...comment_arry, ...response] };
    }
  } catch (err) {
    console.error(err);
    return { results: [] };
  }
};

const CommentsContainer = () => {
  const project = useAtomValue(ProjectAtom);
  const [commentsWrapper, setCommentsWrapper] = useAtom(CommentsWrapperAtom);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useAtom(TotalParentCommentsLoadedAtom);
  const setProject = useSetAtom(ProjectAtom);

  if (!project) return null;

  const { _id, title, comments, activity } = project;
  const commentsArr = comments?.results || [];
  const total_parent_comments = activity?.total_parent_comments || 0;

  const loadMoreComments = async () => {
    if (!_id) return;
    
    const newCommentsArr = await fetchComments({ 
      skip: totalParentCommentsLoaded, 
      project_id: _id,
      setParentCommentCountFun: setTotalParentCommentsLoaded, 
      comment_arry: commentsArr 
    });

    setProject({ ...project, comments: newCommentsArr });
  };

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
          onClick={() => setCommentsWrapper(prevVal => !prevVal)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-gray-100 dark:bg-[#09090b]"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>
      </div>

      <hr className="border-gray-100 my-8 w-[120%] -ml-10" />

      <CommentField action="comment" setReplying={() => {}} />

      {commentsArr && commentsArr.length > 0 ? (
        commentsArr.map((comment: Comment, i: number) => (
          <AnimationWrapper key={i}>
            <CommentCard index={i} leftVal={(comment.childrenLevel || 0) * 4} commentData={comment} />
          </AnimationWrapper>
        ))
      ) : (
        <NoDataMessage message="No Comments" />
      )}

      {total_parent_comments > totalParentCommentsLoaded && (
        <button
          onClick={loadMoreComments}
          className="text-gray-500 p-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-2"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default CommentsContainer;
