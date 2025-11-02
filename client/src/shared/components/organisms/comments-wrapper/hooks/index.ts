import { useAtom, useAtomValue } from 'jotai';
import { getComments } from '../../../../../infra/rest/apis/comment';
import { GetCommentsResponse } from '../../../../../infra/rest/apis/comment/typing';
import { AllCommentsAtom, TotalParentCommentsLoadedAtom } from '../states';
import { SelectedProjectAtom } from '../../../../../modules/project/states';

const useCommentsWrapper = () => {
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useAtom(
    TotalParentCommentsLoadedAtom
  );
  const [allComments, setAllComments] = useAtom(AllCommentsAtom);
  const selectedProject = useAtomValue(SelectedProjectAtom);

  const fetchComments = async ({ project_id }: { project_id: string }) => {
    try {
      const response = await getComments({
        project_id,
        skip: totalParentCommentsLoaded,
      });
      if (response.data) {
        const transformed = response.data.map(comment => ({
          ...comment,
          children_level: 0,
        })) as (GetCommentsResponse & { children_level: number })[];
        setTotalParentCommentsLoaded(transformed.length);

        if (transformed.length > 0) {
          if (!allComments) {
            setAllComments(transformed);
          } else {
            setAllComments([...allComments, ...transformed]);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setAllComments(null);
    }
  };

  const loadMoreComments = async () => {
    if (!selectedProject?._id) return;
    await fetchComments({
      project_id: selectedProject._id,
    });
  };

  return {
    fetchComments,
    loadMoreComments,
  };
};

export default useCommentsWrapper;
