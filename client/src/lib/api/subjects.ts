import { apiClient } from "../apiClient";
import {
  CreateSubjectInput,
  Subject,
  UpdateSubjectInput,
} from "@/types/subject";

//I call this file the unwrapper of envelope sent by the server which is fetched by the apiClient.

// GET /api/subjects -> { subjects: Subject[] }
export async function listSubjects(): Promise<Subject[]> {
  const response = await apiClient<{ subjects: Subject[] }>("/api/subjects");
  return response.subjects;
}

//GET /api/subjects/:id { subject: Subject }
export async function getSubject(id: number): Promise<Subject> {
  const response = await apiClient<{ subject: Subject }>(`/api/subjects/${id}`);
  return response.subject;
}

// POST /api/subjects { message, subject: Subject }
export async function createSubject(
  input: CreateSubjectInput,
): Promise<Subject> {
  const response = await apiClient<{ message: string; subject: Subject }>(
    "/api/subjects",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return response.subject;
}

//PATCH /api/subjects/:id -> { message, subject: Subject }
export async function updateSubject(
  id: number,
  input: UpdateSubjectInput,
): Promise<Subject> {
  const response = await apiClient<{ message: string; subject: Subject }>(
    `/api/subjects/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return response.subject;
}

//DELETE /api/subjects/:id -> {message}
export async function deleteSubject(id: number): Promise<void> {
  await apiClient<{ message: string }>(`/api/subjects/${id}`, {
    method: "DELETE",
  });
}

//Upcoming Subjects GET /api/subjects/upcoming -> { subjects: Subject[] }
export async function listUpcomingSubjects(limit = 5): Promise<Subject[]> {
  const response = await apiClient<{ subjects: Subject[] }>(`/api/subjects/upcoming?limit=${limit}`)
  return response.subjects;
}

//PATCH Mark subject complete
export async function markSubjectComplete(id: number): Promise<Subject> {
  const response = await apiClient<{ message: string, subject: Subject }>(`/api/subjects/${id}/complete`, {
    method: "PATCH",
  })
  return response.subject
}

