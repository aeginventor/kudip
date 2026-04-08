'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as cookingLogService from '@/services/cookingLog';
import type { CreateCookingLogData, GetLogsParams, UpdateCookingLogData } from '@/services/cookingLog';

export function useCreateCookingLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCookingLogData) => cookingLogService.createCookingLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useCookingLogs(params?: GetLogsParams) {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: () => cookingLogService.getCookingLogs(params),
  });
}

export function useUpdateCookingLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCookingLogData }) =>
      cookingLogService.updateCookingLog(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['logs', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useDeleteCookingLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cookingLogService.deleteCookingLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
