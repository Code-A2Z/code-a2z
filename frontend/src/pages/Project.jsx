import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const projectStructure = {
    title: '',
    des: '',
    content: [],
    tags: [],
    activity: { personal_info: {} },
    banner: '',
    publishedAt: '',
}

const ProjectPage = () => {

    let { project_id } = useParams();

    const [project, setProject] = useState(null);

    let { title, content, banner, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = project;

    const fetchProject = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/get", { project_id })
            .then(({ data: { project } }) => {
                setProject(project);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchProject();
    }, []);

    return (
        <div>
            <h1>Project Page</h1>
        </div>
    )
}

export default ProjectPage;
