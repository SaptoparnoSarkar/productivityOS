import type { FastifyInstance } from "fastify/types/instance.js";
import {
  createWeaknessNoteSchema,
  createWeaknessSchema,
  updateWeaknessSchema,
  weaknessQuerySchema,
  type weaknessQueryType,
} from "../schemas/weakness.schema.js";
import {
  addWeaknessNote,
  createWeakness,
  deleteWeakness,
  deleteWeaknessNotes,
  getWeaknessById,
  getWeaknesses,
  getWeaknessNotes,
  updateWeakness,
} from "../services/weakness.service.js";
import { NotFoundError } from "../utils/errors.js";

export async function weaknessRoutes(fastify: FastifyInstance) {
  // Create Weakness
  fastify.post(`/api/weakness`, async (request, reply) => {
    const userId = request.userId;
    const result = createWeaknessSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.message });
    }

    const data = await createWeakness(userId, result.data);
    return reply
      .status(201)
      .send({ message: "Weakness Created Successfully", data });
  });

  // List Weaknesses

  fastify.get<{ Querystring: weaknessQueryType }>(
    `/api/weakness`,
    async (request, reply) => {
      const userId = request.userId;
      const result = weaknessQuerySchema.safeParse(request.query);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }
      const data = await getWeaknesses(
        userId,
        result.data.status,
        result.data.limit,
      );
      return reply.send({
        message: "Weaknesses Fetched Successfully",
        data,
      });
    },
  );

  //Get one weakness
  fastify.get<{ Params: { weaknessId: string } }>(
    `/api/weakness/:weaknessId`,
    async (request, reply) => {
      const userId = request.userId;
      const weaknessId = Number(request.params.weaknessId);
      if (isNaN(weaknessId)) {
        return reply.status(400).send({ message: "Invalid Weakness ID" });
      }

      const data = await getWeaknessById(weaknessId, userId);
      return reply.send({ message: "Weakness Fetched Successfully", data });
    },
  );

  // Update
  fastify.patch<{ Params: { weaknessId: string } }>(
    `/api/weakness/:weaknessId`,
    async (request, reply) => {
      const userId = request.userId;
      const weaknessId = Number(request.params.weaknessId);
      if (isNaN(weaknessId)) {
        return reply.status(400).send({ message: "Invalid Weakness ID" });
      }
      const result = updateWeaknessSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }

      const data = await updateWeakness(weaknessId, userId, result.data);
      return reply
        .status(200)
        .send({ message: "Weakness Updated Successfully", data });
    },
  );

  // Delete Weakness
  fastify.delete<{ Params: { weaknessId: string } }>(
    `/api/weakness/:weaknessId`,
    async (request, reply) => {
      const userId = request.userId;
      const weaknessId = Number(request.params.weaknessId);
      if (isNaN(weaknessId)) {
        return reply.status(400).send({ message: "Invalid Weakness ID" });
      }
      const data = await deleteWeakness(weaknessId, userId);
      return reply
        .status(200)
        .send({ message: "Weakness Deleted Successfully", data });
    },
  );

  // Add Note
  fastify.post<{ Params: { weaknessId: string } }>(
    `/api/weakness/:weaknessId/notes`,
    async (request, reply) => {
      const userId = request.userId;
      const weaknessId = Number(request.params.weaknessId);
      if (isNaN(weaknessId)) {
        return reply.status(400).send({ message: "Invalid Weakness ID" });
      }
      const result = createWeaknessNoteSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }
      const data = await addWeaknessNote(weaknessId, userId, result.data);
      return reply.status(201).send({
        message: "Note Added Successfully",
        data,
      });
    },
  );

  // List notes
  fastify.get<{ Params: { weaknessId: string } }>(
    `/api/weakness/:weaknessId/notes`,
    async (request, reply) => {
      const userId = request.userId;
      const weaknessId = Number(request.params.weaknessId);
      if (isNaN(weaknessId)) {
        return reply.status(400).send({ message: "Invalid Weakness ID" });
      }
      const data = await getWeaknessNotes(weaknessId, userId);
      return reply.send({
        message: "Notes Fetched Successfully",
        data,
      });
    },
  );

  // Delete Notes
  fastify.delete<{ Params: { weaknessId: string } }>(
    `/api/weakness/:weaknessId/notes`,
    async (request, reply) => {
      const userId = request.userId;
      const weaknessId = Number(request.params.weaknessId);
      if (isNaN(weaknessId)) {
        return reply.status(400).send({ message: "Invalid Weakness ID" });
      }
      const data = await deleteWeaknessNotes(weaknessId, userId);
      if (!data) {
        throw new NotFoundError("Note Not Found");
      }
      return reply
        .status(200)
        .send({ message: "Note Deleted Successfully", data });
    },
  );
}
