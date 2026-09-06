import type { FastifyInstance } from "fastify/types/instance.js";
import {
  completeSession,
  getActiveSession,
  getSubjectHours,
  pauseSession,
  resumeSession,
  startSession,
} from "../services/pomodoro.service.js";
import { startSessionSchema } from "../schemas/pomodoro.schema.js";

export async function pomodoroRoutes(fastify: FastifyInstance) {
  // active session
  fastify.get("/api/pomodoro/active", async (request, reply) => {
    const userId = request.userId;
    const data = await getActiveSession(userId);
    return reply
      .status(200)
      .send({ message: "active session fetched successfully", data });
  });
  //start session
  fastify.post("/api/pomodoro/start", async (request, reply) => {
    const userId = request.userId;
    const result = startSessionSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.message });
    }
    const data = await startSession(userId, result.data);
    return reply
      .status(201)
      .send({ message: "Pomodoro Session Started", data });
  });
  //complete session
  fastify.post("/api/pomodoro/complete", async (request, reply) => {
    const userId = request.userId;
    const data = await completeSession(userId);
    return reply.status(200).send({ message: "completed", data });
  });
  //pause session
  fastify.post("/api/pomodoro/pause", async (request, reply) => {
    const userId = request.userId;
    const data = await pauseSession(userId);
    return reply.status(200).send({ message: "paused", data });
  });
  //resume session
  fastify.post("/api/pomodoro/resume", async (request, reply) => {
    const userId = request.userId;
    const data = await resumeSession(userId);
    return reply.status(200).send({ message: "resumed", data });
  });
  //actual subject hours
  fastify.get("/api/pomodoro/subject-hours", async (request, reply) => {
    const userId = request.userId;
    const data = await getSubjectHours(userId);
    return reply
      .status(200)
      .send({ message: "subject hours fetched successfully", data });
  });
}
