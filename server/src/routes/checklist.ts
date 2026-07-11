import type { FastifyInstance } from "fastify";
import { ValidationError } from "../utils/errors.js";
import { getChecklistTarget, setChecklistTarget } from "../services/checklist.service.js";
import { createChecklistTargetSchema } from "../schemas/checklist.schema.js";


export async function checklistRoutes(fastify: FastifyInstance) {
    //Set Checklist Target POST   /api/milestones/:milestoneId/checklist
    fastify.post<{
        Params: { milestoneId: string }
    }>("/api/milestones/:milestoneId/checklist-target",
        async (request, reply) => {
            const milestoneId = Number(request.params.milestoneId);
            const userId = request.userId;
            // Guard
            if (isNaN(milestoneId)) {
                throw new ValidationError("Invalid Milestone ID");
            }

            const result = createChecklistTargetSchema.safeParse(request.body);
            if (!result.success) {
                throw new ValidationError(result.error.message);
            }

            const checklistTarget = await setChecklistTarget(milestoneId, userId, result.data);
            return reply.status(200).send({ message: 'Checklist Target Saved', checklistTarget })
        })

    // Get Checklist Target GET   /api/milestones/:milestoneId/checklist-target
    fastify.get<{
        Params: { milestoneId: string }
    }>("/api/milestones/:milestoneId/checklist-target",
        async (request, reply) => {
            const milestoneId = Number(request.params.milestoneId);
            const userId = request.userId;
            // Guard
            if (isNaN(milestoneId)) {
                throw new ValidationError("Invalid Milestone ID");
            }

            const checklistTarget = await getChecklistTarget(milestoneId, userId);
            return reply.status(200).send({ checklistTarget })
        }

    )
}
