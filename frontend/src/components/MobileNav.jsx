import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'home' },
  { name: 'Report', path: '/report', icon: 'edit_note' },
  { name: 'Stats', path: '/analytics', icon: 'leaderboard' },
  { name: 'Chat', path: '/simulator', icon: 'forum' },
];

export default function MobileNav() {
  const auth = useAuth() || {};
  const { currentUser, logout } = auth;
  const navigate = useNavigate();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl rounded-t-[1.5rem] z-50 flex justify-around items-center px-4 pb-6 pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] no-line-rule">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end
          className={({ isActive }) =>
            isActive
              ? "flex flex-col items-center justify-center bg-[#016464] text-white rounded-[1.25rem] px-5 py-2.5 active:scale-90 transition-all font-body text-[11px] font-medium leading-[1.6]"
              : "flex flex-col items-center justify-center text-zinc-500 py-2.5 active:scale-90 transition-all font-body text-[11px] font-medium leading-[1.6]"
          }
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              <span className="mt-1">{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
      
      {currentUser ? (
        <button onClick={() => { logout(); navigate('/login'); }} className="flex flex-col items-center justify-center text-error py-2.5 active:scale-90 transition-all font-body text-[11px] font-medium leading-[1.6]">
          <span className="material-symbols-outlined">logout</span>
          <span className="mt-1">Logout</span>
        </button>
      ) : (
        <button onClick={() => navigate('/login')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 active:scale-90 transition-all font-body text-[11px] font-medium leading-[1.6]">
          <span className="material-symbols-outlined">login</span>
          <span className="mt-1">Admin</span>
        </button>
      )}
    </footer>
  );
}
