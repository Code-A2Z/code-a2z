import { ProjectAtom } from '../../../shared/states/project';
import { useAtom } from 'jotai';

const Tag = ({ tag, tagIndex }: { tag: string; tagIndex: number }) => {
  const [project, setProject] = useAtom(ProjectAtom);
  const { tags } = project ?? { tags: [] };

  const addEditable = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.currentTarget.setAttribute('contentEditable', 'true');
    e.currentTarget.focus();
  };

  const handleTagEdit = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      const currentTag = e.currentTarget.innerText;
      tags[tagIndex] = currentTag;
      setProject(prev => (prev ? { ...prev, tags } : null));
      e.currentTarget.setAttribute('contentEditable', 'false');
    }
  };

  const handleTagDelete = () => {
    setProject(prev =>
      prev ? { ...prev, tags: prev.tags.filter(t => t !== tag) } : null
    );
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-[#fafafa] dark:bg-[#09090b] rounded-full inline-block hover:bg-opacity-50 pr-10">
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
};

export default Tag;
