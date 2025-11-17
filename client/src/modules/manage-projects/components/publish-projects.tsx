import { Link } from 'react-router-dom';
import { getDay } from '../../../../shared/utils/date';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { UserAtom } from '../../../../shared/states/user';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardActions, Avatar, Stack } from '@mui/material';

import { SetStateAction } from 'react';
import { AllProjectsData } from '../../../../infra/rest/typings';

interface ProjectStats {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  [key: string]: number; // Allow dynamic key access
}

export interface Project {
  _id?: string;
  project_id: string;
  title: string;
  des?: string;
  banner?: string;
  publishedAt: string;
  activity?: ProjectStats;
  index?: number;
  setStateFunc?: (value: SetStateAction<AllProjectsData | null>) => void;
}

const ProjectStats = ({ stats }: { stats: ProjectStats }) => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ borderTop: { xs: '1px solid #e5e7eb', md: 'none' } }}>
      {Object.keys(stats).map((key, i) =>
        !key.includes('parent') ? (
          <Box key={i} sx={{ p: 2, px: 3, borderLeft: i !== 0 ? '1px solid #e5e7eb' : 'none', textAlign: 'center' }}>
            <Typography variant="h6">{stats[key].toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{key.split('_')[1]}</Typography>
          </Box>
        ) : null
      )}
    </Stack>
  );
};

export const deleteProject = (
  project: Project,
  access_token: string,
  target: EventTarget | null
) => {
  const { index, project_id, setStateFunc } = project;

  if (!(target instanceof HTMLElement)) return;

  target.setAttribute('disabled', 'true');

  axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN + '/api/project/delete',
      { project_id },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(() => {
      target.removeAttribute('disabled');

      if (setStateFunc) {
        setStateFunc((preVal: AllProjectsData | null) => {
          if (!preVal) return null;

          const { deletedDocCount = 0, totalDocs = 0, results = [] } = preVal;

          if (
            typeof index === 'number' &&
            index >= 0 &&
            index < results.length
          ) {
            results.splice(index, 1);
          }

          const newTotalDocs = totalDocs - 1;
          const newDeletedCount = deletedDocCount + 1;

          if (!results.length && newTotalDocs > 0) {
            return null;
          }

          return {
            ...preVal,
            results,
            totalDocs: newTotalDocs,
            deletedDocCount: newDeletedCount,
          };
        });
      }
    })
    .catch(err => {
      console.error('Error deleting project:', err);
      target.removeAttribute('disabled');
    });
};

const ManagePublishedProjectCard = ({ project }: { project: Project }) => {
  const { banner, project_id, title, publishedAt, activity } = project;

  const [user] = useAtom(UserAtom);
  const access_token = user.access_token || '';

  const [showStat, setShowStat] = useState(false);

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          {banner ? (
            <Box component="img" src={banner} alt="" sx={{ width: 112, height: 112, objectFit: 'cover', borderRadius: 1, display: { xs: 'none', xl: 'block' } }} />
          ) : (
            <Avatar variant="rounded" sx={{ width: 112, height: 112, display: { xs: 'none', xl: 'block' } }} />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography component={Link} to={`/project/${project_id}`} sx={{ display: 'block', fontWeight: 600, textDecoration: 'none', color: 'text.primary', mb: 1 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">Published on {getDay(publishedAt)}</Typography>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button component={Link} to={`/editor/${project_id}`} size="small">Edit</Button>
              <Button size="small" onClick={() => setShowStat(pre => !pre)}>Stats</Button>
              <Button size="small" color="error" onClick={e => deleteProject(project, access_token, e.target)}>Delete</Button>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>{activity && <ProjectStats stats={activity} />}</Box>
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
