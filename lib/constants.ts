// lib/constants.ts
// All application-wide constants

export const RESOURCE_TYPES = [
  "GitHub Repository",
  "Documentation",
  "Article / Blog",
  "Video / Screencast",
  "Interactive Course",
  "Book / E-Book",
  "Cheat Sheet / Reference",
  "Developer Tool",
  "Library / Framework",
  "Research Paper / Spec",
  "Podcast / Audio",
  "Community / Forum",
  "Newsletter",
  "Template / Starter",
  "Other",
  // Legacy types support
  "Open Source Project",
  "AI Tool",
  "Productivity Tool",
  "Website",
  "Blog",
  "YouTube Video",
  "Course",
  "Cheat Sheet",
  "Article",
  "System Design Resource",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const PRIMARY_RESOURCE_TYPES = [
  "GitHub Repository",
  "Documentation",
  "Article / Blog",
  "Video / Screencast",
  "Interactive Course",
  "Book / E-Book",
  "Cheat Sheet / Reference",
  "Developer Tool",
  "Library / Framework",
  "Research Paper / Spec",
  "Podcast / Audio",
  "Community / Forum",
  "Newsletter",
  "Template / Starter",
  "Other",
] as const;

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
  "Frontend Development",
  "Backend Development",
  "Fullstack Development",
  "DevOps & Cloud",
  "AI & Machine Learning",
  "Databases & Storage",
  "Security & Cryptography",
  "System Design & Architecture",
  "Mobile Development",
  "Data Engineering & Analytics",
  "UI/UX & Design Systems",
  "Testing & Quality Assurance",
  "Career & Interview Prep",
  "Developer Productivity",
  "Open Source & Licensing",
  "Computer Science Fundamentals",
  "Web3 & Blockchain",
  "Game Development",
  "Other",
  // Legacy categories support
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
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const PRIMARY_RESOURCE_CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Fullstack Development",
  "DevOps & Cloud",
  "AI & Machine Learning",
  "Databases & Storage",
  "Security & Cryptography",
  "System Design & Architecture",
  "Mobile Development",
  "Data Engineering & Analytics",
  "UI/UX & Design Systems",
  "Testing & Quality Assurance",
  "Career & Interview Prep",
  "Developer Productivity",
  "Open Source & Licensing",
  "Computer Science Fundamentals",
  "Web3 & Blockchain",
  "Game Development",
  "Other",
] as const;

export const RESOURCE_CLASSIFICATION_GUIDE = {
  format: {
    title: "Format",
    description: "How this resource is delivered or consumed.",
    examples: ["Documentation", "GitHub Repository", "Video / Screencast", "Developer Tool", "Cheat Sheet / Reference"],
  },
  topic: {
    title: "Topic",
    description: "What this resource is about.",
    examples: ["Frontend Development", "Backend Development", "AI & Machine Learning", "System Design & Architecture"],
  },
};

export const RESOURCE_TYPES_COLORS: Record<string, string> = {
  "GitHub Repository": "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  "Documentation": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "Article / Blog": "bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200",
  "Video / Screencast": "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200",
  "Interactive Course": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200",
  "Book / E-Book": "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  "Cheat Sheet / Reference": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200",
  "Developer Tool": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  "Library / Framework": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
  "Research Paper / Spec": "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  "Podcast / Audio": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-200",
  "Community / Forum": "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
  "Newsletter": "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
  "Template / Starter": "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200",
  "Other": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",

  // Legacy fallbacks
  "Open Source Project": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "AI Tool": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Productivity Tool": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Website": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "Blog": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "YouTube Video": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Course": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "Cheat Sheet": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Article": "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  "System Design Resource": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
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

export const TODO_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TodoPriority = (typeof TODO_PRIORITIES)[number];

export const TODO_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
export type TodoStatus = (typeof TODO_STATUSES)[number];

export const TODO_PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  LOW: {
    bg: "rgba(148, 163, 184, 0.1)",
    text: "#94a3b8",
    border: "rgba(148, 163, 184, 0.2)",
    dot: "#94a3b8",
  },
  MEDIUM: {
    bg: "rgba(99, 102, 241, 0.1)",
    text: "#818cf8",
    border: "rgba(99, 102, 241, 0.2)",
    dot: "#6366f1",
  },
  HIGH: {
    bg: "rgba(245, 158, 11, 0.1)",
    text: "#fbbf24",
    border: "rgba(245, 158, 11, 0.2)",
    dot: "#f59e0b",
  },
  URGENT: {
    bg: "rgba(239, 68, 68, 0.12)",
    text: "#f87171",
    border: "rgba(239, 68, 68, 0.3)",
    dot: "#ef4444",
  },
};

export const TODO_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: {
    bg: "rgba(148, 163, 184, 0.1)",
    text: "#94a3b8",
    border: "rgba(148, 163, 184, 0.2)",
  },
  IN_PROGRESS: {
    bg: "rgba(14, 165, 233, 0.12)",
    text: "#38bdf8",
    border: "rgba(14, 165, 233, 0.3)",
  },
  COMPLETED: {
    bg: "rgba(16, 185, 129, 0.12)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.3)",
  },
};

