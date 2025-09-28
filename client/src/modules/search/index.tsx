import { useParams } from 'react-router-dom';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import { useEffect, useState, useCallback } from 'react';
import Loader from '../../shared/components/atoms/loader';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import ProjectPostCard from '../../shared/components/molecules/project-card';
import NoDataMessage from '../../shared/components/atoms/no-data-msg';
import LoadMoreDataBtn from '../../shared/components/molecules/load-more-data';
import { filterPaginationData } from '../../shared/requests/filter-pagination-data';
import UserCard from '../../shared/components/molecules/user-card';
import { useAtom } from 'jotai';
import { AllProjectsAtom } from '../../shared/states/project';
import { searchProjectByCategory } from '../home/requests';
import { searchUserByName } from './requests';
import { UserProfile } from './typings';
import { AllProjectsData } from '../../shared/typings';

const Search = () => {
  const { query } = useParams();

  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [users, setUsers] = useState<UserProfile[] | null>(null);

  const resetState = useCallback(() => {
    setProjects(null);
    setUsers(null);
  }, [setProjects, setUsers]);

  const searchProjects = useCallback(
    async ({ page = 1, create_new_arr = false }) => {
      if (!query) return;
      const response = await searchProjectByCategory(query, page);
      if (response?.projects) {
        const formattedData = await filterPaginationData({
          state: projects,
          data: response.projects,
          page,
          countRoute: '/api/project/search-count',
          data_to_send: { tag: query },
          create_new_arr,
        });
        if (formattedData) {
          setProjects(formattedData as AllProjectsData);
        }
      }
    },
    [query, projects, setProjects]
  );

  const fetchUsers = useCallback(async () => {
    if (!query) return;
    const response = await searchUserByName(query);
    if (response?.users) {
      setUsers(response.users);
    }
  }, [query]);

  useEffect(() => {
    resetState();
    searchProjects({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query, resetState, searchProjects, fetchUsers]);

  const UserCardWrapper = () => {
    return (
      <>
        {!users ? (
          <Loader />
        ) : users?.length ? (
          users.map((user: UserProfile, i: number) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results from "${query}"`, 'Accounts Matched']}
          defaultHidden={['Accounts Matched']}
        >
          <>
            {projects === null ? (
              <Loader />
            ) : projects && projects.results.length ? (
              projects.results.map((project, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <ProjectPostCard
                      project={project}
                      author={project.author.personal_info}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No projects published" />
            )}
            <LoadMoreDataBtn state={projects} fetchDataFun={searchProjects} />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-gray-50 pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User related to search
          <i className="fi fi-rr-user mt-1"></i>
        </h1>

        <UserCardWrapper />
      </div>
    </section>
  );
};

export default Search;
