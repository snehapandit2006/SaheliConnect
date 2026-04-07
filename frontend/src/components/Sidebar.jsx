import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Analytics', path: '/analytics', icon: 'query_stats' },
  { name: 'NGO Partners', path: '/ngo-partners', icon: 'corporate_fare' },
  { name: 'Report / Help', path: '/report', icon: 'description' },
  { name: 'WhatsApp Sim', path: '/simulator', icon: 'forum' },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-80 bg-[#fbf9f8] shadow-2xl z-50 rounded-r-[1.5rem] py-8 overflow-y-auto">
      <div className="px-8 mb-10">
        <h2 className="text-[#016464] text-2xl font-black font-headline tracking-tight">
          Saheli Connect
        </h2>
        <p className="text-zinc-500 font-medium text-xs mt-1">Impact Portal • प्रभाव पोर्टल</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              isActive
                ? "bg-[#eedcff] text-[#7348ab] rounded-xl mx-4 px-4 py-3 font-bold flex items-center gap-4 scale-[1.01] transition-transform"
                : "text-zinc-600 mx-4 px-4 py-3 hover:bg-[#f5f3f3] transition-colors rounded-xl flex items-center gap-4"
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-6 py-6 bg-surface-container-low mx-4 rounded-2xl border-t border-zinc-100 space-y-4">
        {currentUser && (
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 bg-error/10 text-error px-4 py-2 rounded-xl font-bold hover:bg-error/20 transition-colors">
            <span className="material-symbols-outlined text-sm pt-0.5">logout</span> Logout
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-800">Support Desk</p>
            <p className="text-[10px] text-zinc-500">Available 24/7</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
