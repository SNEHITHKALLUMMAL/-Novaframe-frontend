import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/ui/toast/ToastContext.jsx';
import { ToastViewport } from './components/ui/toast/ToastViewport.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import { useRealtimeConnection } from './hooks/useRealtimeConnection.js';

function RealtimeConnection() {
  useRealtimeConnection();
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <RealtimeConnection />
        <AppRoutes />
        <ToastViewport />
      </ToastProvider>
    </ErrorBoundary>
  );
}
