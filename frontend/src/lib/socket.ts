import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  let token = '';
  try {
    const raw = localStorage.getItem('auth-token') || localStorage.getItem('token');
    if (raw) token = raw;
    else {
      const uRaw = localStorage.getItem('user-data');
      if (uRaw) {
        const u = JSON.parse(uRaw);
        token = u?.token || '';
      }
    }
  } catch {}

  socket = io(API_URL, {
    transports: ['websocket'],
    withCredentials: true,
    auth: token ? { token } : undefined,
  });

  socket.on('connect_error', (err) => {
    // Non-fatal; fallback to polling in UI
    // console.warn('Socket connect_error', err);
  });

  return socket;
}
