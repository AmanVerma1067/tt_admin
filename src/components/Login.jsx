import React, { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [user, setUser] = useState(''), [pass, setPass] = useState(''), [err, setErr] = useState();

  const submit = async e => {
    e.preventDefault();
    try {
      const token = await login(user, pass);
      onLogin(token);
    } catch (e) {
      setErr('Invalid credentials');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Admin Login</h2>
      {err && <div className="text-red-500">{err}</div>}
      <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" className="w-full p-2 mb-3 border rounded"/>
      <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="w-full p-2 mb-3 border rounded"/>
      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Sign In</button>
    </form>
  );
}
