import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ROUTES_HOME_V1,
  ROUTES_V1,
} from '../../../../../../app/routes/constants/routes';
import { useSetAtom } from 'jotai';
import { deleteProjectById } from '../../../../../../infra/rest/apis/project';
import { useNotifications } from '../../../../../../shared/hooks/use-notification';
import { useAuth } from '../../../../../../shared/hooks/use-auth';
import { DraftProjectsAtom, ManageProjectsPaginationState } from '../states';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userProjectsResponse } from '../../../../../../infra/rest/apis/project/typing';

interface ManageDraftArticleProps {
  project: userProjectsResponse;
  index: number;
}

const ManageDraftArticle = ({ project, index }: ManageDraftArticleProps) => {
  const { _id, title, description } = project;
  const setDraftProjects = useSetAtom(DraftProjectsAtom);
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!_id || !isAuthenticated()) return;

    setLoading(true);
    try {
      await deleteProjectById(_id);
      setDraftProjects((prev: ManageProjectsPaginationState | null) => {
        if (!prev) return null;

        const newResults = prev.results.filter((_, i) => i !== index);
        const newTotalDocs = prev.totalDocs - 1;
        const newDeletedCount = (prev.deletedDocCount || 0) + 1;

        if (!newResults.length && newTotalDocs > 0) {
          return null;
        }

        return {
          ...prev,
          results: newResults,
          totalDocs: newTotalDocs,
          deletedDocCount: newDeletedCount,
        };
      });
      addNotification({
        message: 'Draft deleted successfully',
        type: 'success',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      addNotification({
        message: err.response?.data?.error || 'Failed to delete draft',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.default',
        boxShadow: theme => theme.shadows[1],
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme => theme.shadows[3],
        },
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box
            sx={{
              minWidth: 60,
              textAlign: 'center',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Typography variant="h4" color="text.secondary" fontWeight={300}>
              {String(index + 1).padStart(2, '0')}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description || 'No description'}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ flexWrap: 'wrap' }}
            >
              <Button
                component={Link}
                to={`${ROUTES_V1.HOME}${ROUTES_HOME_V1.EDITOR_WITH_ID.replace(':project_id', _id || '')}`}
                size="small"
                startIcon={<EditIcon />}
                variant="contained"
              >
                Edit
              </Button>

              <Button
                size="small"
                onClick={handleDelete}
                disabled={loading}
                startIcon={<DeleteIcon />}
                color="error"
                variant="outlined"
              >
                Delete
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ManageDraftArticle;
