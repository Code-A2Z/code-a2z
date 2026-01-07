import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import NoDataMessage from '../../shared/components/atoms/no-data-msg';
import { useAtom, useAtomValue } from 'jotai';
import { HomePageProjectsAtom } from '../home/v1/states';
import BannerProjectCard from '../home/v1/components/banner-project-card';
import { ProfileAtom } from './states';
import { Virtuoso } from 'react-virtuoso';
import { BannerSkeleton } from '../../shared/components/atoms/skeleton';
import { UserAtom } from '../../infra/states/user';
import { Avatar, Box, CircularProgress } from '@mui/material';
import useHomeV1 from '../home/v1/hooks';
import AboutUser from './components/about-user';
import A2ZTypography from '../../shared/components/atoms/typography';
import Button from '../../shared/components/atoms/button';
import useProfile from './hooks';

const Profile = () => {
  const { username } = useParams();
  const user = useAtomValue(UserAtom);
  const profile = useAtomValue(ProfileAtom);
  const [projects, setProjects] = useAtom(HomePageProjectsAtom);
  const { fetchProjectsByCategory } = useHomeV1();
  const { fetchUserProfile } = useProfile();

  useEffect(() => {
    if (username !== user?.personal_info.username) {
      setProjects([]);
    }
    if (projects.length === 0 || profile?.personal_info.username !== username) {
      fetchUserProfile();
    }
  }, [
    username,
    user?.personal_info.username,
    profile?.personal_info.username,
    projects.length,
    setProjects,
    fetchUserProfile,
  ]);

  if (!profile) {
    return <CircularProgress size={24} />;
  }

  return (
    <Box
      component="section"
      sx={{
        minHeight: 'calc(100vh - 65px)',
        display: { xs: 'block', md: 'flex' },
        flexDirection: { md: 'row-reverse' },
        justifyContent: 'center',
        gap: { md: 5, lg: 8 },
        p: 3,
      }}
    >
      {/* Right Column (Profile Info) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          minWidth: 400,
          gap: 2,
          pl: { md: 4 },
          borderLeft: theme => ({ md: `1px solid ${theme.palette.divider}` }),
        }}
      >
        <Avatar
          src={profile.personal_info.profile_img}
          alt={profile.personal_info.fullname}
          sx={{
            width: { xs: 120, md: 130 },
            height: { xs: 120, md: 130 },
            bgcolor: 'grey.300',
          }}
        />

        <A2ZTypography
          variant="h6"
          props={{ fontWeight: 500 }}
          text={`@${profile.personal_info.username}`}
        />
        <A2ZTypography
          variant="subtitle1"
          props={{ textTransform: 'capitalize' }}
          text={profile.personal_info.fullname}
        />
        <A2ZTypography
          variant="body1"
          props={{ color: 'text.secondary' }}
          text={`${profile.account_info.total_posts.toLocaleString()} Projects - ${profile.account_info.total_reads.toLocaleString()} Reads`}
        />

        {user && username === user.personal_info.username ? (
          <Button
            href="/settings/edit-profile"
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          >
            Edit Profile
          </Button>
        ) : undefined}

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        >
          <AboutUser
            bio={profile.personal_info.bio}
            social_links={profile.social_links}
            joinedAt={profile.joinedAt}
          />
        </Box>
      </Box>

      {/* Left Column (Projects + About Tabs) */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          height: { xs: '52vh', md: '90vh' },
        }}
      >
        <InPageNavigation
          routes={['Projects Published', 'About']}
          defaultHidden={['About']}
        >
          {projects.length ? (
            <Virtuoso
              style={{ height: '100%', width: '100%', scrollbarWidth: 'none' }}
              totalCount={projects.length}
              itemContent={index => (
                <BannerProjectCard key={index} project={projects[index]} />
              )}
              overscan={200}
              endReached={() => {
                const nextPage = Math.floor(projects.length / 10) + 1; // Assuming page size of 10
                fetchProjectsByCategory({
                  page: nextPage,
                  user_id: profile._id,
                });
              }}
              components={{
                Footer: () =>
                  !projects || projects.length === 0 ? (
                    <BannerSkeleton count={3} />
                  ) : null, // FIX ME
              }}
            />
          ) : (
            <NoDataMessage message="No projects published" />
          )}

          <AboutUser
            bio={profile.personal_info.bio}
            social_links={profile.social_links}
            joinedAt={profile.joinedAt}
          />
        </InPageNavigation>
      </Box>
    </Box>
  );
};

export default Profile;
