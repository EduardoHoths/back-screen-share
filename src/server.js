import 'dotenv/config'
import cors from '@fastify/cors'
import Fastify from 'fastify'
import { roomRoutes } from './routes/rooms.js'

const server = Fastify({
  logger: true,
})

await server.register(cors, {
  origin: true,
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
