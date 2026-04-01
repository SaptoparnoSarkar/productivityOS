import type { FastifyInstance } from "fastify";
import { signupSchema, verifyEmailSchema, signinSchema, resendCodeSchema } from "../schemas/auth.schema.js"
import { signupUser, verifyEmail, loginUser, resendVerificationCode } from '../services/auth.service.js'


export async function authRoutes(fastify: FastifyInstance) {

    //Sign-up  /auth/signup
    fastify.post('/auth/signup', async (request, reply) => {
        const result = signupSchema.safeParse(request.body)
        if (!result.success) {
            return reply.status(400).send({ message: result.error.message })
        }

        try {
            const response = await signupUser(result.data.email, result.data.password)
            return reply.status(201).send(response)
        }
        catch (error: any) {
            if (error.message === 'Email Already Taken') {
                return reply.status(409).send({ message: error.message })
            }
            console.error(error)
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })

    //Verify Email /auth/verify-email
    fastify.post('/auth/verify-email', async (request, reply) => {
        const result = verifyEmailSchema.safeParse(request.body)
        if (!result.success) {
            return reply.status(400).send({ message: result.error.message })
        }

        try {
            const response = await verifyEmail(result.data.email, result.data.code)

            reply.setCookie('access_token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 900
            })

            reply.setCookie('refresh_token', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/auth/refresh-token',
                maxAge: 60 * 60 * 24 * 30
            })

            return reply.status(200).send({ message: 'Email Verified Successfully' })


        }
        catch (error: any) {
            const errorMap: Record<string, number> = {
                'Invalid Verification Code': 400,
                'Verification Code Has Expired': 401,
                'Verification Code Already Used': 403,
            }
            const statusCode = errorMap[error.message]
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message })
            }
            console.error(error)
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })

    //Resend Code /auth/resend-code
    fastify.post('/auth/resend-code', async (request, reply) => {
        const result = resendCodeSchema.safeParse(request.body)
        if (!result.success) {
            return reply.status(400).send({ message: result.error.message })
        }
        try {
            const response = await resendVerificationCode(result.data.email)
            return reply.status(200).send({ message: response.message })
        }
        catch (error: any) {
            const errorMap: Record<string, number> = {
                'User Not Found': 404,
                'User Already Verified': 409,
                'Please Wait 60 Seconds Before Resending Code': 429,
            }
            const statusCode = errorMap[error.message]
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message })
            }
            console.error(error)
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })

    //Sign-in  /auth/signin
    fastify.post('/auth/signin', async (request, reply) => {
        const result = signinSchema.safeParse(request.body)
        if (!result.success) {
            return reply.status(400).send({ message: result.error.message })
        }

        try {
            const response = await loginUser(result.data.email, result.data.password)

            reply.setCookie('access_token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 900
            })

            reply.setCookie('refresh_token', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/auth/refresh-token',
                maxAge: 60 * 60 * 24 * 30
            })

            return reply.status(200).send({ message: 'User Logged In Successfully' })
        }
        catch (error: any) {
            const errorMap: Record<string, number> = {
                'Invalid Credentials': 401,
                'Please Verify Your Email': 403,
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
