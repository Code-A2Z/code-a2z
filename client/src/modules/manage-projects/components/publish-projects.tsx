import { Link } from 'react-router-dom';
import { getDay } from '../../../shared/utils/date';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { deleteProjectById } from '../../../infra/rest/apis/project';
import { useNotifications } from '../../../shared/hooks/use-notification';
import { useAuth } from '../../../shared/hooks/use-auth';
import { ROUTES_V1 } from '../../../app/routes/constants/routes';
import {
  PublishedProjectsAtom,
  ManageProjectsPaginationState,
} from '../states';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Stack,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { userProjectsResponse } from '../../../infra/rest/apis/project/typing';
import { PROJECT_ACTIVITY } from '../../../infra/rest/typings';

interface ManagePublishedProjectCardProps {
  project: userProjectsResponse;
  index: number;
}

const ProjectStats = ({ activity }: { activity: PROJECT_ACTIVITY }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
      sx={{ display: { xs: 'none', lg: 'flex' } }}
    >
      <Box sx={{ textAlign: 'center', px: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {activity.total_likes?.toLocaleString() || 0}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Likes
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center', px: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {activity.total_comments?.toLocaleString() || 0}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Comments
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center', px: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {activity.total_reads?.toLocaleString() || 0}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Reads
        </Typography>
      </Box>
    </Stack>
  );
};

const ManagePublishedProjectCard = ({
  project,
  index,
}: ManagePublishedProjectCardProps) => {
  const { _id, title, banner_url, publishedAt, activity } = project;
  const setPublishedProjects = useSetAtom(PublishedProjectsAtom);
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [showStat, setShowStat] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!_id || !isAuthenticated()) return;

    setLoading(true);
    try {
      await deleteProjectById(_id);
      setPublishedProjects((prev: ManageProjectsPaginationState | null) => {
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
        message: 'Project deleted successfully',
        type: 'success',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      addNotification({
        message: err.response?.data?.error || 'Failed to delete project',
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
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {banner_url && (
            <Box
              component="img"
              src={banner_url}
              alt={title}
              sx={{
                width: { xs: '100%', xl: 112 },
                height: { xs: 200, xl: 112 },
                objectFit: 'cover',
                borderRadius: 2,
                display: { xs: 'block', lg: 'none', xl: 'block' },
              }}
            />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component={Link}
              to={`${ROUTES_V1.HOME}/${_id}`}
              sx={{
                mb: 1,
                display: 'block',
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Published on {getDay(publishedAt)}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              <Button
                component={Link}
                to={`/editor/${_id}`}
                size="small"
                startIcon={<EditIcon />}
                variant="outlined"
              >
                Edit
              </Button>

              <Button
                size="small"
                onClick={() => setShowStat(!showStat)}
                startIcon={showStat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                variant="outlined"
                sx={{ display: { xs: 'flex', lg: 'none' } }}
              >
                Stats
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

          {activity && (
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <ProjectStats activity={activity} />
            </Box>
          )}
        </Box>

        <Collapse in={showStat} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            {activity && <ProjectStats activity={activity} />}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ManagePublishedProjectCard;
