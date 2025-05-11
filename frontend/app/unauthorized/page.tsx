"use client";

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go Back
            </button>
        </div>
    );
} 