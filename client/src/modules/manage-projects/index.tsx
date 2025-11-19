import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InPageNavigation from '../../shared/components/molecules/page-navigation';
import NoDataMessage from '../../shared/components/atoms/no-data-msg';
import { useAtom, useAtomValue } from 'jotai';
import { HomePageProjectsAtom } from '../home/states';
import BannerProjectCard from '../home/components/banner-project-card';
import { ProfileAtom } from '../profile/states';
import { Virtuoso } from 'react-virtuoso';
import { BannerSkeleton } from '../../shared/components/atoms/skeleton';
import { UserAtom } from '../../infra/states/user';
import { Avatar, Box, CircularProgress, Grid } from '@mui/material';
import useHome from '../home/hooks';
import AboutUser from '../profile/components/about-user';
import A2ZTypography from '../../shared/components/atoms/typography';
import Button from '../../shared/components/atoms/button';
import useProfile from '../profile/hooks';

const Profile = () => {
  const { username } = useParams();
  const user = useAtomValue(UserAtom);
  const profile = useAtomValue(ProfileAtom);
  const [projects, setProjects] = useAtom(HomePageProjectsAtom);
  const { fetchProjectsByCategory } = useHome();
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
    projects.length,
    profile?.personal_info.username,
    fetchUserProfile,
    setProjects,
  ]);

  if (!profile) {
    return (
      <Box
        component="section"
        sx={{
          minHeight: 'calc(100vh - 65px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ minHeight: 'calc(100vh - 65px)', p: 3 }}>
      <Grid
        container
        spacing={{ md: 5, lg: 8 }}
        justifyContent="center"
        sx={{ alignItems: 'flex-start' }}
      >
        {/* Right Column (Profile Info) */}
        <Grid
          item
          xs={12}
          md="auto"
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
        </Grid>

        {/* Left Column (Projects + About Tabs) */}
        <Grid
          item
          xs={12}
          md
          sx={{
            width: '100%',
            maxWidth: 800,
            height: { xs: '52vh', md: '90vh' },
            alignSelf: 'stretch',
          }}
        >
          <InPageNavigation
            routes={['Projects Published', 'About']}
            defaultHidden={['About']}
          >
            {projects.length ? (
              <Virtuoso
                style={{
                  height: '100%',
                  width: '100%',
                  scrollbarWidth: 'none',
                }}
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
