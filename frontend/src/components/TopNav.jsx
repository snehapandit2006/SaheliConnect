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
 Jonah

  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] no-line-rule surface-tonal-shift md:left-80 md:w-[calc(100%-20rem)]">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        {/* Left: User info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'N'}
          </div>
          <div className="hidden sm:block">
            <h1 className="font-headline font-bold text-base text-[#016464] leading-tight">
              {currentUser?.name || 'NGO Dashboard'}
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">NGO Portal • सुरक्षित समुदाय</p>
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
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary-container transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
