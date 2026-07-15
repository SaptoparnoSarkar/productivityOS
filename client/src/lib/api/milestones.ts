//unwrapper of envelope

import { apiClient } from "../apiClient";
import {
  CreateMilestoneInput,
  Milestone,
  MilestoneWithSubject,
  UpdateMilestoneInput,
} from "@/types/milestone";

export async function listMilestones(subjectId: number): Promise<Milestone[]> {
  const response = await apiClient<{ milestones: Milestone[] }>(
    `/api/subjects/${subjectId}/milestones`,
    { method: "GET" },
  );
  return response.milestones;
}

export async function getMilestone(milestoneId: number): Promise<Milestone> {
  const response = await apiClient<{ milestone: Milestone }>(
    `/api/milestones/${milestoneId}`,
    { method: "GET" },
  );
  return response.milestone;
}

export async function createMilestone(
  subjectId: number,
  input: CreateMilestoneInput,
): Promise<Milestone> {
  const response = await apiClient<{ message: string; milestone: Milestone }>(
    `/api/subjects/${subjectId}/milestones`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return response.milestone;
}

export async function updateMilestone(
  subjectId: number,
  milestoneId: number,
  input: UpdateMilestoneInput,
): Promise<Milestone> {
  const response = await apiClient<{ message: string; milestone: Milestone }>(
    `/api/subjects/${subjectId}/milestones/${milestoneId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return response.milestone;
}

export async function deleteMilestone(
  subjectId: number,
  milestoneId: number,
): Promise<void> {
  await apiClient<{ message: string }>(
    `/api/subjects/${subjectId}/milestones/${milestoneId}`,
    {
      method: "DELETE",
    },
  );
}

export async function listRecentMilestones(limit = 5): Promise<Milestone[]> {
  const response = await apiClient<{ milestones: Milestone[] }>(
    `/api/milestones/recent?limit=${limit}`,
  );
  return response.milestones;
}

export async function setMilestoneActive(
  milestoneId: number,
  isActive: boolean,
): Promise<Milestone> {
  const response = await apiClient<{ message: string; milestone: Milestone }>(
    `/api/milestones/${milestoneId}/active`,
    {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    },
  );
  return response.milestone;
}

export async function getAllMilestones(): Promise<MilestoneWithSubject[]> {
  const response = await apiClient<{
    message: string;
    milestones: MilestoneWithSubject[];
  }>(`/api/milestones/all`);
  return response.milestones;
}
