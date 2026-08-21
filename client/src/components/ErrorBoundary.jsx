import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button.jsx';

/**
 * React error boundaries must be class components — there is no hook
 * equivalent for getDerivedStateFromError/componentDidCatch. Wraps the app
 * (and can wrap individual risky sections, e.g. the generation preview) so a
 * render-time error shows a recoverable fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Centralized client-side error logging hook — swap in a real reporting
    // service call here in a later phase without touching call sites.
    console.error('Unhandled UI error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="mx-auto w-fit rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive-text" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. You can try again, or reload the page.
            </p>
            <Button onClick={this.handleReset}>Try again</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
