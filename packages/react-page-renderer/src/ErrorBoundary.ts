import { PureComponent, ReactElement } from 'react';

interface Props {
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

  componentDidMount() {
    // Clear reported errors
    if (typeof window !== 'undefined' && window?.__IMA_HMR?.emit) {
      window.__IMA_HMR.emit('clear');
    }
  }

  componentDidCatch(error: Error) {
    // Report errors to overlay
    if (typeof window !== 'undefined' && window?.__IMA_HMR?.emit) {
      window.__IMA_HMR.emit('error', { error });
      this.setState({ hasError: true });
    }
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
