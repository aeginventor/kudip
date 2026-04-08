'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as cookingLogService from '@/services/cookingLog';
import type { CreateCookingLogData } from '@/services/cookingLog';

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
