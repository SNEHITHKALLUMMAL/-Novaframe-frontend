import { Component } from 'react';
import { Video, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 bg-tech-grid">
          <div className="max-w-md text-center space-y-5">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-destructive/10">
              <Video className="h-7 w-7 text-destructive-text" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary-button text-primary-foreground text-sm font-medium hover:bg-primary-button/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
