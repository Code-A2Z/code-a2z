import { post } from '../../infra/rest';

interface UploadResponse {
  uploadURL: string;
}

export const uploadImage = async (img: string | File) => {
  try {
    const formData = new FormData();
    formData.append('image', img);

    const response = await post<UploadResponse, FormData>(
      `/api/media/get-upload-url`,
      true,
      formData,
      undefined,
      { 'Content-Type': 'multipart/form-data' }
    );

    if (!response.uploadURL) throw new Error('Failed to get upload URL.');

    return response.uploadURL;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
};
