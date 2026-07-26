import type { FastifyInstance } from "fastify";
import {
  createWeeklyContract,
  getTodayContractStatus,
} from "../services/weeklyStreak.service.js";
import { request } from "http";

export async function weeklyStreakRoutes(fastify: FastifyInstance) {
  // POST /api/streaks/weekly-contract
  fastify.post("/api/streaks/weekly-contract", async (request, reply) => {
    const userId = request.userId;

    const contract = await createWeeklyContract(userId);
    return reply
      .status(200)
      .send({ message: "Weekly streak contract ready", contract });
  });

  //GET /api/streaks/weekly_contract/today-status
  fastify.get(
    "/api/streaks/weekly-contract/today-status",
    async (request, reply) => {
      const userId = request.userId;
      const status = await getTodayContractStatus(userId);
      return reply
        .status(200)
        .send({ message: "Today's contract status fetched", status });
    },
  );
}
