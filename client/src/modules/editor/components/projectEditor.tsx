import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import AnimationWrapper from '../../../shared/components/atoms/page-animation';
import { uploadImage } from '../../../shared/hooks/upload-image';
import { tools } from './tools';
import { useAtom, useSetAtom } from 'jotai';
import { ProjectAtom } from '../../../shared/states/project';
import { EditorAtom, TextEditorAtom } from '../states';
import { useNotifications } from '../../../shared/hooks/use-notification';
import { createProject } from '../requests';
import type { EditorBlock } from '../../../infra/rest/typings';
import { EditorMode } from '../typings';
import { defaultBanner } from '../constants';

const ProjectEditor = () => {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [project, setProject] = useAtom(ProjectAtom);
  const setEditorState = useSetAtom(EditorAtom);
  const [textEditor, setTextEditor] = useAtom(TextEditorAtom);
  const { title, banner, repository, projectUrl, des, content, tags } =
    project ?? {};

  useEffect(() => {
    if (!textEditor.isReady) {
      const editorInstance = new EditorJS({
        holder: 'textEditor',
        data: Array.isArray(project?.content)
          ? project.content[0]
          : project?.content,
        tools: tools,
        placeholder: "Let's write an awesome story",
      });
      setTextEditor({ editor: editorInstance, isReady: true });
    }
  }, [textEditor.isReady, project?.content, setTextEditor]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];

    if (img) {
      uploadImage(img)
        .then(url => {
          if (url) {
            addNotification({
              message: 'Uploaded successfully',
              type: 'success',
            });
            setProject(prev => (prev ? { ...prev, banner: url } : null));
          }
        })
        .catch(err => {
          return addNotification({ message: err, type: 'error' });
        });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13) {
      // Enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

    setProject(prev => (prev ? { ...prev, title: textarea.value } : null));
  };

  const handleRepositoryURLChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target;
    setProject(prev => (prev ? { ...prev, repository: input.value } : null));
  };

  const handleProjectURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    setProject(prev => (prev ? { ...prev, projectUrl: input.value } : null));
  };

  const handlePublishEvent = () => {
    if (!banner?.length) {
      return addNotification({
        message: 'Upload a project banner to publish it',
        type: 'error',
      });
    }
    if (!title?.length) {
      return addNotification({
        message: 'Title is required to publish a project',
        type: 'error',
      });
    }
    if (textEditor.isReady) {
      textEditor.editor
        ?.save()
        .then((outputData: { blocks: EditorBlock[] }) => {
          if (outputData.blocks.length) {
            setProject(prev =>
              prev
                ? { ...prev, content: [{ blocks: outputData.blocks }] }
                : null
            );
            setEditorState(EditorMode.PUBLISH);
          } else {
            return addNotification({
              message: 'Write something in your project to publish it',
              type: 'error',
            });
          }
        })
        .catch((err: unknown) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.className.includes('disable')) {
      return;
    }

    if (!title?.length) {
      return addNotification({
        message: 'Write project title before saving it as a draft',
        type: 'error',
      });
    }

    if (!repository?.length) {
      return addNotification({
        message: 'Add a repository URL before saving it as a draft',
        type: 'error',
      });
    }

    e.currentTarget.classList.add('disable');

    if (textEditor.isReady && des && banner && projectUrl && content && tags) {
      const response = await createProject({
        id: project_id,
        title,
        des,
        banner,
        projectUrl,
        repository,
        content,
        tags,
        draft: true,
      });
      if (response.success) {
        e.currentTarget.classList.remove('disable');
        addNotification({
          message: 'Project saved successfully',
          type: 'success',
        });
        setTimeout(() => {
          navigate('/dashboard/projects?tab=draft');
        }, 500);
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src="/logo.png" alt="" className="w-full rounded-md" />
        </Link>
        <p className="max-md:hidden text-black dark:text-white line-clamp-1 w-full">
          {title?.length ? title : 'New Project'}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auth max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-[#fafafa] dark:bg-[#09090b] border-4 border-gray-200">
              <label htmlFor="uploadBanner">
                <img src={banner ? banner : defaultBanner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Project Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <div className="flex flex-col md:flex-row gap-4 sm:gap-2 mt-5">
              <input
                type="text"
                placeholder="Repository URL"
                defaultValue={repository}
                className="text-xl font-medium w-full md:w-1/2 h-16 md:h-20 outline-none resize-none leading-tight placeholder:opacity-40"
                onChange={handleRepositoryURLChange}
              />
              <input
                type="text"
                placeholder="Project Live URL"
                defaultValue={projectUrl}
                className="text-xl font-medium w-1/2 h-20 outline-none resize-none leading-tight placeholder:opacity-40"
                onChange={handleProjectURLChange}
              />
            </div>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default ProjectEditor;
