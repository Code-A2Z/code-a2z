import { useCallback, useRef, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { getComments } from '../../../../../infra/rest/apis/comment';
import { GetCommentsResponse } from '../../../../../infra/rest/apis/comment/typing';
import { AllCommentsAtom, TotalParentCommentsLoadedAtom } from '../states';
import { SelectedProjectAtom } from '../../../../../modules/home/modules/project/v1/states';

const useCommentsWrapper = () => {
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useAtom(
    TotalParentCommentsLoadedAtom
  );
  const setAllComments = useSetAtom(AllCommentsAtom);
  const selectedProject = useAtomValue(SelectedProjectAtom);
  const currentProjectIdRef = useRef<string | null>(null);

  // Reset comments when project changes
  useEffect(() => {
    if (
      selectedProject?._id &&
      selectedProject._id !== currentProjectIdRef.current
    ) {
      currentProjectIdRef.current = selectedProject._id;
      setAllComments(null);
      setTotalParentCommentsLoaded(0);
    }
  }, [selectedProject?._id, setAllComments, setTotalParentCommentsLoaded]);

  const fetchComments = useCallback(
    async ({
      project_id,
      reset = false,
    }: {
      project_id: string;
      reset?: boolean;
    }) => {
      if (!project_id) return;

      try {
        const skip = reset ? 0 : totalParentCommentsLoaded;
        const response = await getComments({
          project_id,
          skip,
        });
        if (response.data) {
          const transformed = response.data.map(comment => ({
            ...comment,
            children_level: 0,
          })) as (GetCommentsResponse & { children_level: number })[];

          if (reset) {
            setTotalParentCommentsLoaded(transformed.length);
            setAllComments(transformed.length > 0 ? transformed : null);
          } else {
            setTotalParentCommentsLoaded(prev => prev + transformed.length);
            if (transformed.length > 0) {
              setAllComments(prev => {
                if (!prev) return transformed;
                return [...prev, ...transformed];
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
        setAllComments(null);
      }
    },
    [totalParentCommentsLoaded, setTotalParentCommentsLoaded, setAllComments]
  );

  const loadMoreComments = useCallback(async () => {
    if (!selectedProject?._id) return;
    await fetchComments({
      project_id: selectedProject._id,
      reset: false,
    });
  }, [selectedProject?._id, fetchComments]);

  return {
    fetchComments,
    loadMoreComments,
  };
};

export default useCommentsWrapper;
