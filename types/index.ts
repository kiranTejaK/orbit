// types/index.ts
// Shared TypeScript types

export interface Resource {
  id: string;
  title: string;
  resourceType: string;
  url: string;
  description?: string | null;
  personalNotes?: string | null;
  category?: string | null;
  tags: string[];
  source?: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  source?: string | null;
  jobUrl?: string | null;
  appliedDate: string;
  status: string;
  salary?: string | null;
  location?: string | null;
  description?: string | null;
  hrName?: string | null;
  hrContact?: string | null;
  followUpDate?: string | null;
  resumeVersion?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface DashboardStats {
  resources: {
    total: number;
    favorites: number;
    recentCount: number;
  };
  jobs: {
    total: number;
    active: number;
    interviewing: number;
    offers: number;
    rejected: number;
  };
}

export type SortOption = "newest" | "oldest" | "alpha" | "applied_desc" | "applied_asc";
