# Screen Share API

Backend minimo do projeto de compartilhamento de tela.

## Rodar localmente

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Endpoints

```text
GET  /api/health
POST /api/rooms
GET  /api/rooms/:slug
POST /api/rooms/:id/start
POST /api/rooms/:id/stop
POST /api/rooms/:id/join
POST /api/rooms/:id/token
```

## Token LiveKit

Sem variaveis LiveKit configuradas, o endpoint de token retorna `configured: false` e as permissoes calculadas. Com `LIVEKIT_URL`, `LIVEKIT_API_KEY` e `LIVEKIT_API_SECRET`, ele retorna um JWT real para conectar no LiveKit.
