import fp from 'fastify-plugin'
import { jwtVerify } from 'jose'
import type { FastifyInstance } from 'fastify'

//Public Route Array
const PUBLIC_ROUTES = [
    'POST:/auth/signup',
    'POST:/auth/signin',
    'POST:/auth/verify-email',
    'POST:/auth/resend-code',
]

async function authMiddleware(fastify: FastifyInstance) {

    //Decorate request with userId
    fastify.decorateRequest('userId', null)

    //onRequest hook that skips public route
    fastify.addHook('onRequest', async (request, reply) => {
        //Build route key
        const routeKey = `${request.method}:${request.url}`
        if (PUBLIC_ROUTES.includes(routeKey)) return

        //Read access token cookie
        const token = request.cookies.access_token
        if (!token) {
            return reply.status(401).send({ message: 'Cookies Not Found' })
        }

        //Verify JWT
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const { payload } = await jwtVerify(token, secret)
            if (!payload.sub) {
                return reply.status(401).send({ message: 'Invalid Token' })
            }
            request.userId = payload.sub
        }
        catch (error) {
            return reply.status(401).send({ message: 'Invalid Token' })
        }
    })
}

export default fp(authMiddleware)