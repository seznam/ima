import { PureComponent, ReactElement } from 'react';

export interface Props {
  children?: ReactElement;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary wrapper which connects the IMA application to the
 * dev HMR api and handles error reporting.
 */
export default class ErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
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
