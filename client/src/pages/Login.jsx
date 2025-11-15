import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const { data } = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = "/";

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "No account found or incorrect password.";

      setErrorMsg(message);
    }
  };

  return (
    <div className="bg-[#101726] p-6 rounded-2xl max-w-md mx-auto shadow-xl text-white mt-10">

      <h2 className="text-3xl font-bold mb-6">Login</h2>

      {/* Error Card */}
      {errorMsg && (
        <div className="bg-red-600/20 border border-red-400 text-red-300 p-4 rounded-xl mb-4 animate-fadeIn">
          <p className="font-semibold text-lg">⚠ Login Failed</p>
          <p className="text-sm mt-1">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          className="p-3 bg-[#161e32] rounded-lg border border-gray-700 text-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="p-3 bg-[#161e32] rounded-lg border border-gray-700 text-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        <button
          className="py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:opacity-90"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
