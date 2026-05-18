import type { FastifyInstance } from "fastify";
import {
  signupSchema,
  verifyEmailSchema,
  signinSchema,
  resendCodeSchema,
} from "../schemas/auth.schema.js";
import {
  signupUser,
  verifyEmail,
  loginUser,
  resendVerificationCode,
  refreshToken,
  signOut,
} from "../services/auth.service.js";
import {
  ACCESS_TOKEN_OPTIONS,
  REFRESH_TOKEN_OPTIONS,
} from "../utils/auth.utils.js";

export async function authRoutes(fastify: FastifyInstance) {
  //Sign-up  /auth/signup
  fastify.post("/auth/signup", async (request, reply) => {
    const result = signupSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.message });
    }
    const response = await signupUser(result.data.email, result.data.password);
    return reply.status(201).send(response);
  });

  //Verify Email /auth/verify-email
  fastify.post("/auth/verify-email", async (request, reply) => {
    const result = verifyEmailSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.message });
    }
    const response = await verifyEmail(result.data.email, result.data.code);

    reply.setCookie("access_token", response.token, ACCESS_TOKEN_OPTIONS);
    reply.setCookie(
      "refresh_token",
      response.refreshToken,
      REFRESH_TOKEN_OPTIONS,
    );

    return reply.status(200).send({ message: "Email Verified Successfully" });
  });

  //Resend Code /auth/resend-code
  fastify.post("/auth/resend-code", async (request, reply) => {
    const result = resendCodeSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.message });
    }
    const response = await resendVerificationCode(result.data.email);
    return reply.status(200).send({ message: response.message });
  });

  //Sign-in  /auth/signin
  fastify.post("/auth/signin", async (request, reply) => {
    const result = signinSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.message });
    }

    const response = await loginUser(result.data.email, result.data.password);

    reply.setCookie("access_token", response.token, ACCESS_TOKEN_OPTIONS);
    reply.setCookie(
      "refresh_token",
      response.refreshToken,
      REFRESH_TOKEN_OPTIONS,
    );

    return reply.status(200).send({ message: "User Logged In Successfully" });
  });

  //Refresh-Token /auth/refresh-token
  fastify.post("/auth/refresh-token", async (request, reply) => {
    //Read refresh_token from the cookie
    const refresh_token = request.cookies.refresh_token;
    if (!refresh_token) {
      return reply.status(401).send({ message: "Refresh Token Not Found" });
    }

    const response = await refreshToken(refresh_token);
    reply.setCookie("access_token", response.token, ACCESS_TOKEN_OPTIONS);
    reply.setCookie(
      "refresh_token",
      response.refreshToken,
      REFRESH_TOKEN_OPTIONS,
    );
    return reply.status(200).send({ message: "Token Refreshed Successfully" });
  });

  //Sign-out /auth/sign-out
  fastify.post("/auth/signout", async (request, reply) => {
    //Read refresh_token from cookie
    const refresh_token = request.cookies.refresh_token;

    if (refresh_token) {
      await signOut(refresh_token);
    }
    reply.clearCookie("access_token", ACCESS_TOKEN_OPTIONS);
    reply.clearCookie("refresh_token", REFRESH_TOKEN_OPTIONS);
    return reply.status(200).send({ message: "Signed Out Successfully" });
  });
}

//Zod validation can be centralized/modularized
