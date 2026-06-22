import type { FastifyInstance } from "fastify";
import {
  createMilestone,
  deleteMilestone,
  getMilestone,
  listMilestones,
  recentMilestones,
  updateMilestone,
} from "../services/milestone.service.js";
import { ValidationError } from "../utils/errors.js";
import {
  createMilestoneSchema,
  updateMilestoneSchema,
} from "../schemas/milestone.schema.js";

export async function milestoneRoutes(fastify: FastifyInstance) {
  //Create Milestones    POST/api/subjects/:subjectId/milestones
  fastify.post<{ Params: { subjectId: string } }>(
    "/api/subjects/:subjectId/milestones",
    async (request, reply) => {
      const subjectId = Number(request.params.subjectId);
      //Guard
      if (isNaN(subjectId)) {
        throw new ValidationError("Invalid Subject ID");
      }

      const result = createMilestoneSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }

      const milestone = await createMilestone(
        subjectId,
        request.userId,
        result.data,
      );
      return reply
        .status(201)
        .send({ message: "Milestone Created Successfully", milestone });
    },
  );

  //Get all milestones   GET/api/subjects/:subjectId/milestones
  fastify.get<{ Params: { subjectId: string } }>(
    "/api/subjects/:subjectId/milestones",
    async (request, reply) => {
      const subjectId = Number(request.params.subjectId);
      //Guard
      if (isNaN(subjectId)) {
        throw new ValidationError("Invalid Subject ID");
      }

      const milestones = await listMilestones(subjectId, request.userId);
      return reply.status(200).send({ milestones });
    },
  );

  //Get a single Milestone   GET/api/subjects/:subjectId/milestones/:milestoneId
  fastify.get<{ Params: { subjectId: string; milestoneId: string } }>(
    "/api/subjects/:subjectId/milestones/:milestoneId",
    async (request, reply) => {
      const subjectId = Number(request.params.subjectId);
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(subjectId)) {
        throw new ValidationError("Invalid Subject ID");
      }
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }

      const milestone = await getMilestone(
        milestoneId,
        subjectId,
        request.userId,
      );
      return reply.status(200).send({ milestone });
    },
  );

  //Update Milestone    PATCH  /api/subjects/:subjectId/milestones/:milestoneId
  fastify.patch<{ Params: { subjectId: string; milestoneId: string } }>(
    "/api/subjects/:subjectId/milestones/:milestoneId",
    async (request, reply) => {
      const subjectId = Number(request.params.subjectId);
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(subjectId)) {
        throw new ValidationError("Invalid Subject ID");
      }
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }

      const result = updateMilestoneSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }

      const updated = await updateMilestone(
        milestoneId,
        subjectId,
        request.userId,
        result.data,
      );
      return reply
        .status(200)
        .send({ message: "Updated Successfully", milestone: updated });
    },
  );

  //DELETE   /api/subjects/:subjectId/milestones/:milestoneId
  fastify.delete<{ Params: { subjectId: string; milestoneId: string } }>(
    "/api/subjects/:subjectId/milestones/:milestoneId",
    async (request, reply) => {
      const subjectId = Number(request.params.subjectId);
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(subjectId)) {
        throw new ValidationError("Invalid Subject ID");
      }
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }
      await deleteMilestone(milestoneId, subjectId, request.userId);

      return reply.status(200).send({ message: "Deleted Successfully" });
    },

  );

  //Recent Milestones GET /api/subjects/:subjectId/milestones/recent
  fastify.get<{ Params: { subjectId: string } }>('/api/subjects/:subjectId/milestones/recent', async (request, reply) => {
    const subjectId = Number(request.params.subjectId)
    if (isNaN(subjectId)) {
      throw new ValidationError("Invalid Subject ID")
    }

    const milestones = await recentMilestones(request.userId, subjectId)
    return reply.status(200).send({ milestones })
  })
}
