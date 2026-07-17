import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const combatSocket = io(`${SERVER_URL}/combat`, { autoConnect: false });
export const chatSocket   = io(`${SERVER_URL}/chat`,   { autoConnect: false });
export const travelSocket = io(`${SERVER_URL}/travel`, { autoConnect: false });
