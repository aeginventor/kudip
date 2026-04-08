export type Category = 'KOREAN' | 'WESTERN' | 'JAPANESE' | 'CHINESE' | 'OTHER';
export type TimeSlot = 'MORNING' | 'LUNCH' | 'DINNER' | 'NONE';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
}

export interface Recipe {
  id: number;
  name: string;
  category: Category;
  totalCookCount: number;
  averageRating: number;
  lastCookedAt: string | null;
  createdAt: string;
}

export interface PagedData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface CookingLog {
  id: number;
  recipeId: number;
  recipeName: string;
  category?: Category;
  cookedAt: string | null;
  timeSlot: TimeSlot;
  cookTimeMinutes: number | null;
  recipeMemo: string | null;
  processMemo: string | null;
  rating: number;
  diary: string | null;
  ingredients: { name: string; quantity: string }[];
  images: { id: number; imageUrl: string }[];
}

export interface RecipeStats {
  recipeName: string;
  totalCount: number;
  averageRating: number;
  bestLog: CookingLog;
  recentLogs: CookingLog[];
  ingredientStats: {
    ingredientName: string;
    useCount: number;
    averageRating: number;
  }[];
  timeSlotStats: {
    timeSlot: TimeSlot;
    count: number;
    averageRating: number;
  }[];
}

export interface DashboardData {
  totalCookCount: number;
  totalRecipeCount: number;
  averageRating: number;
  topRecipes: { recipeName: string; count: number; averageRating: number }[];
  recentLogs: CookingLog[];
  categoryStats: { category: Category; count: number }[];
  calendarData: { date: string; count: number }[];
}
