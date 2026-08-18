import {
  createRoom,
  findRoomById,
  findRoomBySlug,
  joinRoom,
  startRoom,
  stopRoom,
} from '../services/rooms.js'

export async function roomRoutes(server) {
  server.post('/', async (request, reply) => {
    const room = createRoom(request.body ?? {})

    return reply.code(201).send({ room })
  })

  server.get('/:slug', async (request, reply) => {
    const room = findRoomBySlug(request.params.slug)

    if (!room) {
      return reply.code(404).send({ message: 'Room not found' })
    }

    return { room }
  })

  server.post('/:id/start', async (request, reply) => {
    const room = findRoomById(request.params.id)

    if (!room) {
      return reply.code(404).send({ message: 'Room not found' })
    }

    return { room: startRoom(room.id) }
  })

  server.post('/:id/stop', async (request, reply) => {
    const room = findRoomById(request.params.id)

    if (!room) {
      return reply.code(404).send({ message: 'Room not found' })
    }

    return { room: stopRoom(room.id) }
  })

  server.post('/:id/join', async (request, reply) => {
    const room = findRoomById(request.params.id)

    if (!room) {
      return reply.code(404).send({ message: 'Room not found' })
    }

    return {
      room: joinRoom(room.id),
      participant: {
        id: crypto.randomUUID(),
        role: 'viewer',
        canPublish: false,
        canSubscribe: true,
      },
    }
  })
}
