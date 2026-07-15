import type { FastifyInstance } from "fastify";
import {
  createMilestone,
  deleteMilestone,
  getAllMilestones,
  getMilestone,
  listMilestones,
  recentMilestones,
  setMilestoneActive,
  updateMilestone,
} from "../services/milestone.service.js";
import { ValidationError } from "../utils/errors.js";
import {
  createMilestoneSchema,
  setActiveSchema,
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

  //Get a single Milestone by milestoneId   GET/api/milestones/:milestoneId
  fastify.get<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }

      const milestone = await getMilestone(milestoneId, request.userId);
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

  //Recent Milestones GET /api/milestones/recent
  fastify.get("/api/milestones/recent", async (request, reply) => {
    const milestones = await recentMilestones(request.userId);
    return reply.status(200).send({ milestones });
  });

  // isActive Milestone PATCH /api/milestones/:milestoneId/active
  fastify.patch<{ Params: { milestoneId: string } }>(
    `/api/milestones/:milestoneId/active`,
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      const userId = request.userId;
      // Guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }
      // Parse
      const result = setActiveSchema.safeParse(request.body);
      if (!result.success) {
        throw new ValidationError(result.error.message);
      }

      const milestone = await setMilestoneActive(
        milestoneId,
        userId,
        result.data.isActive,
      );
      return reply
        .status(200)
        .send({ message: "Milestone active state updated", milestone });
    },
  );

  // Get all Milestones GET /api/milestones/all
  fastify.get(`/api/milestones/all`, async (request, reply) => {
    const userId = request.userId;
    const milestones = await getAllMilestones(userId);
    return reply
      .status(200)
      .send({ message: "fetched all milestones", milestones });
  });
}

// FIXME: drop subjectId from the path if the milestone lookup already traces ownership without it
