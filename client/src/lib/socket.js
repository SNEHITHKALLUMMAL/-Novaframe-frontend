import { io } from 'socket.io-client';

let socket = null;

/**
 * One shared socket for the whole app rather than one per component —
 * connecting/disconnecting is managed centrally by useRealtimeConnection()
 * (called once, in App.jsx), and any component can just getSocket().on(...)
 * to listen for events. Auth is via the same httpOnly accessToken cookie
 * the REST API uses (withCredentials: true) — no separate token to manage.
 */
export function getSocket() {
  socket ??= io('/', {
    path: '/socket.io',
    withCredentials: true,
    autoConnect: false,
  });
  return socket;
}
