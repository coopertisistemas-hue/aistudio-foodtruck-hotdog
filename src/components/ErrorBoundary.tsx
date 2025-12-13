import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-red-50 p-8 flex flex-col items-center justify-center text-red-900 z-50 overflow-auto">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                    <p className="mb-4 text-lg">We apologize for the inconvenience.</p>
                    <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full border border-red-200">
                        <h2 className="font-semibold mb-2 text-xl border-b pb-2 text-red-700">Error Details:</h2>
                        <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96">
                            {this.state.error?.toString()}
                        </pre>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
