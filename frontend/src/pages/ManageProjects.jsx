import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";

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

    }, [access_token, projects, drafts, query])

    return (
        <>
            <h1>Manage Projects</h1>
        </>
    )
}

export default ManageProjects;
