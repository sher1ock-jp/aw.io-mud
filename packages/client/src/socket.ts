import listeners from './game/listeners';
import { io } from 'socket.io-client';

const socket = io('/');

export const initializeSocket = () => {
  socket.on('connect', () => { listeners(socket); });
};

export default socket;