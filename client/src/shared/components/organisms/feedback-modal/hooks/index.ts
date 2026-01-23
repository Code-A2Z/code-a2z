import { useRef, useState } from 'react';
import { submitFeedback } from '../../../../../infra/rest/apis/feedback';
import { useNotifications } from '../../../../hooks/use-notification';
import fileToBase64 from '../../../../hooks/useFileToBase64';
import { FeedbackCategory } from '../../../../../infra/rest/apis/feedback/typing';

const useFeedbackModal = ({ onClose }: { onClose: () => void }) => {
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState<FeedbackCategory | ''>('');
  const [reproduceSteps, setReproduceSteps] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (title.length < 5 || title.length > 200) {
      newErrors.title = 'Title must be between 5 and 200 characters';
    }

    if (details.length < 10 || details.length > 2000) {
      newErrors.details = 'Details must be between 10 and 2000 characters';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let attachmentBase64 = undefined;
      if (attachment) {
        attachmentBase64 = await fileToBase64(attachment);
      }

      await submitFeedback({
        title,
        details,
        category: category as FeedbackCategory,
        reproduce_steps: reproduceSteps,
        attachment: attachmentBase64,
      });

      addNotification({
        message: 'Feedback submitted successfully!',
        type: 'success',
      });
      handleClose();
    } catch (error) {
      console.error('Feedback submission error:', error);
      addNotification({
        message: 'Failed to submit feedback. Please try again later.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDetails('');
    setCategory('');
    setReproduceSteps('');
    setAttachment(null);
    setErrors({});
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        addNotification({
          message: 'File size must be less than 5MB',
          type: 'error',
        });
        return;
      }
      setAttachment(file);
    }
  };

  return {
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
    handleSubmit,
    handleClose,
    handleFileChange,
  };
};

export default useFeedbackModal;
