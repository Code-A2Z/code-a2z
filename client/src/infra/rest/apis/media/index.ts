import { post } from '../..';
import { ApiResponse } from '../../typings';

export const uploadImage = async (img: File) => {
  const formData = new FormData();
  formData.append('image', img);

  return post<FormData, ApiResponse<{ upload_url: string }>>(
    `/api/media/upload-image`,
    true,
    formData
  );
};
