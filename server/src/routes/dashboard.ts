import type { FastifyInstance } from "fastify/types/instance.js";
import { getDashboardMetrics } from "../services/dashboard.service.js";

export function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/api/dashboard/stats", async (request, reply) => {
    const userId = request.userId;
    const result = await getDashboardMetrics(userId);
    return reply
      .status(200)
      .send({ message: "Fetched Dashboard Metrics", metrics: result });
  });
}
