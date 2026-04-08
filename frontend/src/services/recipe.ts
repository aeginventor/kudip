import apiClient from '@/lib/axios';
import { ApiResponse, Category, Recipe, RecipeStats } from '@/types';

export interface CreateRecipeData {
  name: string;
  category: Category;
}

export interface UpdateRecipeData {
  name?: string;
  category?: Category;
}

export const getRecipes = () =>
  apiClient
    .get<ApiResponse<Recipe[]>>('/api/recipes')
    .then((res) => res.data.data);

export const getRecipe = (id: number) =>
  apiClient
    .get<ApiResponse<Recipe>>(`/api/recipes/${id}`)
    .then((res) => res.data.data);

export const getRecipeStats = (id: number) =>
  apiClient
    .get<ApiResponse<RecipeStats>>(`/api/recipes/${id}/stats`)
    .then((res) => res.data.data);

export const createRecipe = (data: CreateRecipeData) =>
  apiClient
    .post<ApiResponse<Recipe>>('/api/recipes', data)
    .then((res) => res.data.data);

export const updateRecipe = (id: number, data: UpdateRecipeData) =>
  apiClient
    .put<ApiResponse<Recipe>>(`/api/recipes/${id}`, data)
    .then((res) => res.data.data);

export const deleteRecipe = (id: number) =>
  apiClient
    .delete<ApiResponse<void>>(`/api/recipes/${id}`)
    .then((res) => res.data);
