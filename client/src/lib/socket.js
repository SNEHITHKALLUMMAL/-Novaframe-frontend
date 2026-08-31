import { io } from 'socket.io-client';

let socket = null;

/**
 * One shared socket for the whole app rather than one per component —
 * connecting/disconnecting is managed centrally by useRealtimeConnection()
 * (called once, in App.jsx), and any component can just getSocket().on(...)
 * to listen for events. Auth is via the same httpOnly accessToken cookie
 * the REST API uses (withCredentials: true) — no separate token to manage.
 *
 * Connects to '/' (same-origin) by default, matching apiClient's relative
 * baseURL fallback. When the frontend and API are on different origins in
 * production (Vercel + Render), set VITE_SOCKET_URL to the API's origin —
 * same reasoning as VITE_API_URL in services/apiClient.js.
 */
export function getSocket() {
  socket ??= io(import.meta.env.VITE_SOCKET_URL || '/', {
    path: '/socket.io',
    withCredentials: true,
    autoConnect: false,
  });
  return socket;
}
