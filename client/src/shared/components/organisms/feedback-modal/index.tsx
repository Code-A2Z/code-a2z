import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Typography,
} from '@mui/material';

import A2ZModal from '../../atoms/modal';
import A2ZTypography from '../../atoms/typography';
import { FeedbackCategory } from '../../../../infra/rest/apis/feedback/typing';
import useFeedbackModal from './hooks';

const FeedbackModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    title,
    setTitle,
    details,
    setDetails,
    category,
    setCategory,
    reproduceSteps,
    setReproduceSteps,
    attachment,
    setAttachment,
    errors,
    setErrors,
    fileInputRef,
    isSubmitting,
    handleFileChange,
    handleSubmit,
    handleClose,
  } = useFeedbackModal({ onClose });

  return (
    <A2ZModal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          maxWidth: '100%',
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        <A2ZTypography variant="h5" component="h2" text="Share Your Feedback" />

        <TextField
          label="Short and descriptive title"
          fullWidth
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setErrors(prev => ({ ...prev, title: '' }));
          }}
          error={!!errors.title}
          helperText={errors.title || `${title.length}/200`}
          FormHelperTextProps={{ sx: { textAlign: 'right' } }}
          inputProps={{ maxLength: 200 }}
        />

        <FormControl fullWidth error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={e => {
              setCategory(e.target.value);
              setErrors(prev => ({ ...prev, category: '' }));
            }}
          >
            <MenuItem value={FeedbackCategory.ARTICLES}>Articles</MenuItem>
            <MenuItem value={FeedbackCategory.CHATS}>Chats</MenuItem>
            <MenuItem value={FeedbackCategory.CODE}>Code</MenuItem>
          </Select>
          {errors.category && (
            <FormHelperText>{errors.category}</FormHelperText>
          )}
        </FormControl>

        <TextField
          label="Details box"
          multiline
          minRows={3}
          maxRows={8}
          fullWidth
          value={details}
          onChange={e => {
            setDetails(e.target.value);
            setErrors(prev => ({ ...prev, details: '' }));
          }}
          error={!!errors.details}
          helperText={errors.details || `${details.length}/2000`}
          FormHelperTextProps={{ sx: { textAlign: 'right' } }}
          inputProps={{ maxLength: 2000 }}
        />

        <TextField
          label="Reproduce steps (Optional)"
          multiline
          minRows={2}
          maxRows={8}
          fullWidth
          value={reproduceSteps}
          onChange={e => setReproduceSteps(e.target.value)}
          placeholder="1. Go to page X&#10;2. Click button Y..."
        />

        <Box>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mr: 2 }}
          >
            {attachment ? 'Change Attachment' : 'Add Attachment'}
          </Button>
          {attachment && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Attached: {attachment.name}
              <Button
                size="small"
                color="error"
                onClick={() => {
                  setAttachment(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                sx={{ ml: 1 }}
              >
                Remove
              </Button>
            </Typography>
          )}
        </Box>

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
        >
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Box>
      </Box>
    </A2ZModal>
  );
};

export default FeedbackModal;
