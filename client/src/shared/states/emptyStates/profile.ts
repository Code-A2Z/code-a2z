import { Profile } from "../../typings/profile";

export const emptyProfileState: Profile = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    email: "",
    bio: ""
  },
  social_links: {
    github: "",
    twitter: "",
    facebook: "",
    instagram: "",
    website: ""
  },
  account_info: {
    total_posts: 0,
    total_reads: 0
  },
  joinedAt: ""
};
