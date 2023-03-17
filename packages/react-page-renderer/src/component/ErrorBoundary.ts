import { PureComponent, ReactElement } from 'react';

export interface ErrorBoundaryProps {
  children?: ReactElement;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary wrapper which connects the IMA application to the
 * dev HMR api and handles error reporting.
 */
export class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    // Clear reported errors
    if (typeof window !== 'undefined' && window?.__IMA_HMR?.emitter) {
      window.__IMA_HMR.emitter.emit('clear');
    }
  }

  componentDidCatch(error: Error) {
    // Report errors to overlay
    if (typeof window !== 'undefined' && window?.__IMA_HMR?.emitter) {
      window.__IMA_HMR.emitter.emit('error', { error });
    }
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
