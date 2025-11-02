import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Box, Divider, Typography, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import XIcon from '@mui/icons-material/X';
import { UserAtom } from '../../../infra/states/user';
import { LikedByUserAtom, SelectedProjectAtom } from '../states';
import { useAuth } from '../../../shared/hooks/use-auth';
import { likeStatus } from '../../../infra/rest/apis/like';
import useProjectInteraction from '../hooks/use-project-interaction';
import { CommentsWrapperAtom } from '../../../shared/components/organisms/comments-wrapper/states';

const ProjectInteraction = () => {
  const { isAuthenticated } = useAuth();
  const user = useAtomValue(UserAtom);
  const project = useAtomValue(SelectedProjectAtom);
  const [islikedByUser, setLikedByUser] = useAtom(LikedByUserAtom);
  const setCommentsWrapper = useSetAtom(CommentsWrapperAtom);
  const { handleLike } = useProjectInteraction();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!isAuthenticated() || !project?._id) return;
      try {
        const response = await likeStatus(project._id);
        if (response.is_liked) {
          setLikedByUser(Boolean(response.is_liked));
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };
    fetchLikeStatus();
  }, [project?._id, setLikedByUser, isAuthenticated]);

  return (
    <>
      <Divider sx={{ my: 2 }} />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={3}
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
          <Typography variant="body1" color="text.primary">
            {project?.activity.total_likes}
          </Typography>

          {/* Comment Button */}
          <Tooltip title="Comments">
            <IconButton
              onClick={() => setCommentsWrapper(prev => !prev)}
              sx={{
                bgcolor: theme => theme.palette.action.hover,
                color: 'text.secondary',
                transition: 'background-color 0.2s, color 0.2s',
                '&:hover': {
                  bgcolor: theme => theme.palette.action.selected,
                },
              }}
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" color="text.primary">
            {project?.activity.total_comments}
          </Typography>
        </Box>

        {/* Right side — Edit & Share */}
        <Box display="flex" alignItems="center" gap={2}>
          {user?.personal_info.username ===
          project?.user_id.personal_info.username ? (
            <Tooltip title="Edit Project">
              <IconButton
                component={Link}
                to={`/editor/${project?._id}`}
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
              component={Link}
              to={`https://twitter.com/intent/tweet?text=Read ${project?.title}&url=${location.href}`}
              target="_blank"
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
