import { Schema } from 'mongoose';
import {
  profile_imgs_collections_list,
  profile_imgs_name_list,
} from '../constants/index.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const userSchema = new Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, 'Full name must be at least 3 letters'],
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters'],
      },
      username: {
        type: String,
        minlength: [3, 'Username must be at least 3 letters'],
        unique: true,
        lowercase: true,
        required: true,
      },
      bio: {
        type: String,
        maxlength: [200, 'Bio should not exceed 200 characters'],
        default: '',
      },
      profile_img: {
        type: String,
        default: () =>
          `https://api.dicebear.com/6.x/${
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ]
          }/svg?seed=${
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ]
          }`,
      },
    },
    social_links: {
      youtube: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    account_info: {
      total_posts: { type: Number, default: 0 },
      total_reads: { type: Number, default: 0 },
    },
    role: {
      type: String,
      enum: ['user', 'maintainer', 'admin'],
      default: 'user',
    },
    projects: {
      type: [Schema.Types.ObjectId],
      ref: COLLECTION_NAMES.PROJECTS,
      default: [],
    },
    collaborated_projects: {
      type: [Schema.Types.ObjectId],
      ref: COLLECTION_NAMES.PROJECTS,
      default: [],
    },
    collections: {
      type: [Schema.Types.ObjectId],
      ref: COLLECTION_NAMES.COLLECTIONS,
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'joinedAt', updatedAt: true },
  }
);

export default userSchema;
