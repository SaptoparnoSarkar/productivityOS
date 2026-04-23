import type { FastifyInstance } from "fastify";
import { createSubjectSchema, updateSubjectSchema } from "../schemas/subject.schema.js";
import { createSubject, deleteSubject, getSubject, getSubjects, updateSubject } from "../services/subject.service.js";



export async function subjectRoutes(fastify: FastifyInstance) {
    //Create Subject    POST /api/subjects
    fastify.post('/api/subjects', async (request, reply) => {

        // validate
        const result = createSubjectSchema.safeParse(request.body)
        if (!result.success) {
            return reply.status(400).send({ message: result.error.message })
        }

        // auth guard
        if (request.userId === null) {
            return reply.status(401).send({ message: 'Unauthorized' })
        }

        // call service, handle errors
        try {
            const subject = await createSubject(request.userId, result.data)
            return reply.status(201).send({ message: 'Subject Created Successfully', subject })
        } catch (error: any) {
            const errorMap: Record<string, number> = {
                // add mappings as errors emerge
            };
            const statusCode = errorMap[error.message];
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message });
            }
            console.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    })

    //Get Subjects List  GET /api/subjects
    fastify.get('/api/subjects', async (request, reply) => {
        //auth guard
        if (request.userId === null) {
            return reply.status(401).send({ message: 'Unauthorized' })
        }

        // call service, handle errors
        try {
            const subjects = await getSubjects(request.userId)
            return reply.status(200).send({ subjects })
        } catch (error: any) {
            const errorMap: Record<string, number> = {
                //Mappings as error emerge
            };
            const statusCode = errorMap[error.message];
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message });
            }
            console.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })

    //Get Subject  GET /api/subjects/:id
    fastify.get<{ Params: { id: string } }>('/api/subjects/:id', async (request, reply) => {
        //parse URL to number as DB expects subID to be int
        const subjectId = Number(request.params.id);

        //Guard
        if (isNaN(subjectId)) {
            return reply.status(400).send({ message: 'Invalid Subject ID' })
        }

        //Auth Guard
        if (request.userId === null) {
            return reply.status(401).send({ message: 'Unauthorized' })
        }

        //call services
        try {
            const subject = await getSubject(subjectId, request.userId)
            return reply.status(200).send({ subject })
        } catch (error: any) {
            const errorMap: Record<string, number> = {
                'Subject Not Found': 404,
            };
            const statusCode = errorMap[error.message]
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message });
            }
            console.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' })

        }
    })

    //Update Subject PATCH /api/subjects/:id 
    fastify.patch<{ Params: { id: string } }>('/api/subjects/:id', async (request, reply) => {

        // parse and guard URL param
        const subjectId = Number(request.params.id)

        if (isNaN(subjectId)) {
            return reply.status(400).send({ message: 'Invalid Subject ID' })
        }

        //validate body with updateSubjectSchema
        const result = updateSubjectSchema.safeParse(request.body)
        if (!result.success) {
            return reply.status(400).send({ message: result.error.message })
        }

        //auth guard
        if (request.userId === null) {
            return reply.status(401).send({ message: 'Unauthorized' })
        }

        //call services
        try {
            const update = await updateSubject(subjectId, request.userId, result.data)
            return reply.status(200).send({ message: 'Subjects Updated Successfully', subject: update })
        } catch (error: any) {
            const errorMap: Record<string, number> = {
                'Subject Not Found': 404,
            }
            const statusCode = errorMap[error.message]
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message })
            }
            console.error(error)
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })

    //Delete Subject DELETE /api/subjects/:id
    fastify.delete<{ Params: { id: string } }>('/api/subjects/:id', async (request, reply) => {
        //parse and guard url param
        const subjectId = Number(request.params.id)
        if (isNaN(subjectId)) {
            return reply.status(400).send({ message: 'Invalid Subject ID' })
        }

        //auth guard
        if (request.userId === null) {
            return reply.status(401).send({ message: 'Unauthorized' })
        }

        //call services
        try {
            await deleteSubject(subjectId, request.userId)
            return reply.status(200).send({ message: 'Subject deleted successfully' })
        } catch (error: any) {
            const errorMap: Record<string, number> = {
                'Subject Not Found': 404,
            }
            const statusCode = errorMap[error.message]
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message })
            }
            console.error(error)
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })
}

//Todo : Make an error toolkit to avoid repeating error handling code