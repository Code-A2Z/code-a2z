import axios from 'axios';
import { SetStateAction } from 'react';
import { AllProjectsData } from '../../../../infra/rest/typings';

interface ProjectStats {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  [key: string]: number;
}

export interface Project {
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

export const deleteProject = (
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
