// lib/constants.ts
// All application-wide constants

export const RESOURCE_TYPES = [
  "GitHub Repository",
  "Open Source Project",
  "AI Tool",
  "Productivity Tool",
  "Website",
  "Documentation",
  "Blog",
  "YouTube Video",
  "Course",
  "Cheat Sheet",
  "Article",
  "System Design Resource",
  "Other",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const JOB_STATUSES = [
  "Applied",
  "Resume Shortlisted",
  "Online Assessment",
  "HR Round",
  "Technical Round 1",
  "Technical Round 2",
  "Technical Round 3",
  "Manager Round",
  "Assignment",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const RESOURCE_SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Alphabetical", value: "alpha" },
] as const;

export const JOB_SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Applied Date (Recent)", value: "applied_desc" },
  { label: "Applied Date (Old)", value: "applied_asc" },
] as const;

export const RESOURCE_CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI/ML",
  "Databases",
  "Security",
  "System Design",
  "Career",
  "Productivity",
  "Open Source",
  "Learning",
  "Tools",
  "Other",
] as const;

export const RESOURCE_TYPES_COLORS: Record<string, string> = {
  "GitHub Repository": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  "Open Source Project": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "AI Tool": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Productivity Tool": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Website": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "Documentation": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Blog": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "YouTube Video": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Course": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "Cheat Sheet": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Article": "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  "System Design Resource": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  "Other": "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
};

export const JOB_STATUS_COLORS: Record<string, string> = {
  "Applied": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Resume Shortlisted": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "Online Assessment": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "HR Round": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Technical Round 1": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "Technical Round 2": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  "Technical Round 3": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
  "Manager Round": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "Assignment": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Offer": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "Rejected": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Withdrawn": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export const ACTIVE_JOB_STATUSES: JobStatus[] = [
  "Applied",
  "Resume Shortlisted",
  "Online Assessment",
  "HR Round",
  "Technical Round 1",
  "Technical Round 2",
  "Technical Round 3",
  "Manager Round",
  "Assignment",
];

export const INTERVIEWING_STATUSES: JobStatus[] = [
  "HR Round",
  "Technical Round 1",
  "Technical Round 2",
  "Technical Round 3",
  "Manager Round",
];

export const RESOURCES_PAGE_SIZE = 12;
export const JOBS_PAGE_SIZE = 10;
