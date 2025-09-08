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
import LatestProjectsSkeleton from "../components/skeletons/LatestProjectsSkeleton";
import TrendingProjectsSkeleton from "../components/skeletons/TrendingProjectsSkeleton";

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
                                    <LatestProjectsSkeleton />
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
                                <TrendingProjectsSkeleton />
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
                                    <TrendingProjectsSkeleton />
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
