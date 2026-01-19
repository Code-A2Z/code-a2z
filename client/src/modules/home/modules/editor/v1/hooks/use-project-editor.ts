import { uploadImage } from '../../../../../../infra/rest/apis/media';
import { useNotifications } from '../../../../../../shared/hooks/use-notification';
import { useAtom, useSetAtom } from 'jotai';
import {
  EditorContentAtom,
  EditorPageAtom,
  EditorPageState,
  TextEditorAtom,
  DEFAULT_EDITOR_CONTENT,
} from '../states';
import { OutputData } from '@editorjs/editorjs';
import { createProject } from '../../../../../../infra/rest/apis/project';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor } from '.';
import { TAG_LIMIT } from '../constants';
import {
  ROUTES_SETTINGS_V1,
  ROUTES_V1,
} from '../../../../../../app/routes/constants/routes';

export const useProjectEditor = () => {
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const { project_id } = useParams();
  const { handlePublish } = useEditor();

  const setEditorPageState = useSetAtom(EditorPageAtom);
  const [textEditor, setTextEditor] = useAtom(TextEditorAtom);
  const [editorContent, setEditorContent] = useAtom(EditorContentAtom);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) {
      uploadImage(img)
        .then(({ status, message, data }) => {
          if (data?.upload_url) {
            addNotification({
              message,
              type: status,
            });
            setEditorContent(prev => ({ ...prev, banner: data.upload_url }));
          }
        })
        .catch(err => {
          return addNotification({ message: err, type: 'error' });
        });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setEditorContent(prev => ({ ...prev, title: textarea.value }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = e.target;
    setEditorContent(prev => ({ ...prev, description: textarea.value }));
  };

  const handleRepositoryURLChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target;
    setEditorContent(prev => ({ ...prev, repositoryURL: input.value }));
  };

  const handleLiveURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    setEditorContent(prev => ({ ...prev, liveURL: input.value }));
  };

  const handleTagsAdd = (tag: string) => {
    if (editorContent?.tags && editorContent.tags.length >= TAG_LIMIT) {
      return addNotification({
        message: `You can add up to ${TAG_LIMIT} tags only`,
        type: 'error',
      });
    }
    setEditorContent(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const handleTagsDelete = (index: number) => {
    setEditorContent(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleDraftProject = async () => {
    if (!editorContent?.title?.length) {
      return addNotification({
        message: 'Write project title before saving it as a draft',
        type: 'error',
      });
    }
    if (!editorContent?.repositoryURL?.length) {
      return addNotification({
        message: 'Add a repository URL before saving it as a draft',
        type: 'error',
      });
    }

    if (textEditor.isReady) {
      textEditor.editor
        ?.save()
        .then(async (outputData: OutputData) => {
          setEditorContent(prev => ({ ...prev, content: outputData }));
          const response = await createProject({
            _id: project_id ?? undefined,
            title: editorContent.title,
            description: editorContent.description || '',
            banner_url: editorContent?.banner || '',
            live_url: editorContent?.liveURL || '',
            repository_url: editorContent?.repositoryURL || '',
            tags: editorContent?.tags || [],
            content_blocks: outputData,
            is_draft: true,
          });
          if (response.status === 'success') {
            addNotification({
              message: response.message,
              type: response.status,
            });
            setTimeout(() => {
              navigate('/dashboard/projects?tab=draft');
            }, 500);
            setEditorContent(DEFAULT_EDITOR_CONTENT);
            setTextEditor({ isReady: false });
            setEditorPageState(EditorPageState.EDITOR);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  };

  const handlePublishEvent = () => {
    if (!editorContent?.banner?.length) {
      return addNotification({
        message: 'Upload a project banner to publish it',
        type: 'error',
      });
    }
    if (!editorContent?.title?.length) {
      return addNotification({
        message: 'Title is required to publish a project',
        type: 'error',
      });
    }
    if (textEditor.isReady) {
      textEditor.editor
        ?.save()
        .then((outputData: OutputData) => {
          if (outputData.blocks.length) {
            setEditorContent(prev => ({ ...prev, content: outputData }));
            handlePublish();
          } else {
            return addNotification({
              message: 'Write something in your project to publish it',
              type: 'error',
            });
          }
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  };

  const handlePublishProject = async () => {
    if (!editorContent?.title?.length) {
      return addNotification({
        message: 'Title is required to publish a project',
        type: 'error',
      });
    }
    if (!editorContent?.description?.length) {
      return addNotification({
        message: 'Description is required to publish a project',
        type: 'error',
      });
    }
    if (!editorContent?.banner?.length) {
      return addNotification({
        message: 'Upload a project banner to publish it',
        type: 'error',
      });
    }
    if (!editorContent?.repositoryURL?.length) {
      return addNotification({
        message: 'Add a repository URL to publish your project',
        type: 'error',
      });
    }
    if (!editorContent?.tags?.length) {
      return addNotification({
        message: 'Add at least one tag to publish your project',
        type: 'error',
      });
    }
    if (
      !(
        (Array.isArray(editorContent?.content) &&
          editorContent.content.length > 0) ||
        (!Array.isArray(editorContent?.content) &&
          !!(editorContent?.content as OutputData)?.blocks?.length)
      )
    ) {
      return addNotification({
        message: 'Write something in your project to publish it',
        type: 'error',
      });
    }
    const response = await createProject({
      _id: project_id ?? undefined,
      title: editorContent.title,
      description: editorContent.description || '',
      banner_url: editorContent.banner,
      live_url: editorContent.liveURL || '',
      repository_url: editorContent.repositoryURL || '',
      tags: editorContent.tags || [],
      content_blocks: editorContent.content,
      is_draft: false,
    });
    if (response.status === 'success') {
      addNotification({
        message: response.message,
        type: response.status,
      });
      setTimeout(() => {
        navigate(`${ROUTES_V1.SETTINGS}${ROUTES_SETTINGS_V1.MANAGE_ARTICLES}`);
      }, 500);
      setEditorContent(DEFAULT_EDITOR_CONTENT);
      setTextEditor({ isReady: false });
      setEditorPageState(EditorPageState.EDITOR);
    }
  };

  return {
    handleBannerUpload,
    handleTitleChange,
    handleDescriptionChange,
    handleRepositoryURLChange,
    handleLiveURLChange,
    handleTagsAdd,
    handleTagsDelete,
    handleDraftProject,
    handlePublishEvent,
    handlePublishProject,
  };
};
