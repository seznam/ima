import React from 'react';

/**
 * Error boundary wrapper which connects the IMA application to the
 * dev HMR api and handles error reporting.
 */
export default class ErrorBoundary extends React.PureComponent {
  constructor(props) {
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

  componentDidCatch(error) {
    this.setState({ hasError: true });

    // Report errors to overlay
    if (typeof window !== 'undefined' && window?.__IMA_HMR?.emit) {
      window.__IMA_HMR.emit('error', { error, type: 'runtime' });
    }
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
