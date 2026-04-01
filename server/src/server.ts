import 'dotenv/config'
import { pool } from './config/db.js'
import Fastify from 'fastify'
import { authRoutes } from './routes/auth.js'
import fastifyCookie from '@fastify/cookie'

//Fastify Instance
const fastify = Fastify({ logger: true })
//Register Cookie Plugin
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET!
})

//Pass it into routes via Register()
fastify.register(authRoutes)


fastify.get('/', async (request, reply) => {
  return { hello: "world" }
})

//Run Server
const start = async () => {
  try {
    await pool.query('SELECT 1');
    fastify.log.info('Database connected');
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();
