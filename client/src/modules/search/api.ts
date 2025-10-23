// client/src/modules/search/api.ts
import { makeRequest } from '../../infra/rest';
import { AllProjectsData } from '../../shared/typings';
import { UserProfile } from './typings';

export const fetchProjects = async (
  query?: string
): Promise<AllProjectsData> => {
  // Use existing makeRequest function
  // Replace with real endpoint if available
  const response = await makeRequest('/projects', { method: 'GET' });
  if (query) {
    const searchTerm = query.toLowerCase();
    response.results = response.results.filter(
      (project: any) =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm)
        )
    );
  }
  return response;
};

export const fetchUsers = async (query?: string): Promise<UserProfile[]> => {
  // Replace with real endpoint if available
  const response: UserProfile[] = [
    // mockUsers array
  ];
  if (query) {
    const searchTerm = query.toLowerCase();
    return response.filter(
      user =>
        user.personal_info.fullname.toLowerCase().includes(searchTerm) ||
        user.personal_info.username.toLowerCase().includes(searchTerm) ||
        user.personal_info.bio?.toLowerCase().includes(searchTerm)
    );
  }
  return response;
};
