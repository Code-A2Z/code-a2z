import { Box, Divider, useTheme } from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import LinkIcon from '@mui/icons-material/Link';
import HttpIcon from '@mui/icons-material/Http';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublishIcon from '@mui/icons-material/Publish';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from 'react-router-dom';
import {
  defaultDarkThumbnail,
  defaultLightThumbnail,
} from '../../../../../../shared/constants';
import Header from '../../../../../../shared/components/organisms/header';
import { useA2ZTheme } from '../../../../../../shared/hooks/use-theme';
import InputBox from '../../../../../../shared/components/atoms/input-box';
import A2ZTextEditor from './text-editor';
import { useProjectEditor } from '../hooks/use-project-editor';
import { useAtomValue } from 'jotai';
import { EditorContentAtom } from '../states';
import A2ZTypography from '../../../../../../shared/components/atoms/typography';
import A2ZButton from '../../../../../../shared/components/atoms/button';
import { ROUTES_V1 } from '../../../../../../app/routes/constants/routes';

const ProjectEditor = () => {
  const theme = useTheme();
  const { theme: a2zTheme } = useA2ZTheme();
  const editorContent = useAtomValue(EditorContentAtom);
  const {
    handleBannerUpload,
    handleTitleChange,
    handleLiveURLChange,
    handleRepositoryURLChange,
    handleDraftProject,
    handlePublishEvent,
  } = useProjectEditor();

  return (
    <>
      <Header
        leftSideChildren={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: '100%',
              minWidth: 0,
            }}
          >
            <Box
              component={Link}
              to={ROUTES_V1.HOME}
              sx={{
                display: 'flex',
                flexShrink: 0,
                width: 40,
              }}
            >
              <ArrowBackIcon
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 32,
                }}
              />
            </Box>

            <A2ZTypography
              variant="body1"
              noWrap
              text={
                editorContent?.title?.length
                  ? editorContent.title
                  : 'New Project'
              }
            />
          </Box>
        }
        rightSideActions={[
          {
            key: 'publish',
            label: 'Publish',
            icon: <PublishIcon />,
            mobileIcon: <PublishIcon />,
            onClick: handlePublishEvent,
            desktopNode: (
              <A2ZButton
                variant="contained"
                color="primary"
                size="medium"
                onClick={handlePublishEvent}
              >
                Publish
              </A2ZButton>
            ),
          },
          {
            key: 'save-draft',
            label: 'Save Draft',
            icon: <SaveIcon />,
            mobileIcon: <SaveIcon />,
            onClick: handleDraftProject,
            desktopNode: (
              <A2ZButton
                variant="outlined"
                size="medium"
                onClick={handleDraftProject}
              >
                Save Draft
              </A2ZButton>
            ),
          },
        ]}
      />

      <Box
        component="section"
        sx={{
          mt: 3,
          mb: 6,
          display: 'flex',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 900,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '16 / 9',
              border: `4px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === 'dark' ? '#09090b' : '#fafafa',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <label
              htmlFor="uploadBanner"
              style={{ width: '100%', height: '100%' }}
            >
              <Box
                component="img"
                src={
                  editorContent?.banner ||
                  (a2zTheme === 'dark'
                    ? defaultDarkThumbnail
                    : defaultLightThumbnail)
                }
                alt="Banner"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <input
                id="uploadBanner"
                type="file"
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={handleBannerUpload}
              />
            </label>
          </Box>

          <InputBox
            id="project-editor-title"
            name="title"
            type="text"
            defaultValue={editorContent?.title}
            placeholder="Enter Project Title"
            fullWidth
            icon={<TitleIcon />}
            slotProps={{
              htmlInput: {
                onChange: handleTitleChange,
              },
              input: {
                sx: {
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: 1.2,
                },
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 1 },
            }}
          >
            <InputBox
              id="project-editor-repo-url"
              name="repositoryURL"
              type="text"
              defaultValue={editorContent?.repositoryURL}
              placeholder="Enter Project Repository URL"
              fullWidth
              icon={<LinkIcon />}
              slotProps={{
                htmlInput: {
                  onChange: handleRepositoryURLChange,
                },
              }}
            />

            <InputBox
              id="project-editor-live-url"
              name="liveURL"
              type="text"
              defaultValue={editorContent?.liveURL}
              placeholder="Enter Project Live URL"
              fullWidth
              icon={<HttpIcon />}
              slotProps={{
                htmlInput: {
                  onChange: handleLiveURLChange,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2, opacity: 0.6 }} />

          <A2ZTextEditor />
        </Box>
      </Box>
    </>
  );
};

export default ProjectEditor;
