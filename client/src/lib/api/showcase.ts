import { Showcase } from "@/types/showcase";
import { apiClient } from "../apiClient";

type Envelope<T> = { message: string; data: T };

export async function promoteSubject(id: number): Promise<Showcase> {
  const response = await apiClient<Envelope<Showcase>>(
    `/api/subject/${id}/promote`,
    {
      method: "POST",
    },
  );
  return response.data;
}

export async function listShowcase(): Promise<Showcase[]> {
  const response = await apiClient<Envelope<Showcase[]>>(`/api/showcases`);
  return response.data;
}

export async function getShowcaseById(id: number): Promise<Showcase> {
  const response = await apiClient<Envelope<Showcase>>(`/api/showcases/${id}`);
  return response.data;
}
