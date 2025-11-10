import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../../shared/components/atoms/page-animation";
import Loader from "../../shared/components/atoms/loader";
import AboutUser from "./components/aboutUser";
import { filterPaginationData } from "../../shared/requests/filter-pagination-data";
import InPageNavigation from "../../shared/components/molecules/page-navigation";
import ProjectPostCard from "../../shared/components/molecules/project-card";
import NoDataMessage from "../../shared/components/atoms/no-data-msg";
import LoadMoreDataBtn from "../../shared/components/molecules/load-more-data";
import PageNotFound from "../404";
import { useAtom, useAtomValue } from "jotai";
import { ProfileAtom } from "../../shared/states/profile";
import { UserAtom } from "../../shared/states/user";
import { AllProjectsAtom } from "../../shared/states/project";
import { AllProjectsData } from "../../shared/typings/project";
import { emptyProfileState } from "../../shared/states/emptyStates/profile";
import { searchProjectByCategory } from "../home/requests";
import { getUserProfile } from "./requests";
import { Box, Stack, Avatar, Typography, Button } from "@mui/material";

const Profile = () => {
  const { id: profileId } = useParams();
  const user = useAtomValue(UserAtom);
  const [profile, setProfile] = useAtom(ProfileAtom);
  const [projects, setProjects] = useAtom(AllProjectsAtom);

  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState("");

  const resetState = useCallback(() => {
    setProfile(emptyProfileState);
    setLoading(true);
    setProfileLoaded("");
  }, [setProfile]);

  const getProjects = useCallback(
    async (params: Record<string, unknown>) => {
      const { page = 1, user_id } = params;
      if (typeof user_id !== "string") return;

      const response = await searchProjectByCategory(
        user_id,
        typeof page === "number" ? page : 1
      );

      if (response.projects) {
        const formattedData = await filterPaginationData({
          state: projects,
          data: response.projects,
          page: typeof page === "number" ? page : 1,
          countRoute: "/api/project/search-count",
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
  }, [profileId, projects, profileLoaded, fetchUserProfile, resetState, setProjects]);

  if (!user || !profile) return <Loader />;

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile.personal_info.username.length ? (
        <Stack
          direction={{ xs: "column", md: "row-reverse" }}
          spacing={{ xs: 4, md: 8 }}
          alignItems="flex-start"
          sx={{ minHeight: "100vh", py: 5 }}
        >
          {/* Left Panel */}
          <Stack
            spacing={2}
            sx={{
              minWidth: 250,
              width: { md: "50%" },
              px: { md: 2 },
              borderLeft: { md: "1px solid #ccc" },
              position: { md: "sticky" },
              top: { md: 100 },
            }}
          >
            <Avatar
              src={profile.personal_info.profile_img}
              alt={profile.personal_info.username}
              sx={{
                width: { xs: 192, md: 128 },
                height: { xs: 192, md: 128 },
                bgcolor: "grey.200",
                mx: { xs: "auto", md: 0 },
              }}
            />
            <Typography variant="h5" textAlign={{ xs: "center", md: "left" }}>
              @{profile.personal_info.username}
            </Typography>
            <Typography variant="h6" textAlign={{ xs: "center", md: "left" }}>
              {profile.personal_info.fullname}
            </Typography>
            <Typography textAlign={{ xs: "center", md: "left" }}>
              {profile.account_info.total_posts.toLocaleString()} Projects -{" "}
              {profile.account_info.total_reads.toLocaleString()} Reads
            </Typography>

            {profileId === user.username && (
              <Button
                component={Link}
                to="/settings/edit-profile"
                variant="outlined"
                sx={{ alignSelf: { xs: "center", md: "flex-start" } }}
              >
                Edit Profile
              </Button>
            )}

            <AboutUser
              className="max-md:hidden"
              bio={profile.personal_info.bio}
              social_links={profile.social_links}
              joinedAt={profile.joinedAt}
            />
          </Stack>

          {/* Right Panel */}
          <Box sx={{ flex: 1 }}>
            <InPageNavigation
              routes={["Projects Published", "About"]}
              defaultHidden={["About"]}
            >
              <>
                {projects === null ? (
                  <Loader />
                ) : projects?.results.length ? (
                  projects.results.map((project, i) => (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <ProjectPostCard
                        project={project}
                        author={project.author.personal_info}
                      />
                    </AnimationWrapper>
                  ))
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
          </Box>
        </Stack>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default Profile;
