import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email.trim(), password.trim());
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mb-4 relative inline-block">
          <div className="absolute -inset-4 bg-primary-fixed/30 blur-3xl rounded-full" />
          <div className="relative bg-primary-fixed w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>supervised_user_circle</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">NGO Portal</h2>
        <p className="text-zinc-500 mt-2 font-medium">Sign in to manage and respond to cases.</p>
        <p className="text-secondary font-bold text-sm">प्रवेश करें</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-outline-variant/20">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">error</span> {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">mail</span>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="admin@ngo.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">lock</span>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-2xl font-bold font-headline shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Authenticating...</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>login</span> Secure Login</>
              )}
            </button>
          </form>
          
          <div className="mt-6 border-t border-outline-variant/20 pt-6">
            <p className="text-center text-xs text-zinc-400 leading-relaxed font-medium">
              This area is restricted to authorized NGO partners only. Public users should use the Report page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
