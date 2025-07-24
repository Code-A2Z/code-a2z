import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/Loader";
import { getDay } from "../common/date";
import ProjectInteraction from "../components/ProjectInteraction";
import ProjectPostCard from "../components/ProjectPostCard";
import ProjectContent from "../components/ProjectContent";
import CommentsContainer, { fetchComments } from "../components/Comments";

export const projectStructure = {
    title: '',
    des: '',
    content: [],
    author: { personal_info: {} },
    banner: '',
    publishedAt: '',
    projectUrl: '',
    repository: '',
}

export const ProjectContext = createContext({});

const ProjectPage = () => {

    let { project_id } = useParams();

    const [project, setProject] = useState(projectStructure);
    const [similarProjects, setSimilarProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [islikedByUser, setLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    let { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt, projectUrl, repository } = project;

    const fetchProject = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/get", { project_id })
            .then(async ({ data: { project } }) => {

                project.comments = await fetchComments({ project_id: project._id, setParentCommentCountFun: setTotalParentCommentsLoaded });

                setProject(project);

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/search", { tag: project.tags[0], limit: 6, elminate_project: project_id })
                    .then(({ data }) => {
                        setSimilarProjects(data.projects);
                    })
                    .catch(err => {
                        console.log(err);
                    })

                setProject(project);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    useEffect(() => {
        resetStates();
        fetchProject();
    }, [project_id]);

    const resetStates = () => {
        setProject(projectStructure);
        setSimilarProjects(null);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);
    }

    return (
        <AnimationWrapper>
            {
                loading ? (
                    <>
                        <div className="mx-auto max-w-[900px] py-10 max-lg:px-[5vw] animate-pulse">
                            <div className="my-8 flex max-sm:flex-col justify-between sm:items-center">
                                <div className="bg-gray-300 dark:bg-gray-700 h-10 w-[60%] rounded-md"></div>
                                <div className="flex items-center gap-4 mt-4 sm:mt-2">
                                    <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                    <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                </div>
                            </div>

                            <div className="bg-gray-300 dark:bg-gray-700 aspect-video w-full rounded-md"></div>

                            <div className="flex max-sm:flex-col justify-between my-12">
                                <div className="flex gap-5 items-start">
                                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                    </div>
                                </div>
                                <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded-md max-sm:mt-6 max-sm:ml-12 max-sm:pl-5"></div>
                            </div>

                            {/* <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md w-full my-6"></div> */}

                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between space-x-4 border-y-2 border-x-0 py-2 my-2 border-y-gray-300 dark:border-y-gray-700">
                                        <div className="flex items-center space-x-4">
                                            <div className="size-10 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
                                            <div className="size-10 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
                                        </div>
                                        <div className="size-10 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>

                                    </div>
                                    <div className="h-10 my-10 bg-gray-300 dark:bg-gray-700 rounded w-[80%]"></div>

                                </div>
                            ))}
                        </div>
                    </>
                ) :
                    <ProjectContext.Provider value={{ project, setProject, islikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}>

                        <CommentsContainer />

                        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                            <div className="my-8 flex max-sm:flex-col justify-between">
                                <h2 className={`${projectUrl && repository ? "max-w-[60%]" : "max-w-[80%]"
                                    } truncate whitespace-nowrap overflow-hidden`}
                                >
                                    {title}
                                </h2>
                                <div className="flex gap-4">
                                    {
                                        projectUrl ?
                                            <Link to={projectUrl} className="btn-dark dark:btn-light rounded flex gap-2 items-center">
                                                <i className="fi fi-rr-link"></i>
                                                Live URL
                                            </Link>
                                            : ""
                                    }
                                    {
                                        repository ?
                                            <Link to={repository} className="btn-dark dark:btn-light rounded flex gap-2 items-center">
                                                <i className="fi fi-brands-github"></i>
                                                GitHub
                                            </Link>
                                            : ""
                                    }
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

                                <p className="text-gray-700 dark:text-gray-200 opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)}</p>
                            </div>

                            <ProjectInteraction />

                            <div className="my-12 font-gelasio project-page-content">
                                {
                                    content[0].blocks.map((block, i) => {
                                        return (
                                            <div key={i} className="my-4 md:my-8">
                                                <ProjectContent block={block} />
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <ProjectInteraction />

                            {
                                similarProjects && similarProjects.length ?
                                    <>
                                        <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Projects</h1>
                                        {
                                            similarProjects.map((project, i) => {
                                                let { author: { personal_info } } = project;

                                                return (
                                                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                                        <ProjectPostCard content={project} author={personal_info} />
                                                    </AnimationWrapper>
                                                )
                                            })
                                        }
                                    </>
                                    : ""
                            }

                        </div>
                    </ProjectContext.Provider>
            }
        </AnimationWrapper>
    )
}

export default ProjectPage;
