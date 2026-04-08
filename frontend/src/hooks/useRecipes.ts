'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as recipeService from '@/services/recipe';
import type { CreateRecipeData, UpdateRecipeData } from '@/services/recipe';

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: recipeService.getRecipes,
  });
}

export function useRecipeStats(id: number) {
  return useQuery({
    queryKey: ['recipes', id, 'stats'],
    queryFn: () => recipeService.getRecipeStats(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecipeData) => recipeService.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRecipeData }) =>
      recipeService.updateRecipe(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes', id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => recipeService.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
