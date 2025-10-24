import { Link } from 'react-router-dom';
import { getDay } from '../../../shared/utils/date';
import { Project, TrendingProject } from '../../../infra/rest/typings';

interface MinimalProjectPostProps {
  project: Project | TrendingProject;
  index: number;
}

const MinimalProjectPost = ({ project, index }: MinimalProjectPostProps) => {
  const {
    title,
    project_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = project;

  return (
    <Link to={`/project/${id}`} className="flex gap-5 mb-8">
      <h1 className="project-index">
        {index < 10 ? '0' + (index + 1) : index}
      </h1>
      <div>
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="project-title">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalProjectPost;
