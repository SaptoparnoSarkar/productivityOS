import type { FastifyInstance } from "fastify";
import { getTotalXp, } from "../services/xp.service.js";


export async function xpRouter(fastify: FastifyInstance) {


    fastify.get('/xp/total', async (request, reply) => {
        const totalXp = await getTotalXp(request.userId);
        return reply.status(200).send({ totalXp })
    })

    // fastify.get('/xp/daily', async (request, reply) => {
    //     const dailyXp = await getDailyXp(request.userId);
    //     return reply.status(200).send({ dailyXp })
    // })
}