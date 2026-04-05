import apiClient from '@/lib/axios';
import { ApiResponse, DashboardData } from '@/types';

export const getDashboard = () =>
  apiClient
    .get<ApiResponse<DashboardData>>('/api/dashboard')
    .then((res) => res.data.data);
