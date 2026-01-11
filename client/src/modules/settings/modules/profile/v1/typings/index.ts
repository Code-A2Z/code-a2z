import { updateProfilePayload } from '../../../../../../infra/rest/apis/user/typing';
import { USER_SOCIAL_LINKS } from '../../../../../../infra/rest/typings';

export type UpdateProfilePayload = updateProfilePayload;

export interface ProfileFormData {
  username: string;
  bio: string;
  social_links: USER_SOCIAL_LINKS;
}

export interface ProfileImageUploadProps {
  currentImage: string;
  fullname: string;
  onImageSelect: (file: File) => void;
  onUpload: () => Promise<void>;
  uploading: boolean;
  disabled?: boolean;
}

export interface SocialLinkFormData {
  youtube: string;
  facebook: string;
  twitter: string;
  github: string;
  instagram: string;
  website: string;
}

export interface SocialLinkInputProps {
  formData: USER_SOCIAL_LINKS;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
