import type { FastifyInstance } from "fastify";
import { ValidationError } from "../utils/errors.js";
import {
  createCounterSchema,
  incrementCounterSchema,
  updateCounterSchema,
} from "../schemas/counter.schema.js";
import {
  createCounter,
  getCounter,
  incrementCounter,
  resetCounter,
  updateCounter,
} from "../services/counter.service.js";

export async function counterRoutes(fastify: FastifyInstance) {
  //Create Counter POST   /api/milestones/:milestoneId/counter
  fastify.post<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId/counter",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone");
      }

      const result = createCounterSchema.safeParse(request.body);
      if (!result.success) {
        throw new ValidationError(result.error.message);
      }

      const counter = await createCounter(
        milestoneId,
        request.userId,
        result.data,
      );
      return reply
        .status(201)
        .send({ message: "Counter Created Successfully", counter });
    },
  );

  //Get Counter GET    /api/milestones/:milestoneId/counter
  fastify.get<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId/counter",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone");
      }
      const counter = await getCounter(milestoneId, request.userId);
      return reply
        .status(200)
        .send({ message: "Counter Fetched Successfully", counter });
    },
  );

  //Update Counter PATCH  /api/milestones/:milestoneId/counter
  fastify.patch<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId/counter",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      //Guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone");
      }

      const result = updateCounterSchema.safeParse(request.body);
      if (!result.success) {
        throw new ValidationError(result.error.message);
      }

      const counter = await updateCounter(
        milestoneId,
        request.userId,
        result.data,
      );
      return reply
        .status(200)
        .send({ message: "Counter Updated Successfully", counter });
    },
  );

  //Increment Counter POST /api/milestones/:milestoneId/counter/increment
  fastify.post<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId/counter/increment",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      //guard
      if (isNaN(milestoneId)) {
        throw new ValidationError("Invalid Milestone");
      }
      const result = incrementCounterSchema.safeParse(request.body);
      if (!result.success) {
        throw new ValidationError(result.error.message);
      }

      const increment = await incrementCounter(
        milestoneId,
        request.userId,
        result.data.delta,
      );
      return reply
        .status(200)
        .send({ message: "Counter Incremented Successfully", increment });
    },
  );

  //Reset Counter POST /api/milestones/:milestoneId/counter
  fastify.post<{ Params: { milestoneId: string } }>(
    "/api/milestones/:milestoneId/counter/reset",
    async (request, reply) => {
      const milestoneId = Number(request.params.milestoneId);
      if (isNaN(milestoneId)) throw new ValidationError("Invalid Milestone");

      const counter = await resetCounter(milestoneId, request.userId);
      return reply
        .status(200)
        .send({ message: "Counter Reset Successfully", counter });
    },
  );
}

//To do: Use throw everywhere for errors. Don't use reply.send directly
