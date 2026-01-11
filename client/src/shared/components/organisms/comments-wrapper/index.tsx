import { useAtom, useAtomValue } from 'jotai';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  useTheme,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NoDataMessage from '../../atoms/no-data-msg';
import { SelectedProjectAtom } from '../../../../modules/home/modules/project/v1/states';
import CommentField from './components/comment-field';
import CommentCard from './components/comment-card';
import {
  AllCommentsAtom,
  Comments,
  CommentsWrapperAtom,
  TotalParentCommentsLoadedAtom,
} from './states';
import useCommentsWrapper from './hooks';

const CommentsWrapper = () => {
  const selectedProject = useAtomValue(SelectedProjectAtom);
  const [commentsWrapper, setCommentsWrapper] = useAtom(CommentsWrapperAtom);
  const totalParentCommentsLoaded = useAtomValue(TotalParentCommentsLoadedAtom);
  const comments = useAtomValue(AllCommentsAtom);
  const { loadMoreComments } = useCommentsWrapper();
  const theme = useTheme();

  if (!selectedProject) return null;

  return (
    <Slide direction="left" in={commentsWrapper} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: { xs: '100%', sm: '30%' },
          minWidth: { sm: 350 },
          height: '100vh',
          zIndex: 1300,
          bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
          color: theme.palette.text.primary,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 0 20px rgba(255,255,255,0.1)'
              : '0 0 20px rgba(0,0,0,0.1)',
          p: { xs: 4, sm: 8 },
          px: { xs: 4, sm: 10 },
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Typography variant="h6" fontWeight={500}>
            Comments
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 1,
              maxWidth: '70%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selectedProject.title}
          </Typography>

          <IconButton
            onClick={() => setCommentsWrapper(prev => !prev)}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? '#09090b'
                  : theme.palette.grey[100],
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? '#1c1c1e'
                    : theme.palette.grey[200],
              },
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>

        <Divider sx={{ my: 4, width: '120%', ml: '-10%' }} />

        {/* Comment input */}
        <CommentField action="comment" setReplying={() => {}} />

        {/* Comments list */}
        <Box sx={{ mt: 4 }}>
          {comments && comments.length > 0 ? (
            comments.map((comment: Comments, i: number) => (
              <CommentCard
                key={comment._id}
                index={i}
                leftVal={(comment.children_level || 0) * 4}
                comment={comment}
              />
            ))
          ) : (
            <NoDataMessage message="No Comments" />
          )}
        </Box>

        {/* Load more */}
        {selectedProject.activity?.total_parent_comments >
          totalParentCommentsLoaded && (
          <Button
            onClick={loadMoreComments}
            sx={{
              mt: 3,
              color: theme.palette.text.secondary,
              textTransform: 'none',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : theme.palette.grey[50],
              },
            }}
          >
            Load More
          </Button>
        )}
      </Box>
    </Slide>
  );
};

export default CommentsWrapper;
