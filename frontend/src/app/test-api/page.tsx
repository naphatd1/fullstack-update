'use client';

import { useState, useEffect } from 'react';

export default function TestApiPage() {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API URL:', `${API_URL}/health`);
        
        const response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApiStatus(data);
          console.log('API Response:', data);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}</div>
            <div>API_URL: {API_URL}</div>
            <div>Test URL: {API_URL}/health</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Health Check</h2>
          
          {loading && (
            <div className="text-blue-600">Loading...</div>
          )}
          
          {error && (
            <div className="text-red-600">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {apiStatus && (
            <div className="text-green-600">
              <strong>Success!</strong>
              <pre className="mt-2 bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(apiStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Test
          </button>
        </div>
      </div>
    </div>
  );
}