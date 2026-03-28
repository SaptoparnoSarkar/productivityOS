import { pool } from '../config/db.js'
import type { FastifyInstance } from "fastify";
import { signupSchema, verifyEmailSchema } from "../schemas/auth.schema.js";
import { generateVerificationCode } from '../utils/auth.utils.js'
import bcrypt from 'bcrypt'
import { resend } from '../config/resend.js';
import { SignJWT } from 'jose'
import '@fastify/cookie'
export async function authRoutes(fastify: FastifyInstance) {
    //Signup Route Handler
    fastify.post('/auth/signup', async (request, reply) => {
        try {
            //Fastify Validates (zod)
            const result = signupSchema.safeParse(request.body)
            if (!result.success) {
                return reply.status(400).send(result.error)
            }
            const { email, password } = result.data

            //Check if email already exists
            const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
            if (existingUser.rows.length > 0) {
                return reply.status(409).send({ message: 'Email Already Taken' })
            }

            //Password Hashing
            const passwordHash = await bcrypt.hash(password, 10)

            //Insert User in DB
            const user = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id', [email, passwordHash])

            //Fetch the User ID
            const userID = user.rows[0].id

            //Generate Verification Code
            const verificationCode = generateVerificationCode();

            //Insert Verification Code in DB
            const expiredAt = new Date(Date.now() + 900000)
            await pool.query('INSERT INTO verification_codes (user_id, verification_code, expired_at) VALUES ($1, $2, $3) RETURNING id', [userID, verificationCode, expiredAt])

            //Send Email (via Resend)
            await resend.emails.send({
                from: "<support@productivityOS.com>",
                to: email,
                subject: "Verify Your Email",
                html: `<p>Your Verification Code is: <strong>${verificationCode}</strong></p>`
            })

            //Return Response
            return reply.status(201).send({ message: 'User created successfully' })
        }
        catch (error) {
            console.log(error)
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })
    //Email Verification Route Handler
    fastify.post('/auth/verify-email', async (request, reply) => {
        try {
            //Fastify Validates (zod)
            const result = verifyEmailSchema.safeParse(request.body)
            if (!result.success) {
                return reply.status(400).send(result.error)
            }
            const { email, code } = result.data

            //Find the verification code in db
            const codeRecord = await pool.query(
                `SELECT verification_codes.id, verification_codes.expired_at, verification_codes.is_used, users.id as user_id FROM verification_codes
                 JOIN users ON verification_codes.user_id = users.id
                 WHERE users.email = $1
                 AND verification_codes.verification_code = $2 `,
                [email, code]
            )
            if (codeRecord.rows.length === 0) {
                return reply.status(400).send({ message: 'Invalid Verification Code' })
            }
            if (codeRecord.rows[0].expired_at < new Date()) {
                return reply.status(400).send({ message: 'Verification Code Has Expired' })
            }
            if (codeRecord.rows[0].is_used === true) {
                return reply.status(400).send({ message: 'Verification Code Is Already Used' })
            }

            //Mark user as verified
            await pool.query(`UPDATE users SET is_verified = true WHERE email = $1`, [email])

            //Mark code as used
            await pool.query(`UPDATE verification_codes SET is_used = true WHERE id = $1`, [codeRecord.rows[0].id])

            //Generate access token
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const jwt = await new SignJWT({})
                .setProtectedHeader({ alg: 'HS256' })
                .setSubject(codeRecord.rows[0].user_id)
                .setExpirationTime('15m')
                .sign(secret)

            //Set the Cookie 
            reply.setCookie('token', jwt, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })

            return reply.status(200).send({ message: "Email Verification Successful" })

        }
        catch (error) {
            console.log(error)
            return reply.status(500).send({ message: "Internal Server Error" })
        }
    })

}
