import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Optionally log error
    // console.error(error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
          <h2 className="text-2xl font-bold text-orange mb-2">Something went wrong.</h2>
          <button onClick={this.handleReload} className="mt-4 px-4 py-2 bg-orange text-white rounded shadow hover:bg-orange-dark transition">Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
} 