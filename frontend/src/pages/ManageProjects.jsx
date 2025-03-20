import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/InPageNavigation";
import Loader from "../components/Loader";
import NoDataMessage from "../components/NoData";
import AnimationWrapper from "../common/page-animation";
import ManagePublishedProjectCard from "../components/ManageProjectCard";

const ManageProjects = () => {

    const [projects, setProjects] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState("");

    let { userAuth: { access_token } } = useContext(UserContext);

    const getProjects = ({ page, draft, deleteDocCount = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/user-written", {
            page, draft, query, deleteDocCount
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: draft ? drafts : projects,
                    data: data.projects,
                    page,
                    user: access_token,
                    countRoute: "/api/project/user-written-count",
                    data_to_send: { draft, query }
                })

                if (draft) {
                    setDrafts(formattedData);
                } else {
                    setProjects(formattedData);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {

        if (access_token) {
            if (projects === null) {
                getProjects({ page: 1, draft: false });
            }
            if (drafts === null) {
                getProjects({ page: 1, draft: true });
            }
        }

    }, [access_token, projects, drafts, query]);

    const handleSearch = (e) => {
        let searchQuery = e.target.value;

        setQuery(searchQuery);

        if (e.keyCode === 13 && searchQuery.length) {
            setProjects(null);
            setDrafts(null);
        }
    }

    const handleChange = (e) => {
        if (!e.target.value.length) {
            setQuery("");
            setProjects(null);
            setDrafts(null);
        }
    }

    return (
        <>
            <h1 className="max-md:hidden">Manage Projects</h1>

            <Toaster />

            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-gray-100 p-4 pl-12 pr-6 rounded-full placeholder:text-gray-500"
                    placeholder="Search Projects"
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />

                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-gray-500"></i>
            </div>

            <InPageNavigation routes={["Published Projects", "Drafts"]}>
                {
                    // Published Projects
                    projects === null ? <Loader /> :
                        projects.results.length ?
                            <>
                                {
                                    projects.results.map((project, i) => {
                                        return (
                                            <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                                <ManagePublishedProjectCard project={project} />
                                            </AnimationWrapper>
                                        )
                                    })
                                }
                            </> :
                            <NoDataMessage message="No Published Projects" />
                }
            </InPageNavigation>
        </>
    )
}

export default ManageProjects;
