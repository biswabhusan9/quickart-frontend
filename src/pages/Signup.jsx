import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getBackendUrl = () => {
  // Use environment variable or fallback
  return import.meta && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3001';
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${getBackendUrl()}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'user' }),
        credentials: 'include',
      });
      const data = response && response.ok ? await response.json() : null;
      if (response && response.ok) {
        setSuccess('Signup successful! Please sign in.');
        setTimeout(() => navigate('/login'), 1500);
      } else if (response) {
        setError(data?.error || 'Signup failed');
      } else {
        setError('Network error. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">Sign Up</h2>
        <p className="text-center text-gray-600 mb-6">Create your <span className="font-semibold text-red-500">QuicKart</span> account</p>
        {error && <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-4 text-center">{success}</div>}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup; 