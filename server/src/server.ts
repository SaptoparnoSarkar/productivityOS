import { pool } from './config/db.js'
import Fastify from 'fastify'
import { authRoutes } from './routes/auth.js'
import fastifyCookie from '@fastify/cookie'

const fastify = Fastify({ logger: true })

//Register Cookie Plugin
fastify.register(fastifyCookie, {
  secret: process.env.JWT_SECRET!
})

//Register Auth Routes
fastify.register(authRoutes)


fastify.get('/', async (request, reply) => {
  return { hello: "world" }
})

//Run Server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    await pool.query('SELECT 1');
    fastify.log.info('Database connected');
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();
