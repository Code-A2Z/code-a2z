import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import Loader from '../../shared/components/atoms/loader';
import AboutUser from './components/aboutUser';
import { filterPaginationData } from '../../shared/requests/filter-pagination-data';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import ProjectPostCard from '../../shared/components/molecules/project-card';
import NoDataMessage from '../../shared/components/atoms/no-data-msg';
import LoadMoreDataBtn from '../../shared/components/molecules/load-more-data';
import PageNotFound from '../404';
import { useAtom, useAtomValue } from 'jotai';
import { ProfileAtom } from '../../shared/states/profile';
import { UserAtom } from '../../shared/states/user';
import { AllProjectsAtom } from '../../shared/states/project';
import { AllProjectsData } from '../../infra/rest/typings/project';
import { emptyProfileState } from '../../shared/states/emptyStates/profile';
import { searchProjectByCategory } from '../home/requests';
import { getUserProfile } from './requests';

const Profile = () => {
  const { id: profileId } = useParams();
  const user = useAtomValue(UserAtom);
  const [profile, setProfile] = useAtom(ProfileAtom);
  const [projects, setProjects] = useAtom(AllProjectsAtom);

  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState('');

  const resetState = useCallback(() => {
    setProfile(emptyProfileState);
    setLoading(true);
    setProfileLoaded('');
  }, [setProfile]);

  const getProjects = useCallback(
    async (params: Record<string, unknown>) => {
      const { page = 1, user_id } = params;

      if (typeof user_id !== 'string') return;

      const response = await searchProjectByCategory(
        user_id,
        typeof page === 'number' ? page : 1
      );
      if (response.projects) {
        const formattedData = await filterPaginationData({
          state: projects,
          data: response.projects,
          page: typeof page === 'number' ? page : 1,
          countRoute: '/api/project/search-count',
          data_to_send: { author: user_id },
        });

        if (formattedData) {
          const projectData: AllProjectsData = {
            results: formattedData.results,
            page: formattedData.page,
            totalDocs: formattedData.totalDocs || 0,
          };
          setProjects(projectData);
        }
      }
    },
    [projects, setProjects]
  );

  const fetchUserProfile = useCallback(async () => {
    if (!profileId) return;
    const response = await getUserProfile(profileId);
    if (response) {
      setProfile(response);
      getProjects({ user_id: response._id });
      setProfileLoaded(profileId);
      setLoading(false);
    }
  }, [profileId, setProfile, getProjects]);

  useEffect(() => {
    if (profileId !== profileLoaded) {
      setProjects(null);
    }
    if (projects === null) {
      resetState();
      fetchUserProfile();
    }
  }, [
    profileId,
    projects,
    profileLoaded,
    fetchUserProfile,
    resetState,
    setProjects,
  ]);

  if (!user || !profile) {
    return <Loader />;
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile.personal_info.username.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-gray-300 md:sticky md:top[100px] md:py-10">
            <img
              src={profile.personal_info.profile_img}
              alt=""
              className="w-48 h-48 bg-gray-200 rounded-full md:w-32 md:h-32"
            />

            <h1 className="text-2xl font-medium">
              @{profile.personal_info.username}
            </h1>
            <p className="text-xl capitalize h-6">
              {profile.personal_info.fullname}
            </p>

            <p>
              {profile.account_info.total_posts.toLocaleString()} Projects -{' '}
              {profile.account_info.total_reads.toLocaleString()} Reads
            </p>

            <div className="flex gap-4 mt-2">
              {profileId === user.username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              ) : (
                ''
              )}
            </div>

            <AboutUser
              className="max-md:hidden"
              bio={profile.personal_info.bio}
              social_links={profile.social_links}
              joinedAt={profile.joinedAt}
            />
          </div>

          <div className="max-wd-:mt-12 w-full">
            <InPageNavigation
              routes={['Projects Published', 'About']}
              defaultHidden={['About']}
            >
              <>
                {projects === null ? (
                  <Loader />
                ) : projects?.results.length ? (
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
                <LoadMoreDataBtn state={projects} fetchDataFun={getProjects} />
              </>

              <AboutUser
                bio={profile.personal_info.bio}
                social_links={profile.social_links}
                joinedAt={profile.joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default Profile;
