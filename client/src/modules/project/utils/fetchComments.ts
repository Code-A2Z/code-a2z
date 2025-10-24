import { Comment } from '../../../infra/rest/typings';
import { getComments } from '../requests';

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
