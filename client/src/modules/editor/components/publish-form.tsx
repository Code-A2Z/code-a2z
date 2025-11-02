import { Box, TextareaAutosize, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useProjectEditor } from '../hooks/use-project-editor';
import {
  characterLimit,
  defaultDarkThumbnail,
  defaultLightThumbnail,
  tagLimit,
} from '../constants';
import A2ZIconButton from '../../../shared/components/atoms/icon-button';
import A2ZTypography from '../../../shared/components/atoms/typography';
import InputBox from '../../../shared/components/atoms/input-box';
import A2ZButton from '../../../shared/components/atoms/button';
import { useEditor } from '../hooks';
import { useA2ZTheme } from '../../../shared/hooks/use-theme';
import { useAtomValue } from 'jotai';
import { EditorContentAtom } from '../states';

const PublishForm = () => {
  const theme = useTheme();
  const { theme: a2zTheme } = useA2ZTheme();
  const editorContent = useAtomValue(EditorContentAtom);
  const { handleBackToEditor } = useEditor();
  const {
    handleTitleChange,
    handleDescriptionChange,
    handleTagsAdd,
    handleTagsDelete,
    handlePublishProject,
  } = useProjectEditor();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'grid',
        alignItems: 'center',
        py: 8,
        px: { xs: 2, md: 4 },
        gridTemplateColumns: { lg: '1fr 1fr', xs: '1fr' },
        gap: { lg: 4, xs: 6 },
        position: 'relative',
      }}
    >
      <A2ZIconButton
        props={{
          sx: {
            position: 'absolute',
            right: '5vw',
            top: { xs: '5%', lg: '10%' },
            zIndex: 10,
            width: 48,
            height: 48,
          },
          onClick: handleBackToEditor,
        }}
      >
        <CloseIcon fontSize="medium" />
      </A2ZIconButton>

      {/* Left Section — Preview */}
      <Box sx={{ maxWidth: 550, mx: 'auto' }}>
        <A2ZTypography variant="body2" text="Preview" />

        <Box
          sx={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: theme.palette.mode === 'dark' ? '#09090b' : '#fafafa',
            mt: 2,
          }}
        >
          <Box
            component="img"
            src={
              editorContent?.banner ||
              (a2zTheme === 'dark'
                ? defaultDarkThumbnail
                : defaultLightThumbnail)
            }
            alt="Project Banner"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        <A2ZTypography
          variant="h4"
          text={editorContent?.title || 'Untitled Project'}
          props={{
            sx: {
              mt: 2,
              lineHeight: 1.2,
            },
          }}
        />

        <A2ZTypography
          variant="body1"
          text={
            editorContent?.description ||
            'Your project description will appear here.'
          }
          props={{
            sx: {
              mt: 2,
              fontFamily: 'Gelasio, serif',
              lineHeight: 1.6,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            },
          }}
        />
      </Box>

      {/* Right Section — Editor Fields */}
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <A2ZTypography
          text="Project Title"
          props={{
            color: 'text.secondary',
            sx: {
              mb: 1,
            },
          }}
        />
        <InputBox
          id="publish-form-title"
          name="title"
          type="text"
          defaultValue={editorContent?.title}
          fullWidth
          placeholder="Project Title"
          size="medium"
          slotProps={{
            htmlInput: {
              onChange: handleTitleChange,
            },
          }}
        />

        <A2ZTypography
          text="Short description about your project"
          props={{
            color: 'text.secondary',
            sx: {
              mt: 4,
              mb: 1,
            },
          }}
        />
        <TextareaAutosize
          placeholder="Your Project Description"
          maxLength={characterLimit}
          defaultValue={editorContent?.description}
          onChange={handleDescriptionChange}
          style={{
            width: '100%',
            height: '160px',
            padding: '12px 16px',
            fontSize: '1rem',
            borderRadius: 8,
            border: `1px solid ${theme.palette.divider}`,
            resize: 'none',
            fontFamily: 'inherit',
            color: theme.palette.text.primary,
            backgroundColor: 'transparent',
          }}
        />
        <A2ZTypography
          text={`${characterLimit - (editorContent?.description?.length || 0)} characters left`}
          variant="caption"
          props={{
            color: 'text.secondary',
            sx: {
              display: 'block',
              textAlign: 'right',
              mt: 0.5,
            },
          }}
        />

        <A2ZTypography
          text="Topics — (Helps in searching and ranking your project post)"
          props={{
            color: 'text.secondary',
            sx: {
              mt: 4,
              mb: 1,
            },
          }}
        />

        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: 1.5,
            minHeight: 100,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <InputBox
            id="publish-form-tags"
            name="tags"
            type="text"
            fullWidth
            placeholder="Add topics"
            variant="standard"
            slotProps={{
              htmlInput: {
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    handleTagsAdd(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                },
              },
              input: {
                disableUnderline: true,
              },
            }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {editorContent?.tags?.map((tag, i) => (
              <Chip
                key={i}
                label={tag}
                variant="outlined"
                onDelete={() => handleTagsDelete(i)}
              />
            ))}
          </Box>
        </Box>

        <A2ZTypography
          variant="caption"
          text={`${tagLimit - (editorContent?.tags?.length || 0)} Tags left`}
          props={{
            color: 'text.secondary',
            sx: {
              display: 'block',
              textAlign: 'right',
              mt: 1,
              mb: 3,
            },
          }}
        />

        <A2ZButton
          variant="contained"
          color="primary"
          size="large"
          onClick={handlePublishProject}
          sx={{ px: 4 }}
        >
          Publish
        </A2ZButton>
      </Box>
    </Box>
  );
};

export default PublishForm;
