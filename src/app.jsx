import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [token, setToken] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {token ? (
        <Dashboard token={token} onLogout={() => setToken(null)} />
      ) : (
        <Login onLogin={setToken} />
      )}
    </div>
  );
}
