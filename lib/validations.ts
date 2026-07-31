// lib/validations.ts
// Zod schemas for form validation and API request bodies

import { z } from "zod";
import { RESOURCE_TYPES, JOB_STATUSES } from "./constants";

// ──────────────────────────────────────────
// Resource schemas
// ──────────────────────────────────────────

export const createResourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  resourceType: z.enum(RESOURCE_TYPES, { errorMap: () => ({ message: "Select a valid resource type" }) }),
  url: z.string().url("Must be a valid URL"),
  description: z.string().max(1000, "Description too long").optional().or(z.literal("")),
  personalNotes: z.string().max(2000, "Notes too long").optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  tags: z.string().optional(), // comma-separated string from form
  source: z.string().optional().or(z.literal("")),
  favorite: z.boolean().optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

// API-level schema that accepts tags as an array
export const resourceApiSchema = z.object({
  title: z.string().min(1).max(200),
  resourceType: z.enum(RESOURCE_TYPES),
  url: z.string().url(),
  description: z.string().max(1000).optional(),
  personalNotes: z.string().max(2000).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  source: z.string().optional(),
  favorite: z.boolean().optional().default(false),
});

export const updateResourceApiSchema = resourceApiSchema.partial();

// ──────────────────────────────────────────
// Job Application schemas
// ──────────────────────────────────────────

export const createJobSchema = z.object({
  company: z.string().min(1, "Company name is required").max(200, "Company name too long"),
  position: z.string().min(1, "Position is required").max(200, "Position too long"),
  source: z.string().optional().or(z.literal("")),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  appliedDate: z.string().min(1, "Applied date is required"),
  status: z.enum(JOB_STATUSES),
  salary: z.string().optional().or(z.literal("")),
  hrName: z.string().optional().or(z.literal("")),
  hrContact: z.string().optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
  resumeVersion: z.string().optional().or(z.literal("")),
  notes: z.string().max(2000, "Notes too long").optional().or(z.literal("")),
});

export const updateJobSchema = createJobSchema.partial();

// API-level schemas with proper date types
export const jobApiSchema = z.object({
  company: z.string().min(1).max(200),
  position: z.string().min(1).max(200),
  source: z.string().optional(),
  jobUrl: z.string().url().optional().or(z.literal("")),
  appliedDate: z.string().min(1),
  status: z.enum(JOB_STATUSES).default("Applied"),
  salary: z.string().optional(),
  hrName: z.string().optional(),
  hrContact: z.string().optional(),
  followUpDate: z.string().optional(),
  resumeVersion: z.string().optional(),
  notes: z.string().optional(),
});

export const updateJobApiSchema = jobApiSchema.partial();

// ──────────────────────────────────────────
// Helper: Parse tags string -> string[]
// ──────────────────────────────────────────
export function parseTags(tagsString?: string): string[] {
  if (!tagsString) return [];
  return tagsString
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
