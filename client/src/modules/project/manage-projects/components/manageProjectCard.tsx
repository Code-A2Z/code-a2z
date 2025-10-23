import { Link } from 'react-router-dom';
import { getDay } from '../../../../shared/utils/date';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { UserAtom } from '../../../../shared/states/user';
import axios from 'axios';

import { SetStateAction } from 'react';
import { AllProjectsData } from '../../../../infra/rest/typings';

interface ProjectStats {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  [key: string]: number; // Allow dynamic key access
}

interface Project {
  _id?: string;
  project_id: string;
  title: string;
  des?: string;
  banner?: string;
  publishedAt: string;
  activity?: ProjectStats;
  index?: number;
  setStateFunc?: (value: SetStateAction<AllProjectsData | null>) => void;
}

const ProjectStats = ({ stats }: { stats: ProjectStats }) => {
  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-gray-100 max-lg:border-b">
      {Object.keys(stats).map((key, i) => {
        return !key.includes('parent') ? (
          <div
            key={i}
            className={
              'flex flex-col items-center w-full h-full justify-center p-4 px-6 ' +
              (i !== 0 ? ' border-gray-100 border-l' : '')
            }
          >
            <h1 className="text-xl lg:text-2xl mb-2">
              {stats[key].toLocaleString()}
            </h1>
            <p className="max-lg:text-gray-500 capitalize">
              {key.split('_')[1]}
            </p>
          </div>
        ) : (
          ''
        );
      })}
    </div>
  );
};

const deleteProject = (
  project: Project,
  access_token: string,
  target: EventTarget | null
) => {
  const { index, project_id, setStateFunc } = project;

  if (!(target instanceof HTMLElement)) return;

  target.setAttribute('disabled', 'true');

  axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN + '/api/project/delete',
      { project_id },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(() => {
      target.removeAttribute('disabled');

      if (setStateFunc) {
        setStateFunc((preVal: AllProjectsData | null) => {
          if (!preVal) return null;

          const { deletedDocCount = 0, totalDocs = 0, results = [] } = preVal;

          if (
            typeof index === 'number' &&
            index >= 0 &&
            index < results.length
          ) {
            results.splice(index, 1);
          }

          const newTotalDocs = totalDocs - 1;
          const newDeletedCount = deletedDocCount + 1;

          if (!results.length && newTotalDocs > 0) {
            return null;
          }

          return {
            ...preVal,
            results,
            totalDocs: newTotalDocs,
            deletedDocCount: newDeletedCount,
          };
        });
      }
    })
    .catch(err => {
      console.error('Error deleting project:', err);
      target.removeAttribute('disabled');
    });
};

export const ManagePublishedProjectCard = ({
  project,
}: {
  project: Project;
}) => {
  const { banner, project_id, title, publishedAt, activity } = project;

  const [user] = useAtom(UserAtom);
  const access_token = user.access_token || '';

  const [showStat, setShowStat] = useState(false);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-gray-100 pb-6 items-center">
        <img
          src={banner}
          alt=""
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-gray-100 object-cover"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link
              to={`/project/${project_id}`}
              className="project-title mb-4 hover:underline"
            >
              {title}
            </Link>

            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${project_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>

            <button
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => setShowStat(preVal => !preVal)}
            >
              Stats
            </button>

            <button
              className="pr-4 py-2 underline text-red-500"
              onClick={e => deleteProject(project, access_token, e.target)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          {activity && <ProjectStats stats={activity} />}
        </div>
      </div>

      {showStat ? (
        <div className="lg:hidden">
          {activity && <ProjectStats stats={activity} />}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export const ManageDraftProjectPost = ({ project }: { project: Project }) => {
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
