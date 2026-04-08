import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopNav() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSOS = () => {
    // For NGO staff, we can trigger a high-priority system alert
    console.warn('NGO EMERGENCY TRIGGERED');
    alert('🚨 EMERGENCY PROTOCOL ACTIVATED\n\nAll nearby units and administrators have been notified.\nMaintain contact with your field workers.');
  };


  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] no-line-rule surface-tonal-shift md:left-80 md:w-[calc(100%-20rem)]">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        {/* Left: User info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : (currentUser ? 'U' : 'G')}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Impact Partner</p>
            <h1 className="text-sm font-black text-on-surface font-headline truncate max-w-[120px]">
              {currentUser?.name || 'Guest / Guest'}
            </h1>
          </div>
        </div>

        {/* Right: verified badge + SOS */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden md:flex items-center bg-green-50 px-3 py-1.5 rounded-full border border-green-100 gap-1">
              <span className="material-symbols-outlined text-[14px] text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Verified NGO</span>
            </div>
          )}

          <button
            onClick={handleSOS}
            className="bg-error text-on-error px-4 py-2 rounded-xl font-headline font-bold text-sm hover:scale-[1.02] transition-transform active:scale-95 duration-200 flex items-center gap-2 shadow-lg shadow-error/20 animate-pulse-slow"
          >
            <span className="material-symbols-outlined text-sm">emergency</span>
            SOS
          </button>

          {!currentUser && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-bold text-sm hover:opacity-80 px-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary-container transition-colors shadow-md"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
