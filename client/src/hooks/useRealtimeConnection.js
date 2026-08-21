import { useEffect } from 'react';
import { useAuth } from './useAuth.js';
import { getSocket } from '../lib/socket.js';

/**
 * Called once, in App.jsx. The socket connects only once a session is
 * confirmed (status === 'authenticated') and disconnects immediately on
 * logout — there is no unauthenticated socket connection at any point,
 * consistent with the server's authenticateSocket() rejecting anything
 * without a valid access-token cookie.
 */
export function useRealtimeConnection() {
  const { status } = useAuth();

  useEffect(() => {
    const socket = getSocket();
    if (status === 'authenticated') {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [status]);
}
