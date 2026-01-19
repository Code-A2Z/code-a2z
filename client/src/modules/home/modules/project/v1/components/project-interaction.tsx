import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Box, Divider, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import XIcon from '@mui/icons-material/X';
import { UserAtom } from '../../../../../../infra/states/user';
import { LikedByUserAtom, SelectedProjectAtom } from '../states';
import { likeStatus } from '../../../../../../infra/rest/apis/like';
import useProjectInteraction from '../hooks/use-project-interaction';
import { CommentsWrapperAtom } from '../../../../../../shared/components/organisms/comments-wrapper/states';
import A2ZTypography from '../../../../../../shared/components/atoms/typography';
import {
  ROUTES_V1,
  ROUTES_HOME_V1,
} from '../../../../../../app/routes/constants/routes';

// Module-level refs to prevent duplicate API calls across component instances
const fetchedProjectIdRef: { current: string | null } = { current: null };
const fetchingLikeStatusRef: { current: boolean } = { current: false };

const ProjectInteraction = () => {
  const user = useAtomValue(UserAtom);
  const project = useAtomValue(SelectedProjectAtom);
  const [islikedByUser, setLikedByUser] = useAtom(LikedByUserAtom);
  const setCommentsWrapper = useSetAtom(CommentsWrapperAtom);
  const { handleLike } = useProjectInteraction();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!project?._id) {
        // Reset refs if project is cleared
        fetchedProjectIdRef.current = null;
        fetchingLikeStatusRef.current = false;
        return;
      }

      // Prevent fetching if we've already fetched for this project or are currently fetching
      if (
        fetchedProjectIdRef.current === project._id ||
        fetchingLikeStatusRef.current
      ) {
        return;
      }

      fetchedProjectIdRef.current = project._id;
      fetchingLikeStatusRef.current = true;

      try {
        const response = await likeStatus(project._id);
        setLikedByUser(Boolean(response.is_liked));
      } catch (error) {
        console.error('Error fetching like status:', error);
        // Reset on error to allow retry
        fetchedProjectIdRef.current = null;
      } finally {
        fetchingLikeStatusRef.current = false;
      }
    };
    fetchLikeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?._id]);

  return (
    <>
      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        {/* Left side — Likes & Comments */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Like Button */}
          <Tooltip title={islikedByUser ? 'Unlike' : 'Like'}>
            <IconButton
              onClick={handleLike}
              sx={{
                bgcolor: islikedByUser
                  ? 'rgba(255, 0, 0, 0.1)'
                  : theme => theme.palette.action.hover,
                color: islikedByUser ? 'error.main' : 'text.secondary',
                transition: 'background-color 0.2s, color 0.2s',
                '&:hover': {
                  bgcolor: islikedByUser
                    ? 'rgba(255, 0, 0, 0.2)'
                    : theme => theme.palette.action.selected,
                },
              }}
            >
              {islikedByUser ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <A2ZTypography
            variant="body1"
            text={String(project?.activity.total_likes || 0)}
            props={{ sx: { color: 'text.primary' } }}
          />

          {/* Comment Button */}
          <Tooltip title="Comments">
            <IconButton
              onClick={() => setCommentsWrapper(prev => !prev)}
              sx={{
                bgcolor: 'action.hover',
                color: 'text.secondary',
                transition: 'background-color 0.2s, color 0.2s',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Tooltip>
          <A2ZTypography
            variant="body1"
            text={String(project?.activity.total_comments || 0)}
            props={{ sx: { color: 'text.primary' } }}
          />
        </Box>

        {/* Right side — Edit & Share */}
        <Box display="flex" alignItems="center" gap={2}>
          {user?.personal_info.username ===
          project?.user_id.personal_info.username ? (
            <Tooltip title="Edit Project">
              <IconButton
                component={Link}
                to={`${ROUTES_V1.HOME}${ROUTES_HOME_V1.EDITOR_WITH_ID.replace(':project_id', project?._id || '')}`}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : null}

          <Tooltip title="Share on X">
            <IconButton
              component="a"
              href={`https://twitter.com/intent/tweet?text=Read ${project?.title}&url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: '#1DA1F2' },
              }}
            >
              <XIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
    </>
  );
};

export default ProjectInteraction;
