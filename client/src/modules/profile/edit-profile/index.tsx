import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import { useAtom } from "jotai";
import { UserAtom } from "../../../shared/states/user";
import { ProfileAtom } from "../../../shared/states/profile";
import { useNotifications } from "../../../shared/hooks/use-notification";
import { storeInSession } from "../../../shared/utils/session";
import { uploadImage } from "../../../shared/hooks/upload-image";
import {
  getUserProfile,
  updateProfile,
  uploadProfileImage,
} from "../requests";
import { bioLimit } from "../constants";
import AnimationWrapper from "../../../shared/components/atoms/page-animation";
import Loader from "../../../shared/components/atoms/loader";

const EditProfile = () => {
  const [user, setUser] = useAtom(UserAtom);
  const [profile, setProfile] = useAtom(ProfileAtom);
  const { addNotification } = useNotifications();

  const profileImgEle = useRef<HTMLImageElement>(null);
  const editProfileForm = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [charactersLeft, setCharactersLeft] = useState<number>(bioLimit);
  const [updatedProfileImg, setUpdatedProfileImg] = useState<File | null>(null);

  const {
    personal_info: { fullname, username: profile_username, profile_img, email, bio },
    social_links,
  } = profile;

  useEffect(() => {
    if (user.access_token) {
      getUserProfile(user.username)
        .then((response) => {
          setProfile(response);
          setLoading(false);
        })
        .catch(({ response }) => {
          console.error(response.data);
          setLoading(false);
        });
    }
  }, [user.access_token, user.username, setProfile]);

  const handleCharacterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharactersLeft(bioLimit - e.currentTarget.value.length);
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.currentTarget.files?.[0];
    if (profileImgEle.current && img) {
      profileImgEle.current.src = URL.createObjectURL(img);
      setUpdatedProfileImg(img);
    }
  };

  const handleImageUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!updatedProfileImg) return;
    e.currentTarget.setAttribute("disabled", "true");

    try {
      const url = await uploadImage(updatedProfileImg);
      if (url) {
        const response = await uploadProfileImage(url);
        const newUser = { ...user, profile_img: response.profile_img };
        storeInSession("user", JSON.stringify(newUser));
        setUser(newUser);

        setUpdatedProfileImg(null);
        addNotification({ message: "Profile Image Updated", type: "success" });
      }
    } catch (err: any) {
      console.error(err);
      addNotification({ message: "Error uploading image", type: "error" });
    } finally {
      e.currentTarget.removeAttribute("disabled");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProfileForm.current) return;

    const form = new FormData(editProfileForm.current);
    const formData: { [key: string]: FormDataEntryValue } = {};
    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    const {
      username,
      bio,
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website,
    } = formData;

    if (typeof username !== "string" || username.length < 3) {
      return addNotification({
        message: "Username should be at least 3 characters long",
        type: "error",
      });
    }

    if (typeof bio === "string" && bio.length > bioLimit) {
      return addNotification({
        message: `Bio should be less than ${bioLimit} characters`,
        type: "error",
      });
    }

    try {
      const response = await updateProfile(
        username as string,
        bio as string,
        youtube as string,
        facebook as string,
        twitter as string,
        github as string,
        instagram as string,
        website as string
      );

      if (user.username !== response.username) {
        const newUserAuth = { ...user, username: response.username };
        storeInSession("user", JSON.stringify(newUserAuth));
        setUser(newUserAuth);
      }

      addNotification({ message: "Profile Updated", type: "success" });
    } catch ({ response }: any) {
      addNotification({ message: response.data.error, type: "error" });
    } finally {
      e.currentTarget.removeAttribute("disabled");
    }
  };

  return (
   <AnimationWrapper>
  {loading ? (
    <Loader />
  ) : (
    <Paper
      elevation={3}
      sx={{ p: 4, borderRadius: 3, maxWidth: 900, mx: "auto", mt: 4 }}
    >
      <Typography variant="h4" fontWeight={600} mb={4}>
        Edit Profile
      </Typography>

      <form ref={editProfileForm} onSubmit={handleSubmit}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 5, lg: 10 }}
          alignItems="flex-start"
        >
          {/* Profile Image Section */}
          <Box textAlign="center" sx={{ mx: { xs: "auto", lg: 0 } }}>
            <Box position="relative" display="inline-block">
              <Avatar
                ref={profileImgEle}
                src={profile_img}
                alt={fullname}
                sx={{ width: 192, height: 192 }}
              />
              <IconButton
                color="primary"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept=".jpeg,.png,.jpg"
                  onChange={handleImagePreview}
                />
              </IconButton>
            </Box>

            <Button
              variant="outlined"
              sx={{ mt: 2, width: "100%" }}
              onClick={handleImageUpload}
            >
              Upload
            </Button>
          </Box>

          {/* Form Fields Section */}
          <Stack spacing={3} sx={{ width: "100%" }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Full Name"
                name="fullname"
                value={fullname}
                fullWidth
                disabled
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1 }}>
                      <i className="fi-rr-user" />
                    </Box>
                  ),
                }}
              />
              <TextField
                label="Email"
                name="email"
                value={email}
                fullWidth
                disabled
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1 }}>
                      <i className="fi-rr-envelope" />
                    </Box>
                  ),
                }}
              />
            </Stack>

            <TextField
              label="Username"
              name="username"
              defaultValue={profile_username}
              fullWidth
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1 }}>
                    <i className="fi-rr-at" />
                  </Box>
                ),
              }}
            />
            <Typography variant="body2" color="text.secondary" mt={-1}>
              Username will use to search user and will be visible to all users
            </Typography>

            <TextField
              label="Bio"
              name="bio"
              multiline
              minRows={4}
              fullWidth
              defaultValue={bio}
              onChange={handleCharacterChange}
              inputProps={{ maxLength: bioLimit }}
            />
            <Typography variant="body2" color="text.secondary">
              {charactersLeft} characters Left
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={2}>
              Add your social handle below
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
              {(Object.keys(social_links) as Array<keyof typeof social_links>).map(
                (key, i) => (
                  <TextField
                    key={i}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    defaultValue={social_links[key]}
                    placeholder="https://"
                    sx={{ flex: "1 1 45%", mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1 }}>
                          <i
                            className={
                              key !== "website" ? "fi-brands-" + key : "fi-rr-globe"
                            }
                          />
                        </Box>
                      ),
                    }}
                  />
                )
              )}
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, px: 5, alignSelf: "flex-start" }}
            >
              Update
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  )}
</AnimationWrapper>


  );
};

export default EditProfile;
