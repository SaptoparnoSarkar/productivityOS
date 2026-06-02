import type { FastifyInstance } from "fastify";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../schemas/subject.schema.js";
import {
  createSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  updateSubject,
} from "../services/subject.service.js";
import { ValidationError } from "../utils/errors.js";

export async function subjectRoutes(fastify: FastifyInstance) {
  //Create Subject    POST /api/subjects
  fastify.post("/api/subjects", async (request, reply) => {
    // validate
    const result = createSubjectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.message });
    }

    // call service, handle errors
    const subject = await createSubject(request.userId, result.data);
    return reply
      .status(201)
      .send({ message: "Subject Created Successfully", subject });
  });

  //Get Subjects List  GET /api/subjects
  fastify.get("/api/subjects", async (request, reply) => {
    // call service, handle errors
    const subjects = await getSubjects(request.userId);
    return reply.status(200).send({ subjects });
  });

  //Get Subject  GET /api/subjects/:id
  fastify.get<{ Params: { id: string } }>(
    "/api/subjects/:id",
    async (request, reply) => {
      //parse URL to number as DB expects subID to be int
      const subjectId = Number(request.params.id);

      //Guard
      if (isNaN(subjectId)) {
        return reply.status(400).send({ message: "Invalid Subject ID" });
      }

      //call services

      const subject = await getSubject(subjectId, request.userId);
      return reply.status(200).send({ subject });
    },
  );

  //Update Subject PATCH /api/subjects/:id
  fastify.patch<{ Params: { id: string } }>(
    "/api/subjects/:id",
    async (request, reply) => {
      // parse and guard URL param
      const subjectId = Number(request.params.id);

      if (isNaN(subjectId)) {
        return reply.status(400).send({ message: "Invalid Subject ID" });
      }

      //validate body with updateSubjectSchema
      const result = updateSubjectSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({ message: result.error.message });
      }

      //call services
      const update = await updateSubject(
        subjectId,
        request.userId,
        result.data,
      );
      return reply
        .status(200)
        .send({ message: "Subjects Updated Successfully", subject: update });
    },
  );

  //Delete Subject DELETE /api/subjects/:id
  fastify.delete<{ Params: { id: string } }>(
    "/api/subjects/:id",
    async (request, reply) => {
      //parse and guard url param
      const subjectId = Number(request.params.id);
      if (isNaN(subjectId)) {
        throw new ValidationError('Invalid Subject ID');
      }

      //call services
      await deleteSubject(subjectId, request.userId);
      return reply
        .status(200)
        .send({ message: "Subject deleted successfully" });
    },
  );
}

//Todo : Make an error toolkit to avoid repeating error handling code
//Todo: Delete subject + XP reversal hook
