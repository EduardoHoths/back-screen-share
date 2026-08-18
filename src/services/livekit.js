import { AccessToken } from 'livekit-server-sdk'

const defaultTtl = '15m'

export function getLiveKitConfig() {
  return {
    url: process.env.LIVEKIT_URL ?? '',
    apiKey: process.env.LIVEKIT_API_KEY ?? '',
    apiSecret: process.env.LIVEKIT_API_SECRET ?? '',
  }
}

export function hasLiveKitConfig() {
  const config = getLiveKitConfig()

  return Boolean(config.url && config.apiKey && config.apiSecret)
}

export async function createRoomToken({ room, participantName, role }) {
  const config = getLiveKitConfig()
  const permissions = getPermissions(role)

  if (!hasLiveKitConfig()) {
    return {
      livekitUrl: '',
      token: '',
      configured: false,
      permissions,
    }
  }

  const identity = `${role}-${crypto.randomUUID()}`
  const token = new AccessToken(config.apiKey, config.apiSecret, {
    identity,
    name: participantName || role,
    ttl: defaultTtl,
  })

  token.addGrant({
    room: room.slug,
    roomJoin: true,
    canPublish: permissions.canPublish,
    canSubscribe: permissions.canSubscribe,
    canPublishData: permissions.canPublishData,
  })

  return {
    livekitUrl: config.url,
    token: await token.toJwt(),
    configured: true,
    identity,
    permissions,
  }
}

function getPermissions(role) {
  if (role === 'host') {
    return {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    }
  }

  return {
    canPublish: false,
    canSubscribe: true,
    canPublishData: false,
  }
}
