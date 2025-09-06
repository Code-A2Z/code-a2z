import { useEffect, useState } from "react";
import ProjectPostCard from "../../shared/components/molecules/project-card";
import MinimalProjectPost from "./components/noBannerProject";
import NoDataMessage from "../../shared/components/atoms/no-data-msg";
import LoadMoreDataBtn from "../../shared/components/molecules/load-more-data";
import AnimationWrapper from "../../shared/components/atoms/page-animation";
import { filterPaginationData } from "../../shared/requests/filter-pagination-data";
import InPageNavigation, { activeTabRef } from "../../shared/components/molecules/page-navigation";
import LatestProjectsSkeleton from "./components/latestProjectsSkeleton";
import TrendingProjectsSkeleton from "./components/trendingProjectsSkeleton";
import { getAllLatestProjects, getTrendingProjects, searchProjectByCategory } from "./requests";
import { useAtom } from "jotai";
import { AllProjectsAtom, TrendingProjectAtom } from "../../shared/states/project";
import { useNotifications } from "../../shared/hooks/use-notification";

const categories = [
  "web",
  "data science",
  "game development",
  "automation",
  "cloud computing",
  "blockchain",
];

const Home = () => {
  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [trendingProjects, setTrendingProjects] = useAtom(TrendingProjectAtom);
  const { addNotification } = useNotifications();

  const [pageState, setPageState] = useState("home");

  const fetchLatestProjects = async ({ page = 1 }) => {
    const response = await getAllLatestProjects(page);
    if (response.projects.length > 0) {
      const formattedData = await filterPaginationData({
        state: projects,
        data: response.projects,
        page,
        countRoute: "/api/project/all-latest-count",
      });
      if (formattedData.results) {
        setProjects(formattedData);
      } else {
        addNotification({
          message: "No Project Found!",
          type: "error"
        });
      }
    } else {
      addNotification({
        message: "No Projects Found!",
        type: "error"
      });
    }
  };

  const fetchProjectsByCategory = async ({ page = 1 }) => {
    const response = await searchProjectByCategory(pageState, page);
    if (response.projects.length > 0) {
      const formattedData = await filterPaginationData({
        state: projects,
        data: response.projects,
        page,
        countRoute: "/api/project/search-count",
        data_to_send: { tag: pageState },
      });
      setProjects(formattedData);
    }
  };

  const fetchTrendingProjects = async () => {
    const response = await getTrendingProjects();
    if (response.projects.length > 0) {
      setTrendingProjects(response.projects);
    }
  };

  const loadProjectsByCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    let category = (e.target as HTMLButtonElement).innerText.toLowerCase();
    setProjects(null);

    if (pageState === category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.click();
    }

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
          <InPageNavigation
            routes={[pageState, "trending projects"]}
            defaultHidden={["trending projects"]}
          >
            <>
              {projects?.results && projects.results.length === 0 ? (
                <LatestProjectsSkeleton count={3} />
              ) : projects?.results && projects.results.length ? (
                projects.results.map((project, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <ProjectPostCard
                        project={project}
                        author={project.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No projects published" />
              )}
              <LoadMoreDataBtn
                state={projects}
                fetchDataFun={
                  pageState === "home"
                    ? fetchLatestProjects
                    : fetchProjectsByCategory
                }
              />
            </>
            {trendingProjects && trendingProjects.length === 0 ? (
              <TrendingProjectsSkeleton count={3} />
            ) : trendingProjects && trendingProjects.length ? (
              trendingProjects.map((project, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalProjectPost project={project} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending projects" />
            )}
          </InPageNavigation>
        </div>

        {/* filters and trending projects */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-gray-200 pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">Recommended topics</h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      key={i}
                      className={
                        "tag " +
                        (pageState === category
                          ? "bg-[#f0f0f0] dark:bg-[#18181b] text-[#444444] dark:text-[#a3a3a3] "
                          : "")
                      }
                      onClick={loadProjectsByCategory}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>

              {trendingProjects === null ? (
                <TrendingProjectsSkeleton count={3} />
              ) : trendingProjects.length ? (
                trendingProjects.map((project, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalProjectPost project={project} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No trending projects" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
