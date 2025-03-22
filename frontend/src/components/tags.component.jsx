// root packages 
import { useContext } from "react";

// pages files 
import { EditorContext } from "../pages/Editor.page";

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
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
            <p className="outline-none" onKeyDown={handleTagEdit} onClick={addEditable}>{tag}</p>
            <button
                className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                onClick={handleTagDelete}
            >
                <i className="fi fi-br-cross text-xl pointer-events-none"></i>
            </button>
        </div>
    );
}

export default Tag;
