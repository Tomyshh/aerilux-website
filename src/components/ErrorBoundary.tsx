import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignorer les erreurs AbortError
    if (error.name === 'AbortError' || 
        error.message?.includes('aborted') ||
        error.message?.includes('The user aborted a request')) {
      this.setState({ hasError: false });
      return;
    }
    
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return null; // Ne rien afficher en cas d'erreur
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
