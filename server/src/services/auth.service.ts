import bcrypt from 'bcrypt'
import { findUserByEmail, findVerificationCode, insertUser, insertVerificationCode, completeVerification, findLatestVerificationCode, insertRefreshToken, findRefreshToken, revokeRefreshToken } from '../db/queries/auth.queries.js'
import { generateVerificationCode, generateRefreshToken, hashToken } from '../utils/auth.utils.js'
import { resend } from '../config/resend.js'
import { SignJWT } from 'jose'
import { verifyPassword } from '../utils/auth.utils.js'
import { ConflictError, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError } from "../utils/errors.js";



export async function signupUser(email: string, password: string) {

    //Check if email exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
        throw new ConflictError('Email Already Taken')
    }

    //Hash Passowrd
    const passwordHash = await bcrypt.hash(password, 10)

    //Insert User
    const user = await insertUser(email, passwordHash)

    //Generate Verification Code
    const verificationCode = generateVerificationCode()

    //Insert Code
    const FIFTEEN_MINUTES = 1000 * 60 * 15
    const expiredAt = new Date(Date.now() + FIFTEEN_MINUTES)
    await insertVerificationCode(user.id, String(verificationCode), expiredAt)

    //Send Email
    await resend.emails.send({
        from: "<support@productivityOS.com>",
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Your Verification Code is: <strong>${verificationCode}</strong></p>`
    })

    //Return something useful to the route
    return { message: 'User Created Successfully' }
}

export async function verifyEmail(email: string, code: string) {

    //Find the verification code in db
    const verification_code = await findVerificationCode(email, code)


    //Throw if null/expired/already used
    if (!verification_code) {
        throw new ValidationError('Invalid Verification Code')
    }
    if (new Date(verification_code.expired_at) < new Date()) {
        throw new ValidationError('Verification Code Has Expired')
    }
    if (verification_code.is_used) {
        throw new ValidationError('Verification Code Already Used')
    }
    //Run Both UPDATESs in a transaction
    await completeVerification(email, verification_code.id)
    //Generate JWT access token
    //Guard Check
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const jwt = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(verification_code.user_id))
        .setExpirationTime('15m')
        .sign(secret)

    //Generate Refresh Token
    const rawToken = generateRefreshToken()
    const refreshToken = hashToken(rawToken)

    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30
    const expiredAt = new Date(Date.now() + THIRTY_DAYS)

    await insertRefreshToken(String(verification_code.user_id), refreshToken, expiredAt)


    //Return the token
    return { token: jwt, refreshToken: rawToken }
}

export async function loginUser(email: string, password: string) {

    //Find user by email 
    const user = await findUserByEmail(email)
    if (!user) {
        throw new UnauthorizedError('Invalid Credentials')
    }

    //Check if verified
    const verification_status = user.is_verified

    if (!verification_status) {
        throw new ForbiddenError('Please Verify Your Email')
    }

    //Verify The Passoword - by the bcrypt method
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid Credentials')
    }

    //Generate JWT (same pattern as verifyEmail)
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const jwt = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(user.id))
        .setExpirationTime('15m')
        .sign(secret)

    //Generate Refresh Token
    const rawToken = generateRefreshToken()
    const refreshToken = hashToken(rawToken)

    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30
    const expiredAt = new Date(Date.now() + THIRTY_DAYS)

    await insertRefreshToken(String(user.id), refreshToken, expiredAt)

    //Return token
    return { token: jwt, refreshToken: rawToken }
}

export async function resendVerificationCode(email: string) {
    //Find user & What if they don't exist?
    let user = await findUserByEmail(email)
    if (!user) {
        throw new NotFoundError('User Not Found')
    }
    //What if already verified?
    let verificationStatus = user.is_verified
    if (verificationStatus) {
        throw new ConflictError('User Already Verified')
    }
    //Check if code was sent in last 60 seconds
    const latestCode = await findLatestVerificationCode(user.id)
    if (latestCode) {
        const timeSinceLastCode = Date.now() - new Date(latestCode.created_at).getTime()
        if (timeSinceLastCode < 60000) {
            throw new ConflictError('Please Wait 60 Seconds Before Resending Code')
        }
    }

    //Generate new Code + Expiry
    const verificationCode = generateVerificationCode()
    const FIFTEEN_MINUTES = 1000 * 60 * 15
    const expiredAt = new Date(Date.now() + FIFTEEN_MINUTES)

    //Insert into verification_codes table
    await insertVerificationCode(user.id, String(verificationCode), expiredAt)

    //Send email
    await resend.emails.send({
        from: "<support@productivityOS.com>",
        to: email,
        subject: "Verification Code",
        html: `<p>Your Verification Code is: <strong>${verificationCode}</strong></p>`
    })
    //Return response
    return { message: "Verification Code Resent Successfully" }
}

export async function refreshToken(refreshToken: string) {
    //Hash Token & Look it up in DB
    const hashedToken = hashToken(refreshToken)
    const tokenRecord = await findRefreshToken(hashedToken)

    //If not found? Reject
    if (!tokenRecord) {
        throw new UnauthorizedError('Refresh Token Not Found')
    }
    //Revoke the old Token
    await revokeRefreshToken(hashedToken)


    //Generate new refresh token
    const rawToken = generateRefreshToken()
    const newRefreshToken = hashToken(rawToken)
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30
    const expired_at = new Date(Date.now() + THIRTY_DAYS)

    await insertRefreshToken(tokenRecord.user_id, newRefreshToken, expired_at)

    //Generate new access token
    //Guard Check
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const jwt = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(tokenRecord.user_id))
        .setExpirationTime('15m')
        .sign(secret)

    //return both tokens
    return { token: jwt, refreshToken: rawToken }
}

export async function signOut(refreshToken: string) {
    //Hash it -> Remove it in DB
    const hashedToken = hashToken(refreshToken)
    await revokeRefreshToken(hashedToken)

    return { message: 'User Logged Out Successfully' }
}    