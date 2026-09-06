import type { FastifyInstance } from "fastify/types/instance.js";
import {
  getShowcaseById,
  listShowcase,
  promoteSubject,
} from "../services/showcase.service.js";

export async function showcaseRoutes(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    `/api/subjects/:id/promote`,
    async (request, reply) => {
      const userId = request.userId;
      const subjectId = Number(request.params.id);
      if (isNaN(subjectId)) {
        return reply.status(400).send({ message: "Invalid Subject ID" });
      }

      const data = await promoteSubject(userId, subjectId);
      return reply
        .status(201)
        .send({ message: "Subject added to your achievement", data });
    },
  );

  fastify.get(`/api/showcases`, async (request, reply) => {
    const userId = request.userId;
    const data = await listShowcase(userId);
    return reply
      .status(200)
      .send({ message: "Showcases fetched successfully", data });
  });

  fastify.get<{ Params: { id: string } }>(
    `/api/showcases/:id`,
    async (request, reply) => {
      const userId = request.userId;
      const showcaseId = Number(request.params.id);
      if (isNaN(showcaseId))
        return reply.status(400).send({ message: "Invalid Showcase ID" });

      const data = await getShowcaseById(showcaseId, userId);
      return reply
        .status(200)
        .send({ message: "Showcase fetched successfully", data });
    },
  );
}
