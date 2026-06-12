import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { KeyRound, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login, publicStats } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-gray-50">
      
      {/* Left side: Deep Red Panel (5/12 cols) */}
      <div className="lg:col-span-5 bg-[#7F0D0D] text-white p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/30 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10">
          {/* Logo */}
          <span className="text-3xl font-extrabold tracking-tighter block font-serif">DRIVEX</span>
          <span className="text-xs text-red-300 uppercase tracking-widest block font-bold -mt-1">Vehicle Services</span>
        </div>

        {/* Info Content */}
        <div className="my-12 relative z-10 space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase">
            ADMIN <br />
            CONTROL <br />
            PANEL
          </h2>
          <p className="text-red-100 text-sm leading-relaxed max-w-sm">
            Manage all service bookings, approve requests, update statuses and track your service center performance — all in one place.
          </p>

          {/* List features with bullets */}
          <ul className="space-y-4 text-xs font-semibold text-red-200">
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span>View & manage all customer bookings</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span>Approve, reject or mark as completed</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span>Manage service categories & types</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span>Dashboard metrics & daily overview</span>
            </li>
          </ul>
        </div>

        {/* Stats */}
        <div className="relative z-10 border-t border-red-800/60 pt-6 grid grid-cols-3 gap-4 text-center sm:text-left">
          <div>
            <span className="text-lg font-black block">{publicStats.totalCompleted || 0}+</span>
            <span className="text-[10px] text-red-300 uppercase font-bold tracking-wider">Total Bookings</span>
          </div>
          <div>
            <span className="text-lg font-black block">{publicStats.satisfactionPercent || 98}%</span>
            <span className="text-[10px] text-red-300 uppercase font-bold tracking-wider">Satisfaction</span>
          </div>
          <div>
            <span className="text-lg font-black block">{publicStats.serviceCount || 6}+</span>
            <span className="text-[10px] text-red-300 uppercase font-bold tracking-wider">Services</span>
          </div>
        </div>
      </div>

      {/* Right side: White Login Form (7/12 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-12 bg-white">
        <div className="text-right text-xs text-gray-400 font-semibold">
          <span>Secure Admin Access | DriveX</span>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          <div>
            <span className="text-red-600 font-bold uppercase tracking-wider text-xs block">Admin Portal</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1 uppercase tracking-tight">WELCOME BACK</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to access the DriveX admin dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded text-xs font-semibold flex items-center space-x-2">
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
              <input 
                type="text" 
                required 
                className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
              <input 
                type="password" 
                required 
                className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center space-x-2 text-gray-500 select-none cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-red-600 hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-3.5 rounded text-sm uppercase tracking-wider transition shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2"
            >
              <KeyRound size={16} />
              <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

        </div>

        <div className="text-center text-xs text-gray-400 font-semibold pt-6">
          <span>&copy; {new Date().getFullYear()} DriveX Vehicle Services. Admin Access Only.</span>
        </div>
      </div>

    </div>
  );
};

export default Login;
