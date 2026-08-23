"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Top-level client error boundary. Without this, an unexpected render-time
 * exception (e.g. a malformed AnalysisResult shape from a future API change)
 * would blank the entire page with no recovery path for the user.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || "Something went wrong." };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card border-red-200 bg-red-50">
          <h3 className="font-semibold text-red-700 mb-2">Something went wrong</h3>
          <p className="text-sm text-red-600 mb-4">{this.state.message}</p>
          <button className="btn-secondary text-sm" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
