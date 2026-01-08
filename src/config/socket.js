import { io } from 'socket.io-client';
import { environment } from '../env';

export const socket = io(environment.socketUrl, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('✅ WebSocket Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('❌ WebSocket Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🔴 WebSocket Connection Error:', error.message);
});

export default socket;
