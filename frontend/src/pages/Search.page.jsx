// root packages 
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// common files 
import AnimationWrapper from "../common/page-animation";
import { filterPaginationData } from "../common/filter-pagination-data";

// components files 
import InPageNavigation from "../components/inPageNavigation.component";
import Loader from "../components/loader.component";
import ProjectPostCard from "../components/projectPostCard.component";
import NoDataMessage from "../components/noData.component";
import LoadMoreDataBtn from "../components/LoadMoreData";
import UserCard from "../components/userCard.component";

const SearchPage = () => {

    let { query } = useParams();

    let [projects, setProjects] = useState(null);
    let [users, setUsers] = useState(null);

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

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/user/search", { query })
            .then(({ data: { users } }) => {
                setUsers(users);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        resetState();
        searchProjects({ page: 1, create_new_arr: true });
        fetchUsers();
    }, [query])

    const resetState = () => {
        setProjects(null);
        setUsers(null);
    }

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users === null ? <Loader /> :
                        users.length ?
                            users.map((user, i) => {
                                return (
                                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                        <UserCard user={user} />
                                    </AnimationWrapper>
                                );
                            })
                            : (
                                <NoDataMessage message="No user found" />
                            )
                }
            </>
        )
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

                    <UserCardWrapper />
                </InPageNavigation>
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-gray-50 pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">
                    User related to search
                    <i className="fi fi-rr-user mt-1"></i>
                </h1>

                <UserCardWrapper />
            </div>
        </section>
    );
}

export default SearchPage;
