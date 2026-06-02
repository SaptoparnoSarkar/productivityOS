import "dotenv/config";
import { pool } from "./config/db.js";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import authMiddleware from "./middleware/auth.middleware.js";
import { authRoutes } from "./routes/auth.js";
import { subjectRoutes } from "./routes/subject.js";
import { AppError } from "./utils/errors.js";
import { milestoneRoutes } from "./routes/milestone.js";
import { checklistItemRoutes } from "./routes/checklistItem.js";
import { counterRoutes } from "./routes/counter.js";
import fastifyCors from "@fastify/cors";

//Fastify Instance
const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    //Verify DB first
    await pool.query("SELECT 1");
    fastify.log.info("Database connected check");

    //Register Cors
    await fastify.register(fastifyCors, {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    });
    fastify.log.info("cors plugin check");

    //Register Cookie Plugin
    await fastify.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET!,
    });
    fastify.log.info("fastify cookie plugin check");

    //Register Auth Middleware
    await fastify.register(authMiddleware);
    fastify.log.info("auth middleware check");

    //Global Error Handler Class
    fastify.setErrorHandler((err, req, reply) => {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ message: err.message });
      }
      req.log.error(err);
      return reply.status(500).send({ message: "Internal Server Error" });
    });

    //Register routes
    await fastify.register(authRoutes);
    fastify.log.info("auth routes check");
    await fastify.register(subjectRoutes);
    fastify.log.info("subject routes check");
    await fastify.register(milestoneRoutes);
    fastify.log.info("milestone routes check");
    await fastify.register(checklistItemRoutes);
    fastify.log.info("checklist routes check");
    await fastify.register(counterRoutes);
    fastify.log.info("counter routes check");

    //Start listening
    await fastify.listen({ port: 4000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
