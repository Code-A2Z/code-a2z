const ManageDraftProjectPost = ({ project }: { project: Project }) => {
  const { title, des } = project;
  let { index = 0 } = project;

  index++;

  return (
    <div className="flex gap-10 border-b mb-6 max-md:px-4 border-gray-100 pb-6 items-center">
      <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
        {index < 10 ? '0' + index : index}
      </h1>

      <div>
        <h1 className="blog-title mb-3">{title}</h1>

        <p className="line-clamp-2 font-gelasio">
          {des?.length ? des : 'No Description'}
        </p>

        <div className="flex gap-6 mt-3">
          <Link
            to={`/editor/${project.project_id}`}
            className="pr-4 py-2 underline"
          >
            Edit
          </Link>

          <button
            className="lg:hidden pr-4 py-2 underline text-red"
            onClick={e => deleteProject(project, '', e.target as HTMLElement)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="max-lg:hidden">
        <button
          className="lg:block hidden pr-4 py-2 underline text-red"
          onClick={e => deleteProject(project, '', e.target as HTMLElement)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ManageDraftProjectPost;
