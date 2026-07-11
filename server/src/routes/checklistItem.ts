import type { FastifyInstance } from "fastify";
import { ValidationError } from "../utils/errors.js";
import {
  createChecklistItemsSchema,
  updateChecklistItemsSchema,
} from "../schemas/checklistItem.schema.js";
import {
  createChecklistItem,
  deleteChecklist,
  listChecklists,
  updateChecklistItem,
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

      const result = createChecklistItemsSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }

      const checklist = await createChecklistItem(
        milestoneId,
        result.data,
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


  //Update Checklist PATCH  /api/milestones/:milestoneId/checklist-items/:itemId
  fastify.patch<{ Params: { milestoneId: string, itemId: string } }>(
    "/api/milestones/:milestoneId/checklist-items/:itemId",
    async (request, reply) => {
      const itemId = Number(request.params.itemId);
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(itemId)) {
        throw new ValidationError("Invalid Item ID");
      }
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }

      // First Aid for Zod
      const body =
        typeof request.body === "string"
          ? JSON.parse(request.body)
          : request.body;

      const result = updateChecklistItemsSchema.safeParse(body);

      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }

      const updated = await updateChecklistItem(
        itemId,
        request.userId,
        milestoneId,
        result.data,
      )

      return reply
        .status(200)
        .send({ message: "Checklist Updated Successfully", updated });
    },
  );

  //Delete Checklist DELETE /api/milestones/:milestoneId/checklist-items/:itemId
  fastify.delete<{ Params: { milestoneId: string, itemId: string } }>(
    "/api/milestones/:milestoneId/checklist-items/:itemId",
    async (request, reply) => {
      const itemId = Number(request.params.itemId);
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(itemId)) {
        throw new ValidationError("Invalid Item ID");
      }
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone ID");
      }
      await deleteChecklist(itemId, request.userId, milestoneId);
      return reply
        .status(200)
        .send({ message: "Checklist Deleted Successfully" });
    },
  );
}
