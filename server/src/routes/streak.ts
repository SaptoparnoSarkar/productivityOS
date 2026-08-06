import type { FastifyInstance } from "fastify";
import {
  createStreakContract,
  getStreakCount,
  getTodayContractStatus,
  getWeeklyHistoricalProgress,
} from "../services/streak.service.js";

export async function streakRoutes(fastify: FastifyInstance) {
  // POST /api/streaks/streak-contract
  fastify.post("/api/streaks/streak-contract", async (request, reply) => {
    const userId = request.userId;

    const contract = await createStreakContract(userId);
    return reply
      .status(200)
      .send({ message: "Streak contract ready", contract });
  });

  //GET /api/streaks/streak_contract/today-status
  fastify.get(
    "/api/streaks/streak-contract/today-status",
    async (request, reply) => {
      const userId = request.userId;
      const status = await getTodayContractStatus(userId);
      return reply
        .status(200)
        .send({ message: "Today's contract status fetched", status });
    },
  );
  // Changed history/test -> week
  //GET /api/streak/week
  fastify.get("/api/streaks/week", async (request, reply) => {
    const history = await getWeeklyHistoricalProgress(request.userId);
    const streak = await getStreakCount(request.userId);
    return reply
      .status(200)
      .send({ message: "Historical progress fetched", history, streak });
  });
}
