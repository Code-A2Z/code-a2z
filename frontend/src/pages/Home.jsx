import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation, { activeTabRef } from "../components/InPageNavigation";
import Loader from "../components/Loader";
import axios from "axios";
import ProjectPostCard from "../components/ProjectPostCard";
import MinimalProjectPost from "../components/NoBannerProjectPost";
import NoDataMessage from "../components/NoData";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/LoadMoreData";

const Home = () => {

    let [projects, setProjects] = useState(null);
    let [trendingProjects, setTrendingProjects] = useState(null);
    let [pageState, setPageState] = useState("home");

    let categories = ["web", "data science", "game development", "automation", "cloud computing", "blockchain"]

    const fetchLatestProjects = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/getall", { page })
            .then(async ({ data }) => {

                let formattedData = await filterPaginationData({
                    state: projects,
                    data: data.projects,
                    page,
                    countRoute: "/api/project/all-latest-count"
                })
                setProjects(formattedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchProjectsByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/search", { tag: pageState, page })
            .then(async ({ data }) => {

                let formattedData = await filterPaginationData({
                    state: projects,
                    data: data.projects,
                    page,
                    countRoute: "/api/project/search-count",
                    data_to_send: { tag: pageState }
                })

                setProjects(formattedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchTrendingProjects = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/trending")
            .then(({ data }) => {
                setTrendingProjects(data.projects);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const loadProjectsByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        setProjects(null);

        if (pageState === category) {
            setPageState("home");
            return;
        }
        setPageState(category);
    }

    useEffect(() => {
        activeTabRef.current.click();

        if (pageState === "home") {
            fetchLatestProjects({ page: 1 });
        } else {
            fetchProjectsByCategory({ page: 1 });
        }
        if (!trendingProjects) {
            fetchTrendingProjects();
        }
    }, [pageState]);

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* Latest projects */}
                <div className="w-full">
                    <InPageNavigation routes={[pageState, "trending projects"]} defaultHidden={["trending projects"]}>
                        <>
                            {
                                projects === null ? (
                                    <div className="flex flex-col space-y-2">
                                        {[1, 2].map((temp) => (
                                            <div key={temp} className="w-full p-4 bg-[#f5f5f5] dark:bg-[#151515] rounded-md animate-pulse space-y-4">
                                                {/* Header Section */}
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
                                                    <div className="flex-1 flex items-center space-x-3">
                                                        <div className="w-32 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                        <div className="w-24 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                    </div>
                                                </div>

                                                {/* Body Section */}
                                                <div className="flex justify-between items-start w-full max-w-3xl p-4 bg-[#f5f5f5] dark:bg-[#151515] rounded-md animate-pulse">
                                                    <div className="flex-1 pr-4 space-y-3">
                                                        <div className="h-8 w-2/3 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                        <div className="h-4 w-5/6 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                        <div className="h-4 w-5/6 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                    </div>
                                                    <div className="w-28 h-24 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-md flex-shrink-0"></div>
                                                </div>

                                                {/* Footer Section */}
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-8 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
                                                    <div className="w-8 h-8 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
                                                </div>
                                            </div>

                                        ))}
                                    </div>

                                ) : (
                                    projects && projects.results.length ?
                                        projects.results.map((project, i) => {
                                            return (
                                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                    <ProjectPostCard content={project} author={project.author.personal_info} />
                                                </AnimationWrapper>
                                            )
                                        })
                                        : <NoDataMessage message="No projects published" />
                                )
                            }
                            <LoadMoreDataBtn state={projects} fetchDataFun={(pageState === "home" ? fetchLatestProjects : fetchProjectsByCategory)} />
                        </>
                        {
                            trendingProjects === null ? (
                                <div className="flex flex-col space-y-2">
                                    {[1, 2].map((temp) => (
                                        <div key={temp} className="w-full p-4 bg-[#f5f5f5] dark:bg-[#151515] rounded-md animate-pulse space-y-4">
                                            {/* Header Section */}
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
                                                <div className="flex-1 flex items-center space-x-3">
                                                    <div className="w-32 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                    <div className="w-24 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                </div>
                                            </div>

                                            {/* Body Section */}
                                            <div className="flex justify-between items-start w-full max-w-3xl p-4 bg-[#f5f5f5] dark:bg-[#151515] rounded-md animate-pulse">
                                                <div className="flex-1 pr-4 space-y-3">
                                                    <div className="h-8 w-2/3 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                    <div className="h-4 w-5/6 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                    <div className="h-4 w-5/6 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
                                                </div>
                                                <div className="w-28 h-24 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-md flex-shrink-0"></div>
                                            </div>

                                            {/* Footer Section */}
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-8 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
                                                <div className="w-8 h-8 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            ) : (
                                trendingProjects.length ?
                                    trendingProjects.map((project, i) => {
                                        return (
                                            <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                <MinimalProjectPost project={project} index={i} />
                                            </AnimationWrapper>
                                        )
                                    })
                                    : <NoDataMessage message="No trending projects" />
                            )
                        }
                    </InPageNavigation>
                </div>

                {/* filters and trending projects */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-gray-200 pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Recommended topics</h1>

                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category, i) => {
                                        return (
                                            <button key={i} className={"tag " + (pageState === category ? "bg-[#f0f0f0] dark:bg-[#18181b] text-[#444444] dark:text-[#a3a3a3] " : "")} onClick={loadProjectsByCategory}>
                                                {category}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div>
                            <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>

                            {
                                trendingProjects === null ? (
                                    <Loader />
                                ) : (
                                    trendingProjects.length ?
                                        trendingProjects.map((project, i) => {
                                            return (
                                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                    <MinimalProjectPost project={project} index={i} />
                                                </AnimationWrapper>
                                            )
                                        })
                                        : <NoDataMessage message="No trending projects" />
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Home;
