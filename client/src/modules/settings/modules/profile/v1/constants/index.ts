export const BIO_LIMIT = 150;
export const MIN_USERNAME_LENGTH = 3;
export const AVATAR_SIZE = 192;
export const ACCEPTED_IMAGE_TYPES = '.jpeg,.png,.jpg';

export const SOCIAL_LINKS_CONFIG = [
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@username',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/username',
  },
  { key: 'x', label: 'Twitter/X', placeholder: 'https://x.com/username' },
  {
    key: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/username',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/username',
  },
  { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
] as const;
