import {
  CreateWeaknessInput,
  CreateWeaknessNoteInput,
  UpdateWeaknessInput,
} from "@/schemas/weakness.schema";
import { Weakness, WeaknessNote } from "@/types/weakness";
import { apiClient } from "../apiClient";

type Envelope<T> = { message: string; data: T };

export async function createWeakness(
  input: CreateWeaknessInput,
): Promise<Weakness> {
  const response = await apiClient<Envelope<Weakness>>(`/api/weakness`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function listWeaknesses(
  status?: "active" | "resolved",
  limit?: number,
): Promise<Weakness[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (limit !== undefined) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await apiClient<Envelope<Weakness[]>>(
    `/api/weakness${query}`,
  );
  return response.data;
}

export async function getWeaknessById(id: number): Promise<Weakness> {
  const response = await apiClient<Envelope<Weakness>>(`/api/weakness/${id}`);
  return response.data;
}

export async function updateWeakness(
  id: number,
  input: UpdateWeaknessInput,
): Promise<Weakness> {
  const response = await apiClient<Envelope<Weakness>>(`/api/weakness/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteWeakness(id: number): Promise<{ message: string }> {
  const response = await apiClient<{ message: string }>(`/api/weakness/${id}`, {
    method: "DELETE",
  });
  return response;
}

export async function createWeaknessNote(
  weaknessId: number,
  input: CreateWeaknessNoteInput,
): Promise<WeaknessNote> {
  const response = await apiClient<Envelope<WeaknessNote>>(
    `/api/weakness/${weaknessId}/notes`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function listWeaknessNotes(
  weaknessId: number,
): Promise<WeaknessNote> {
  const response = await apiClient<Envelope<WeaknessNote>>(
    `/api/weakness/${weaknessId}/notes`,
  );
  return response.data;
}
