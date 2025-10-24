import type { AllProjectsData } from '../../../infra/rest/typings';

export const loadProjectsByCategory = (
  e: React.MouseEvent<HTMLButtonElement>,
  pageState: string,
  setPageState: (state: string) => void,
  setProjects: (projects: AllProjectsData | null) => void
) => {
  const category = (e.target as HTMLButtonElement).innerText.toLowerCase();
  setProjects(null);

  if (pageState === category) {
    setPageState('home');
    return;
  }
  setPageState(category);
};
