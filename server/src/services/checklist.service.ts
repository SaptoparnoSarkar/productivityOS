import { dbGetChecklistTarget, dbSetChecklistTarget } from "../db/queries/checklist.queries.js";
import type { CreateChecklistTargetInput } from "../schemas/checklist.schema.js";
import { NotFoundError } from "../utils/errors.js";


export async function setChecklistTarget(
    milestoneId: number,
    userId: number,
    input: CreateChecklistTargetInput,
) {
    const result = await dbSetChecklistTarget(milestoneId, userId, input.target_count,);
    if (!result) {
        throw new NotFoundError("Milestone not found")
    }
    return result;
}

export async function getChecklistTarget(
    milestoneId: number,
    userId: number
) {
    const result = await dbGetChecklistTarget(milestoneId, userId);
    if (!result) {
        throw new NotFoundError("Milestone not found")
    }
    return result;
}