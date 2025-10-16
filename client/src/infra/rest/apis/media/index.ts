import { post } from '../..';
import ApiResponse from '../../typing';
import { UploadResponse } from './typing';

export const uploadImage = async (img: File) => {
  const formData = new FormData();
  formData.append('image', img);

  return post<FormData, ApiResponse<UploadResponse>>(
    `/api/media/upload-image`,
    true,
    formData,
    false
  );
};
