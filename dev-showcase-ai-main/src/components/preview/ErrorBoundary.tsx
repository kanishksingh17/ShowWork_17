"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  X,
  Bug,
  FileText,
  Send,
  Copy,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  Shield,
  AlertCircle,
} from "lucide-react";
import {
  ErrorBoundaryState,
  ErrorBoundaryProps,
} from "../../lib/preview/types";

interface ErrorBoundaryComponentState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  lastError: Date | null;
  showDetails: boolean;
  errorId: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryComponentState
> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastError: null,
      showDetails: false,
      errorId: "",
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<ErrorBoundaryComponentState> {
    return {
      hasError: true,
      error,
      lastError: new Date(),
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
      retryCount: this.state.retryCount + 1,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
    };

    // In a real app, you would send this to your error reporting service
    console.log("Error Report:", errorReport);
  };

  private handleRetry = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    // Clear the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Force a re-render of the component tree
    this.forceUpdate();
  };

  private handleDismiss = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private handleToggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  private handleCopyError = () => {
    const errorText = `
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
Timestamp: ${this.state.lastError?.toISOString()}
Retry Count: ${this.state.retryCount}
    `.trim();

    navigator.clipboard
      .writeText(errorText)
      .then(() => {
        // Show a brief success message
        console.log("Error details copied to clipboard");
      })
      .catch(() => {
        console.error("Failed to copy error details");
      });
  };

  private handleDownloadError = () => {
    const errorData = {
      id: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: this.state.lastError?.toISOString(),
      retryCount: this.state.retryCount,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(errorData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `error-report-${this.state.errorId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error!}
          retry={this.handleRetry}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          lastError={this.state.lastError}
          showDetails={this.state.showDetails}
          onToggleDetails={this.handleToggleDetails}
          onDismiss={this.handleDismiss}
          onCopyError={this.handleCopyError}
          onDownloadError={this.handleDownloadError}
          errorId={this.state.errorId}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  retry: () => void;
  errorInfo?: ErrorInfo | null;
  retryCount: number;
  lastError: Date | null;
  showDetails: boolean;
  onToggleDetails: () => void;
  onDismiss: () => void;
  onCopyError: () => void;
  onDownloadError: () => void;
  errorId: string;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  retry,
  errorInfo,
  retryCount,
  lastError,
  showDetails,
  onToggleDetails,
  onDismiss,
  onCopyError,
  onDownloadError,
  errorId,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Preview Error
              </h1>
              <p className="text-sm text-gray-600">
                Something went wrong while rendering the preview
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Error Message
                </h3>
                <p className="text-sm text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>

          {/* Error Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Error ID:</span>
                <span className="ml-2 font-mono text-gray-900">{errorId}</span>
              </div>
              <div>
                <span className="text-gray-600">Retry Count:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {retryCount}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 text-gray-900">
                  {lastError?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Component:</span>
                <span className="ml-2 text-gray-900">Preview Component</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={retry}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>

              <button
                onClick={onToggleDetails}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Bug className="w-4 h-4" />
                <span>{showDetails ? "Hide" : "Show"} Details</span>
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Error Details Panel */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Error Details
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={onCopyError}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={onDownloadError}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Stack Trace */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Stack Trace
                    </h5>
                    <pre className="text-xs text-gray-700 bg-gray-50 p-3 rounded border overflow-x-auto">
                      {error.stack}
                    </pre>
                  </div>

                  {/* Component Stack */}
                  {errorInfo?.componentStack && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Component Stack
                      </h5>
                      <pre className="text-xs text-gray-700 bg-gray-50 p-3 rounded border overflow-x-auto">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Error Boundary</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>Auto Recovery</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Info className="w-4 h-4" />
              <span>This error has been logged</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Hook for functional components
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

export default ErrorBoundary;
