import { useEffect, useState, useCallback } from 'react';
import { filterPaginationData } from '../../../shared/requests/filter-pagination-data';
import InPageNavigation from '../../../shared/components/molecules/page-navigation';
import Loader from '../../../shared/components/atoms/loader';
import NoDataMessage from '../../../shared/components/atoms/no-data-msg';
import AnimationWrapper from '../../../shared/components/atoms/page-animation';
import {
  ManagePublishedProjectCard,
  ManageDraftProjectPost,
} from './components/manageProjectCard';
import LoadMoreDataBtn from '../../../shared/components/molecules/load-more-data';
import { useSearchParams } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import {
  DraftProjectAtom,
  AllProjectsAtom,
} from '../../../shared/states/project';
import { UserAtom } from '../../../shared/states/user';
import { userWrittenProjects } from '../requests';
import { AllProjectsData } from '../../../shared/typings';

const ManageProjects = () => {
  const [projects, setProjects] = useAtom(AllProjectsAtom);
  const [drafts, setDrafts] = useAtom(DraftProjectAtom);
  const user = useAtomValue(UserAtom);

  const activeTab = useSearchParams()[0].get('tab');
  const [query, setQuery] = useState('');

  const getProjects = useCallback(
    (params: Record<string, unknown>) => {
      const { page = 1, draft = false, deletedDocCount = 0 } = params;

      userWrittenProjects({
        page: page as number,
        draft: draft as boolean,
        query,
        deletedDocCount: deletedDocCount as number,
      })
        .then(async data => {
          const formattedData = (await filterPaginationData({
            state: draft ? drafts : projects,
            data: data.projects || [],
            page: page as number,
            countRoute: '/search-projects-count',
            data_to_send: {
              query,
              tag: query,
              author: user.username || '',
              draft,
            },
          })) as AllProjectsData;

          if (formattedData) {
            if (draft) {
              setDrafts(formattedData);
            } else {
              setProjects(formattedData);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    [drafts, projects, query, setDrafts, setProjects, user.username]
  );

  useEffect(() => {
    if (user.access_token) {
      if (projects === null) {
        getProjects({ page: 1, draft: false });
      }
      if (drafts === null) {
        getProjects({ page: 1, draft: true });
      }
    }
  }, [user.access_token, projects, drafts, query, getProjects]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const searchQuery = e.currentTarget.value;
    setQuery(searchQuery);

    if (e.keyCode === 13 && searchQuery.length) {
      setProjects(null);
      setDrafts(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value.length) {
      setQuery('');
      setProjects(null);
      setDrafts(null);
    }
  };

  return (
    <>
      <h1 className="max-md:hidden">Manage Projects</h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-gray-100 dark:bg-[#1f1f1f] text-black dark:text-white p-4 pl-12 pr-6 rounded-full placeholder:text-gray-500 dark:placeholder:text-gray-400"
          placeholder="Search Projects"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />

        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-gray-500"></i>
      </div>

      <InPageNavigation
        routes={['Published Projects', 'Drafts']}
        defaultActiveIndex={activeTab !== 'draft' ? 0 : 1}
      >
        {
          // Published Projects
          projects === null ? (
            <Loader />
          ) : projects.results.length ? (
            <>
              {projects.results.map((project, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManagePublishedProjectCard
                      project={{
                        ...project,
                        index: i,
                        setStateFunc: setProjects,
                      }}
                    />
                  </AnimationWrapper>
                );
              })}

              <LoadMoreDataBtn
                state={projects}
                fetchDataFun={getProjects}
                additionalParam={{
                  draft: false,
                  deletedDocCount: projects.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessage message="No Published Projects" />
          )
        }

        {
          // Draft Projects
          drafts === null ? (
            <Loader />
          ) : drafts.results.length ? (
            <>
              {drafts.results.map((project, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManageDraftProjectPost
                      project={{
                        ...project,
                        index: i,
                        setStateFunc: setDrafts,
                      }}
                    />
                  </AnimationWrapper>
                );
              })}

              <LoadMoreDataBtn
                state={drafts}
                fetchDataFun={getProjects}
                additionalParam={{
                  draft: true,
                  deletedDocCount: drafts.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessage message="No Draft Projects" />
          )
        }
      </InPageNavigation>
    </>
  );
};

export default ManageProjects;
