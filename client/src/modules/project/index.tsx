import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Link as MuiLink,
} from '@mui/material';
import { getDay } from '../../shared/utils/date';
import { useAtomValue } from 'jotai';
import { SelectedProjectAtom } from './states';
import BannerProjectCard from '../home/v1/components/banner-project-card';
import { ProjectLoadingSkeleton } from '../../shared/components/atoms/skeleton';
import { HomePageProjectsAtom } from '../home/v1/states';
import useProject from './hooks';
import CommentsWrapper from '../../shared/components/organisms/comments-wrapper';
import ProjectInteraction from './components/project-interaction';
import ProjectContent from './components/project-content';
import {
  defaultDarkThumbnail,
  defaultLightThumbnail,
} from '../editor/constants';
import { useA2ZTheme } from '../../shared/hooks/use-theme';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { getAllProjectsResponse } from '../../infra/rest/apis/project/typing';
import { OutputBlockData } from '@editorjs/editorjs';
import { CommentsWrapperAtom } from '../../shared/components/organisms/comments-wrapper/states';

const Project = () => {
  const { project_id } = useParams();
  const { theme: a2zTheme } = useA2ZTheme();
  const selectedProject = useAtomValue(SelectedProjectAtom);
  const similarProjects = useAtomValue(HomePageProjectsAtom);
  const commentsWrapper = useAtomValue(CommentsWrapperAtom);
  const { fetchProject, loading } = useProject();

  useEffect(() => {
    fetchProject(project_id || '');
  }, [project_id, fetchProject]);

  if (loading || !selectedProject) {
    return <ProjectLoadingSkeleton count={1} />;
  }

  return (
    <>
      {commentsWrapper && <CommentsWrapper />}

      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          py: 8,
          px: { xs: '5vw', lg: 0 },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: 6,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h5"
            noWrap
            sx={{
              maxWidth:
                selectedProject.live_url && selectedProject.repository_url
                  ? '60%'
                  : '80%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selectedProject.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {selectedProject.live_url && (
              <Button
                component={Link}
                to={selectedProject.live_url}
                variant="contained"
                color="primary"
                startIcon={<OpenInNewIcon />}
              >
                Live URL
              </Button>
            )}

            {selectedProject.repository_url && (
              <Button
                component={Link}
                to={selectedProject.repository_url}
                variant="contained"
                color="inherit"
                startIcon={<GitHubIcon />}
              >
                GitHub
              </Button>
            )}
          </Box>
        </Box>

        {/* Banner Image */}
        <Box
          component="img"
          src={
            selectedProject.banner_url
              ? selectedProject.banner_url
              : a2zTheme === 'dark'
                ? defaultDarkThumbnail
                : defaultLightThumbnail
          }
          alt={selectedProject.title}
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 2,
            objectFit: 'cover',
          }}
        />

        {/* Author Info + Publish Date */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            my: 6,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar
              src={selectedProject.user_id.personal_info.profile_img}
              alt={selectedProject.user_id.personal_info.fullname}
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {selectedProject.user_id.personal_info.fullname}
              <br />@
              <MuiLink
                component={Link}
                to={`/user/${selectedProject.user_id.personal_info.username}`}
                underline="hover"
              >
                {selectedProject.user_id.personal_info.username}
              </MuiLink>
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              opacity: 0.8,
              mt: { xs: 2, sm: 0 },
              ml: { xs: 6, sm: 0 },
              pl: { xs: 1, sm: 0 },
            }}
          >
            Published on {getDay(selectedProject.publishedAt)}
          </Typography>
        </Box>

        {/* Project Interaction Section */}
        <ProjectInteraction />

        {/* Project Content */}
        <Box sx={{ my: 6 }}>
          {selectedProject.content_blocks &&
            selectedProject.content_blocks[0]?.blocks?.map(
              (block: OutputBlockData, i: number) => (
                <Box key={i} sx={{ my: { xs: 2, md: 4 } }}>
                  <ProjectContent block={block} />
                </Box>
              )
            )}
        </Box>

        <ProjectInteraction />

        {/* Similar Projects Section */}
        {similarProjects && similarProjects.length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Typography variant="h6" sx={{ mb: 5, fontWeight: 500 }}>
              Similar Projects
            </Typography>

            {similarProjects.map(
              (similarProject: getAllProjectsResponse, i: number) => (
                <BannerProjectCard key={i} project={similarProject} />
              )
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Project;
