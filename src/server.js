import 'dotenv/config'
import cors from '@fastify/cors'
import Fastify from 'fastify'
import { roomRoutes } from './routes/rooms.js'

const server = Fastify({
  logger: true,
})

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean)

await server.register(cors, {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Origin not allowed by CORS'), false)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
})

await server.register(roomRoutes, {
  prefix: '/api/rooms',
})

server.get('/api/health', async () => ({
  ok: true,
  service: 'screen-share-api',
}))

const port = Number(process.env.PORT ?? 3333)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await server.listen({ port, host })
} catch (error) {
  server.log.error(error)
  process.exit(1)
}
