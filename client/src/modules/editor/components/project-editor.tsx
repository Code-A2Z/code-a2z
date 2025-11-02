import { Box, Divider, useTheme } from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import LinkIcon from '@mui/icons-material/Link';
import HttpIcon from '@mui/icons-material/Http';
import { defaultLightThumbnail, defaultDarkThumbnail } from '../constants';
import EditorNavbar from './editor-navbar';
import { useA2ZTheme } from '../../../shared/hooks/use-theme';
import InputBox from '../../../shared/components/atoms/input-box';
import A2ZTextEditor from './text-editor';
import { useProjectEditor } from '../hooks/use-project-editor';
import { useAtomValue } from 'jotai';
import { EditorContentAtom } from '../states';

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
      <EditorNavbar
        title={editorContent?.title}
        onSaveDraft={handleDraftProject}
        onPublish={handlePublishEvent}
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
