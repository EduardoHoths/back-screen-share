const rooms = new Map()

const validStatuses = new Set(['waiting', 'live', 'ended'])

function normalizeSlug(value) {
  const slug = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `sala-${Math.random().toString(36).slice(2, 8)}`
}

function serializeRoom(room) {
  return {
    id: room.id,
    slug: room.slug,
    ownerName: room.ownerName,
    status: room.status,
    viewers: room.viewers,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  }
}

export function createRoom(input = {}) {
  const now = new Date().toISOString()
  const room = {
    id: crypto.randomUUID(),
    slug: normalizeSlug(input.slug),
    ownerName: String(input.ownerName ?? 'Host').trim() || 'Host',
    status: validStatuses.has(input.status) ? input.status : 'waiting',
    viewers: 0,
    createdAt: now,
    updatedAt: now,
  }

  rooms.set(room.id, room)
  return serializeRoom(room)
}

export function findRoomById(id) {
  const room = rooms.get(id)

  return room ? serializeRoom(room) : null
}

export function findRoomBySlug(slug) {
  const normalizedSlug = normalizeSlug(slug)
  const room = Array.from(rooms.values()).find((candidate) => candidate.slug === normalizedSlug)

  return room ? serializeRoom(room) : null
}

export function startRoom(id) {
  return updateRoom(id, { status: 'live' })
}

export function stopRoom(id) {
  return updateRoom(id, { status: 'ended' })
}

export function joinRoom(id) {
  const room = rooms.get(id)

  if (!room) {
    return null
  }

  room.viewers += 1
  room.updatedAt = new Date().toISOString()

  return serializeRoom(room)
}

function updateRoom(id, patch) {
  const room = rooms.get(id)

  if (!room) {
    return null
  }

  Object.assign(room, patch, {
    updatedAt: new Date().toISOString(),
  })

  return serializeRoom(room)
}
