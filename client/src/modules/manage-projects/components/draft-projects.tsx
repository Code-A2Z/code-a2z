import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { Project, deleteProject } from './utils';

const ManageDraftProjectPost = ({ project }: { project: Project }) => {
  const { title, des } = project;
  let { index = 0 } = project;

  index++;

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ minWidth: 56, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600 }}>
              {index < 10 ? '0' + index : index}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {des?.length ? des : 'No Description'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to={`/editor/${project.project_id}`}
                size="small"
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={e =>
                  deleteProject(project, '', e.target as HTMLElement)
                }
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ManageDraftProjectPost;
