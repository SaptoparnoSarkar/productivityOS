import type { FastifyInstance } from "fastify";
import { getXpLog, getXpSummary } from "../services/xp.service.js";


export async function xpRouter(fastify: FastifyInstance) {


    fastify.get('/api/xp/summary', async (request, reply) => {
        const userId = request.userId;
        const summary = await getXpSummary(userId);
        return reply.status(200).send({ summary });
    })

    // Type for the request query, as request.query is unknown by default. 
    interface XpLogQuery {
        page?: string;
        limit?: string;
    }

    fastify.get<{ Querystring: XpLogQuery }>('/api/xp/log', async (request, reply) => {
        const userId = request.userId;
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;

        const result = await getXpLog(userId, page, limit)

        return reply.status(200).send({ message: 'XP log fetched.', log: result })
    })

}