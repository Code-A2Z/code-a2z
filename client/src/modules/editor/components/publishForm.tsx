import { useNavigate, useParams } from "react-router-dom";
import AnimationWrapper from "../../../shared/components/atoms/page-animation";
import Tag from "./tags";
import { characterLimit, tagLimit } from "../constants";
import { useAtom, useSetAtom } from "jotai";
import { EditorAtom } from "../states";
import { EditorMode } from "../typings";
import { useNotifications } from "../../../shared/hooks/use-notification";
import { ProjectAtom } from "../../../shared/states/project";
import { createProject } from "../requests";

const PublishForm = () => {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [project, setProject] = useAtom(ProjectAtom);
  const setEditorState = useSetAtom(EditorAtom);

  const { banner, projectUrl, repository, title, tags, des, content } = project ?? {};

  const handleCloseEvent = () => {
    setEditorState(EditorMode.EDITOR);
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13) { // Enter key
      e.preventDefault();
    }
  }

  const handleProjectTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target;
    setProject((prev) => prev ? { ...prev, title: input.value } : null);
  }

  const handleProjectDesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let input = e.target;
    setProject((prev) => prev ? { ...prev, des: input.value } : null);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let tag = e.currentTarget.value;

      if (tags && tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setProject((prev) => prev ? { ...prev, tags: [...tags, tag] } : null);
        }
      } else {
        addNotification({
          message: `You can add maximum ${tagLimit} tags`,
          type: "error"
        });
      }
      e.currentTarget.value = "";
    }
  }

  const publishProject = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.className.includes("disable")) {
      return;
    }

    if (!title?.length) {
      return addNotification({
        message: "Write a project title before publishing",
        type: "error"
      });
    }

    if (!des?.length) {
      return addNotification({
        message: `Write a description about your project within ${characterLimit} characters to publish`,
        type: "error"
      });
    }

    if (!repository?.length) {
      return addNotification({
        message: "Add a repository URL to publish your project",
        type: "error"
      });
    }

    if (!tags?.length) {
      return addNotification({
        message: "Add at least 1 tag to help us to rank your project",
        type: "error"
      });
    }

    e.currentTarget.classList.add("disable");

    if (banner && projectUrl) {
      createProject({ id: project_id, title, des, banner, projectUrl, repository, content, tags, draft: false })
        .then(() => {
          e.currentTarget.classList.remove("disable");
          addNotification({
            message: "Project published successfully",
            type: "success"
          });
  
          setTimeout(() => {
            navigate("/dashboard/projects");
          }, 500);
        })
        .catch(({ response }) => {
          e.currentTarget.classList.remove("disable");
          return addNotification({
            message: response.data.error,
            type: "error"
          });
        })
    }
  }

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1"> Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200 mt-4">
            <img src={banner} alt="" />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
        </div>

        <div>
          <p className="text-dark-grey mb-2 mt-9">Project Title</p>
          <input type="text" placeholder="Project Title" defaultValue={title} className="input-box pl-4" onChange={handleProjectTitleChange} />

          <p className="text-dark-grey mb-2 mt-9">Short description about your project</p>

          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleProjectDesChange}
            onKeyDown={handleTitleKeyDown}
          >
          </textarea>

          <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - (des ?? "").length} characters left</p>

          <p className="text-dark-grey mb-2 mt-9">Topics - (Helps in searching and ranking your project post)</p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Add topics"
              className="sticky input-box top-0 left-0 pl-4 mb-3 bg-[#fafafa] dark:bg-[#09090b]"
              onKeyDown={handleKeyDown}
            />
            {
              tags?.map((tag, i) => {
                return <Tag tag={tag} tagIndex={i} key={i} />
              })
            }
          </div>
          <p className="mt-1 mb-4 text-dark-grey text-right">{tagLimit - (tags ?? []).length} Tags left</p>

          <button
            className="btn-dark px-8"
            onClick={publishProject}
          >
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm;
