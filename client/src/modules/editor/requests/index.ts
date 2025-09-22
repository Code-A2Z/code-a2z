import { post } from "../../../infra/rest";
import { CreateProjectPayload, CreateProjectResponse } from "../typings";

export const createProject = async ({ id, title, des, banner, projectUrl, repository, content, tags }: CreateProjectPayload) => {
  return post<CreateProjectResponse, CreateProjectPayload>(
    `/api/project/create`,
    true,
    {
      id,
      title,
      des,
      banner,
      projectUrl,
      repository,
      content,
      tags,
      draft: true,
    }
  );
};