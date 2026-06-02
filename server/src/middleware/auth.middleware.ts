import fp from "fastify-plugin";
import { jwtVerify } from "jose";
import type { FastifyInstance } from "fastify";
import { UnauthorizedError } from "../utils/errors.js";

//Public Route Array
const PUBLIC_ROUTES = [
  "POST:/auth/signup",
  "POST:/auth/signin",
  "POST:/auth/verify-email",
  "POST:/auth/resend-code",
  "POST:/auth/refresh-token",
];

async function authMiddleware(fastify: FastifyInstance) {
  //Decorate request with userId
  fastify.decorateRequest("userId");

  //onRequest hook that skips public route
  fastify.addHook("onRequest", async (request, reply) => {
    //Build route key
    const routeKey = `${request.method}:${request.routeOptions.url}`;
    if (PUBLIC_ROUTES.includes(routeKey)) return;

    //Read access token cookie
    const token = request.cookies.access_token;
    if (!token) {
      throw new UnauthorizedError("Cookies Not Found");
    }

    //Verify JWT
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (!payload.sub) {
        throw new UnauthorizedError("Invalid Token");
      }
      request.userId = Number(payload.sub);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new UnauthorizedError("Invalid Token");
    }
  });
}

export default fp(authMiddleware);
