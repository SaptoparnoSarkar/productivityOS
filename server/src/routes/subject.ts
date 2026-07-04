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
  markSubjectComplete,
  upcomingSubjects,
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
    return reply.status(200).send({ subjects: subjects ?? [] });
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

  //Upcoming Subjects GET /api/subjects/upcoming
  fastify.get("/api/subjects/upcoming", async (request, reply) => {
    const subjects = await upcomingSubjects(request.userId, 5);
    return reply.status(200).send({ subjects });
  });


  //Mark Subject Complete PATCH /api/subjects/:id/complete
  fastify.patch<{ Params: { id: string } }>('/api/subjects/:id/complete', async (request, reply) => {
    const subjectId = Number(request.params.id);
    if (isNaN(subjectId)) {
      throw new ValidationError('Invalid Subject ID');
    }

    await markSubjectComplete(request.userId, subjectId);
    return reply
      .status(200)
      .send({ message: "Subject Marked Complete" });
  })
}
