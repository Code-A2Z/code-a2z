import {
  AllProjectsData,
  Project,
  TrendingProject,
} from '../../typings/project';

export const emptyProjectState: Project = {
  activity: {
    total_likes: 0,
    total_comments: 0,
    total_reads: 0,
    total_parent_comments: 0,
  },
  project_id: '',
  title: '',
  banner: '',
  des: '',
  content: [],
  tags: [],
  author: {
    _id: '',
    personal_info: {
      fullname: '',
      username: '',
      profile_img: '',
    },
  },
  publishedAt: '',
  comments: {
    results: [],
  },
  _id: '',
};

export const emptyAllProjectsState: AllProjectsData = {
  results: [],
};

export const emptyTrendingProjectsState: TrendingProject[] = [];
