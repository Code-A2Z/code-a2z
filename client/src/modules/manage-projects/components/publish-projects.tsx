import { Link } from 'react-router-dom';
import { getDay } from '../../../../shared/utils/date';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { UserAtom } from '../../../infra/states/user';
import { Box, Typography, Button, Card, CardContent, CardActions, Avatar, Stack } from '@mui/material';
import { Project, deleteProject } from './utils';

interface ProjectStats {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  [key: string]: number; // Allow dynamic key access
}

// Project type and deleteProject helper are moved to ./utils to avoid exporting non-component
// functions from this file (react-refresh requirement).

const ProjectStats = ({ stats }: { stats: ProjectStats }) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ borderTop: { xs: '1px solid #e5e7eb', md: 'none' } }}
    >
      {Object.keys(stats).map((key, i) =>
        !key.includes('parent') ? (
          <Box
            key={i}
            sx={{
              p: 2,
              px: 3,
              borderLeft: i !== 0 ? '1px solid #e5e7eb' : 'none',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">{stats[key].toLocaleString()}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: 'capitalize' }}
            >
              {key.split('_')[1]}
            </Typography>
          </Box>
        ) : null
      )}
    </Stack>
  );
};

// deleteProject is imported from ./utils

const ManagePublishedProjectCard = ({ project }: { project: Project }) => {
  const { banner, project_id, title, publishedAt, activity } = project;

  const [user] = useAtom(UserAtom);
  const access_token = user.access_token || '';

  const [showStat, setShowStat] = useState(false);

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems="center"
        >
          {banner ? (
            <Box
              component="img"
              src={banner}
              alt=""
              sx={{
                width: 112,
                height: 112,
                objectFit: 'cover',
                borderRadius: 1,
                display: { xs: 'none', xl: 'block' },
              }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{
                width: 112,
                height: 112,
                display: { xs: 'none', xl: 'block' },
              }}
            />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component={Link}
              to={`/project/${project_id}`}
              sx={{
                display: 'block',
                fontWeight: 600,
                textDecoration: 'none',
                color: 'text.primary',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Published on {getDay(publishedAt)}
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to={`/editor/${project_id}`}
                size="small"
              >
                Edit
              </Button>
              <Button size="small" onClick={() => setShowStat(pre => !pre)}>
                Stats
              </Button>
              <Button
                size="small"
                color="error"
                onClick={e => deleteProject(project, access_token, e.target)}
              >
                Delete
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {activity && <ProjectStats stats={activity} />}
          </Box>
        </Stack>
      </CardContent>

      {showStat ? (
        <CardActions>
          {activity && <ProjectStats stats={activity} />}
        </CardActions>
      ) : null}
    </Card>
  );
};

export default ManagePublishedProjectCard;
