import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InPageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import AnimationWrapper from "../common/page-animation";
import ProjectPostCard from "../components/ProjectPostCard";
import NoDataMessage from "../components/NoData";
import LoadMoreDataBtn from "../components/LoadMoreData";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";

const SearchPage = () => {

    let { query } = useParams();

    let [projects, setProjects] = useState(null);

    const searchProjects = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/search", { tag: query, page })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: projects,
                    data: data.projects,
                    page,
                    countRoute: "/api/project/search-count",
                    data_to_send: { tag: query },
                    create_new_arr
                })

                setProjects(formattedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        resetState();
        searchProjects({ page: 1, create_new_arr: true });
    }, [query])

    const resetState = () => {
        setProjects(null);
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={[`Search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                    <>
                        {
                            projects === null ? (
                                <Loader />
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
                        <LoadMoreDataBtn state={projects} fetchDataFun={searchProjects} />
                    </>
                </InPageNavigation>
            </div>
        </section>
    );
}

export default SearchPage;
