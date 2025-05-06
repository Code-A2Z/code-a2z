import { useContext } from "react";
import { EditorContext } from "../pages/Editor";

const Tag = ({ tag, tagIndex }) => {

    let { project, project: { tags }, setProject } = useContext(EditorContext);

    const addEditable = (e) => {
        e.target.setAttribute("contentEditable", true);
        e.target.focus();
    }

    const handleTagEdit = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            let currentTag = e.target.innerText;
            tags[tagIndex] = currentTag;
            setProject({ ...project, tags });

            e.target.setAttribute("contentEditable", false);
        }
    }

    const handleTagDelete = () => {
        tags = tags.filter(t => t !== tag);
        setProject({ ...project, tags });
    }

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white dark:bg-black rounded-full inline-block hover:bg-opacity-50 pr-10">
            <p
                className="outline-none cursor-pointer"
                onKeyDown={handleTagEdit}
                onClick={addEditable}
            >
                {tag}
            </p>
            <button
                className="mt-[2px] rounded-full absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-0 p-0"
                onClick={handleTagDelete}
                aria-label="Delete tag"
            >
                <i className="fi fi-br-cross text-xl text-gray-600 hover:text-red-500"></i>
            </button>
        </div>
    );
}

export default Tag;
