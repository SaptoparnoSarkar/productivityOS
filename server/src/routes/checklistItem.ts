import type { FastifyInstance } from "fastify";
import { ValidationError } from "../utils/errors.js";
import {
  createChecklistSchema,
  updateChecklistSchema,
} from "../schemas/checklistItem.schema.js";
import {
  createChecklist,
  deleteChecklist,
  getChecklistItem,
  listChecklists,
  updateChecklist,
} from "../services/checklistItem.service.js";

export async function checklistItemRoutes(fastify: FastifyInstance) {
  //Create Checklist POST   /api/milestones/:milestoneId/checklist-items
  fastify.post<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId/checklist-items",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }

      const result = createChecklistSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }

      const checklist = await createChecklist(
        milestoneId,
        result.data.label,
        request.userId,
      );

      return reply.status(201).send({
        message: "Checklist Item Created Successfully",
        checklist,
      });
    },
  );

  //Get All Checklists GET    /api/milestones/:milestoneId/checklist-items
  fastify.get<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId/checklist-items",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }

      const checklistItems = await listChecklists(milestoneId, request.userId);

      return reply.status(200).send({
        checklistItems,
      });
    },
  );

  //GET one Checklist GET    /api/checklist-items/:itemId
  fastify.get<{ Params: { itemId: string } }>(
    "/api/checklist-items/:itemId",
    async (request, reply) => {
      const itemId = Number(request.params.itemId);
      //Guard
      if (isNaN(itemId)) {
        throw new ValidationError("Invalid Item ID");
      }

      const checklistItem = await getChecklistItem(itemId, request.userId);
      return reply.status(200).send({ checklistItem });
    },
  );

  //Update Checklist PATCH  /api/checklist-items/:itemId
  fastify.patch<{ Params: { itemId: string } }>(
    "/api/checklist-items/:itemId",
    async (request, reply) => {
      const itemId = Number(request.params.itemId);
      //Guard
      if (isNaN(itemId)) {
        throw new ValidationError("Invalid Item ID");
      }

      // First Aid for Zod
      const body =
        typeof request.body === "string"
          ? JSON.parse(request.body)
          : request.body;

      const result = updateChecklistSchema.safeParse(body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }
      const updated = await updateChecklist(
        itemId,
        request.userId,
        result.data,
      );
      return reply
        .status(200)
        .send({ message: "Checklist Updated Successfully", updated });
    },
  );

  //Delete Checklist DELETE /api/checklist-items/:itemId
  fastify.delete<{ Params: { itemId: string } }>(
    "/api/checklist-items/:itemId",
    async (request, reply) => {
      const itemId = Number(request.params.itemId);
      //Guard
      if (isNaN(itemId)) {
        throw new ValidationError("Invalid Item ID");
      }
      await deleteChecklist(itemId, request.userId);
      return reply
        .status(200)
        .send({ message: "Checklist Deleted Successfully" });
    },
  );
}
