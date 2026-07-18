import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Routes
import authRoutes from './routes/auth.js';
import characterRoutes from './routes/character.js';
import missionRoutes from './routes/missions.js';
import travelRoutes from './routes/travel.js';
import shopRoutes from './routes/shop.js';
import publicRoutes from './routes/public.js';

// Socket handlers
import { registerCombatSocket } from './sockets/combat.socket.js';
import { registerChatSocket } from './sockets/chat.socket.js';
import { registerTravelSocket } from './sockets/travel.socket.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});

// Register API routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(characterRoutes, { prefix: '/api/character' });
fastify.register(missionRoutes, { prefix: '/api/missions' });
fastify.register(travelRoutes, { prefix: '/api/travel' });
fastify.register(shopRoutes, { prefix: '/api/shop' });
fastify.register(publicRoutes, { prefix: '/api/public' });

// Health check (for Render keep-alive)
fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// Create HTTP server for Socket.io
const httpServer = createServer(fastify.server);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Register socket handlers
registerCombatSocket(io);
registerChatSocket(io);
registerTravelSocket(io);

// Start
try {
  await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
  console.log(`🥷 Ninin Go Server running on port ${process.env.PORT || 3001}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
