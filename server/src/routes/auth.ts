import type { FastifyInstance } from "fastify";
import { signupSchema, verifyEmailSchema, signinSchema, resendCodeSchema } from "../schemas/auth.schema.js"
import { signupUser, verifyEmail, loginUser, resendVerificationCode, refreshToken, signOut } from '../services/auth.service.js'
import { ACCESS_TOKEN_OPTIONS, REFRESH_TOKEN_OPTIONS } from '../utils/auth.utils.js'




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

            reply.setCookie('access_token', response.token, ACCESS_TOKEN_OPTIONS)
            reply.setCookie('refresh_token', response.refreshToken, REFRESH_TOKEN_OPTIONS)

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

            reply.setCookie('access_token', response.token, ACCESS_TOKEN_OPTIONS)

            reply.setCookie('refresh_token', response.refreshToken, REFRESH_TOKEN_OPTIONS)

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
 
    //Refresh-Token /auth/refresh-token
    fastify.post('/auth/refresh-token', async (request, reply) => {
        //Read refresh_token from the cookie
        const refresh_token = request.cookies.refresh_token
        if (!refresh_token) {
            return reply.status(401).send({ message: 'Refresh Token Not Found' })
        }

        try {
            const response = await refreshToken(refresh_token)
            reply.setCookie('access_token', response.token, ACCESS_TOKEN_OPTIONS)
            reply.setCookie('refresh_token', response.refreshToken, REFRESH_TOKEN_OPTIONS)
            return reply.status(200).send({ message: 'Token Refreshed Successfully' })
        }
        catch (error: any) {
            const errorMap: Record<string, number> = {
                'Refresh Token Not Found': 401,
            }
            const statusCode = errorMap[error.message]
            if (statusCode) {
                return reply.status(statusCode).send({ message: error.message })
            }
            console.error(error)
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })

    //Sign-out /auth/sign-out
    fastify.post('/auth/signout', async (request, reply) => {
        //Read refresh_token from cookie
        const refresh_token = request.cookies.refresh_token
        if (!refresh_token) {
            //Clear Both Cookies with matching options
            reply.clearCookie('access_token', ACCESS_TOKEN_OPTIONS)
            reply.clearCookie('refresh_token', REFRESH_TOKEN_OPTIONS)
            return reply.status(200).send({ message: 'Signed Out Successfully' })
        }
        try {
            const response = await signOut(refresh_token)
            //Clear Both Cookies with matching options
            reply.clearCookie('access_token', ACCESS_TOKEN_OPTIONS)
            reply.clearCookie('refresh_token', REFRESH_TOKEN_OPTIONS)
            return reply.status(200).send({ message: 'Signed Out Successfully' })
        }
        catch (error: any) {
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })

    //TestCase /auth/me
    fastify.get('/auth/me', async (request, reply) => {
        return { userId: request.userId }
    })
}


//Todo : Make an error toolkit to avoid repeating error handling code