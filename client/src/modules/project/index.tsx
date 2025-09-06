import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../../shared/components/atoms/page-animation";
import { getDay } from "../../shared/utils/date";
import ProjectInteraction from "./components/projectInteraction";
import ProjectPostCard from "../../shared/components/molecules/project-card";
import ProjectContent from "./components/projectContent";
import CommentsContainer, { fetchComments } from "./components/comments";
import ProjectLoadingSkeleton from "./components/projectLoadingSkeleton";
import { useAtom, useSetAtom } from "jotai";
import { ProjectAtom } from "../../shared/states/project";
import { Project } from "../../shared/typings";
import { CommentsWrapperAtom, LikedByUserAtom, TotalParentCommentsLoadedAtom } from "./states";
import { getProject, searchSimilarProjects } from "./requests";

const Project = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const [project, setProject] = useAtom(ProjectAtom);
  const setLikedByUser = useSetAtom(LikedByUserAtom);
  const setCommentsWrapper = useSetAtom(CommentsWrapperAtom);
  const setTotalParentCommentsLoaded = useSetAtom(TotalParentCommentsLoadedAtom);

  const [similarProjects, setSimilarProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    if (!project_id) return;

    try {
      const response = await getProject({ project_id });
      if (response.project) {
        // Fetch comments for the project
        const commentsResponse = await fetchComments({ 
          project_id: response.project._id || '',
          setParentCommentCountFun: setTotalParentCommentsLoaded 
        });
        
        const projectWithComments = {
          ...response.project,
          comments: commentsResponse
        };
        
        setProject(projectWithComments);
        
        // Fetch similar projects
        if (response.project.tags && response.project.tags.length > 0) {
          const similarResponse = await searchSimilarProjects({ 
            tag: response.project.tags[0], 
            limit: 6, 
            elminate_project: project_id 
          });
          
          if (similarResponse.projects) {
            setSimilarProjects(similarResponse.projects);
          }
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    resetStates();
    fetchProject();
  }, [project_id]);

  const resetStates = () => {
    setProject(null);
    setSimilarProjects(null);
    setLoading(true);
    setLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  if (loading) {
    return (
      <AnimationWrapper>
        <ProjectLoadingSkeleton count={3} />
      </AnimationWrapper>
    );
  }

  if (!project) {
    return (
      <AnimationWrapper>
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
          <h1 className="text-2xl font-medium text-center">Project not found</h1>
        </div>
      </AnimationWrapper>
    );
  }

  const { title, banner, author, publishedAt, projectUrl, repository, content } = project;
  const { personal_info: { fullname, username: author_username, profile_img } } = author;

  return (
    <AnimationWrapper>
      <CommentsContainer />

      <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
        <div className="my-8 flex max-sm:flex-col justify-between">
          <h2
            className={`${projectUrl && repository ? "max-w-[60%]" : "max-w-[80%]"} truncate whitespace-nowrap overflow-hidden`}
          >
            {title}
          </h2>
          <div className="flex gap-4">
            {projectUrl && (
              <Link to={projectUrl} className="btn-dark dark:btn-light rounded flex gap-2 items-center">
                <i className="fi fi-rr-link"></i>
                Live URL
              </Link>
            )}
            {repository && (
              <Link to={repository} className="btn-dark dark:btn-light rounded flex gap-2 items-center">
                <i className="fi fi-brands-github"></i>
                GitHub
              </Link>
            )}
          </div>
        </div>
        
        <img src={banner} alt="" className="aspect-video" />
        
        <div className="flex max-sm:flex-col justify-between my-12">
          <div className="flex gap-5 items-start">
            <img src={profile_img} alt="" className="w-12 h-12 rounded-full" />
            <p className="capitalize">
              {fullname}
              <br />
              @
              <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-200 opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
            Published on {getDay(publishedAt)}
          </p>
        </div>

        <ProjectInteraction />

        <div className="my-12 font-gelasio project-page-content">
          {content && content[0]?.blocks?.map((block, i) => (
            <div key={i} className="my-4 md:my-8">
              <ProjectContent block={block} />
            </div>
          ))}
        </div>

        <ProjectInteraction />

        {similarProjects && similarProjects.length > 0 && (
          <>
            <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Projects</h1>
            {similarProjects.map((similarProject, i) => {
              const { author: { personal_info } } = similarProject;
              return (
                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                  <ProjectPostCard project={similarProject} author={personal_info} />
                </AnimationWrapper>
              );
            })}
          </>
        )}
      </div>
    </AnimationWrapper>
  );
};

export default Project;
