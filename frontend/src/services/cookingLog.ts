import apiClient from '@/lib/axios';
import { ApiResponse, Category, CookingLog, TimeSlot } from '@/types';

export interface CreateCookingLogData {
  recipeId?: number;
  newRecipeName?: string;
  newRecipeCategory?: Category;
  cookedAt?: string;
  timeSlot: TimeSlot;
  cookTimeMinutes?: number;
  recipeMemo?: string;
  processMemo?: string;
  rating: number;
  diary?: string;
  ingredients: { name: string; quantity: string }[];
}

export const createCookingLog = (data: CreateCookingLogData) =>
  apiClient
    .post<ApiResponse<CookingLog>>('/api/logs', data)
    .then((res) => res.data.data);

export const uploadImages = (logId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return apiClient
    .post<ApiResponse<{ id: number; imageUrl: string }[]>>(
      `/api/logs/${logId}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    .then((res) => res.data.data);
};

export const deleteImage = (logId: number, imageId: number) =>
  apiClient
    .delete<ApiResponse<void>>(`/api/logs/${logId}/images/${imageId}`)
    .then((res) => res.data);
