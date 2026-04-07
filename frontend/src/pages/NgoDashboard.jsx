import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCases, getAnalytics } from '../api';

const categoryIcon = { protection: 'security', mental_health: 'psychology', health_hygiene: 'medical_services', skill_development: 'work', general: 'assignment' };
const categoryLabel = { protection: 'Safety & Protection', mental_health: 'Mental Health', health_hygiene: 'Health & Hygiene', skill_development: 'Skill Development', general: 'General Inquiry' };
const priorityStyle = {
  urgent: { badge: 'bg-error text-white', iconBg: 'bg-[#ffdad6]', iconColor: 'text-error' },
  moderate: { badge: 'bg-secondary-fixed text-secondary', iconBg: 'bg-secondary-fixed', iconColor: 'text-secondary' },
  low: { badge: 'bg-zinc-100 text-zinc-500', iconBg: 'bg-primary-fixed-dim', iconColor: 'text-primary' },
};
const statusLabel = { reported: 'Reported', 'in-progress': 'In Progress', resolved: 'Resolved' };
const progressBars = { reported: [true, false, false], 'in-progress': [true, true, false], resolved: [true, true, true] };

function timeAgo(dateStr) {
  const s = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} mins ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

function Skeleton() {
  return (
    <div className="px-6 md:px-10 space-y-8 animate-pulse">
      <div><div className="h-8 bg-zinc-200 rounded-lg w-64 mb-2" /><div className="h-4 bg-zinc-100 rounded w-80" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-white p-6 rounded-[1.5rem] h-36"><div className="w-10 h-10 bg-zinc-100 rounded-full mb-4" /><div className="h-3 bg-zinc-100 rounded w-20 mb-2" /><div className="h-8 bg-zinc-200 rounded w-16" /></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white p-5 rounded-[1.5rem] h-36" />)}</div>
        <div className="space-y-4"><div className="bg-zinc-100 rounded-[1.5rem] h-48" /><div className="bg-white rounded-[1.5rem] h-64" /></div>
      </div>
    </div>
  );
}

export default function NgoDashboard() {
  const [cases, setCases] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getCases(), getAnalytics()])
      .then(([c, a]) => { setCases(c); setAnalytics(a); setError(null); })
      .catch(e => setError(e.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  if (loading) return <Skeleton />;
  if (error) return (
    <div className="px-6 md:px-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="material-symbols-outlined text-6xl text-error mb-4">cloud_off</span>
      <h2 className="font-headline text-2xl font-bold text-zinc-800 mb-2">Connection Error</h2>
      <p className="text-zinc-500 mb-6 max-w-md">{error}. Make sure the backend is running on port 8000.</p>
      <button onClick={fetchData} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-container transition-colors flex items-center gap-2">
        <span className="material-symbols-outlined">refresh</span> Retry
      </button>
    </div>
  );

  const active = analytics ? analytics.total - analytics.resolved : 0;
  const resolved = analytics?.resolved || 0;
  const urgent = analytics?.urgent || 0;
  const urgencyPct = analytics?.total > 0 ? Math.round((urgent / analytics.total) * 100) : 0;
  const pending = cases.filter(c => c.status !== 'resolved');
  const recentWeek = cases.filter(c => (Date.now() - new Date(c.created_at)) < 7 * 86400000).length;

  return (
    <div className="px-6 md:px-10 space-y-8">
      <section>
        <h2 className="font-headline text-3xl font-extrabold text-zinc-900 tracking-tight">Impact Overview</h2>
        <p className="text-zinc-500 font-medium tracking-wide text-sm">Monitoring community safety and empowerment. <span className="text-secondary/80 italic ml-2">प्रगति की निगरानी करें।</span></p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"><span className="material-symbols-outlined">assignment</span></div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Active Cases</p>
          <p className="text-3xl font-black text-primary mt-1">{active}</p>
          <div className="mt-2 text-[10px] text-green-600 font-bold bg-green-50 w-fit px-2 py-0.5 rounded-full">+{recentWeek} this week</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white/50">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4"><span className="material-symbols-outlined">done_all</span></div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Resolved</p>
          <p className="text-3xl font-black text-secondary mt-1">{resolved}</p>
          <div className="mt-2 text-[10px] text-zinc-400 font-medium italic">All time impact</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white/50 lg:col-span-2 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Urgency Index</p>
            <p className="text-3xl font-black text-error mt-1">{urgencyPct}%</p>
            <p className="text-xs text-zinc-400 mt-2 max-w-[200px]">{urgent} high-priority case{urgent !== 1 ? 's' : ''} require{urgent === 1 ? 's' : ''} immediate attention.</p>
            <Link to="/analytics" className="mt-4 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">View Priority List <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500"><span className="material-symbols-outlined text-[120px]">emergency_share</span></div>
        </div>
      </section>

      {/* Cases + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-zinc-800">Pending Actions ({pending.length})</h3>
          </div>
          <div className="space-y-4">
            {pending.length === 0 && (
              <div className="bg-surface-container-lowest p-8 rounded-[1.5rem] text-center">
                <span className="material-symbols-outlined text-4xl text-zinc-300 mb-2">task_alt</span>
                <p className="text-zinc-400 font-medium">No pending cases. All clear!</p>
              </div>
            )}
            {pending.slice(0, 10).map(c => {
              const ps = priorityStyle[c.priority] || priorityStyle.low;
              const pb = progressBars[c.status] || [false,false,false];
              return (
                <Link to={`/case/${c.id}`} key={c.id} className="block bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${ps.iconBg} flex items-center justify-center ${ps.iconColor}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{categoryIcon[c.category] || 'assignment'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-zinc-900 font-headline">ID #{c.id}</h4>
                          <span className={`px-2 py-0.5 rounded-full ${ps.badge} text-[10px] font-black uppercase tracking-wider`}>{c.priority}</span>
                        </div>
                        <p className="text-sm text-zinc-600 mt-0.5">{categoryLabel[c.category] || 'General'} • {c.location || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-400 font-bold tracking-wider">{(statusLabel[c.status] || c.status).toUpperCase()}</p>
                      <p className="text-xs font-bold text-zinc-800">{timeAgo(c.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {pb.map((filled, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${filled ? 'bg-primary' : 'bg-zinc-100'}`} />)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-400 italic truncate max-w-[60%]">{c.description}</p>
                    <span className="text-primary text-xs font-bold group-hover:underline">View Details →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <aside className="space-y-8">
          <div className="bg-surface-container-low p-2 rounded-[1.75rem] overflow-hidden">
            <div className="relative h-48 w-full rounded-[1.5rem] bg-zinc-200 overflow-hidden group">
              <img alt="Map" className="w-full h-full object-cover grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu2X9lD05HF1L-IZ4A3KvCX0tahC_IRWPR4wqCDUMWYUSpxm9i12Be6ezjRO2zllc7jWl36IVU7m8uSxfoIEF96VyYMJBoOW1Tv2xwHhnu-7dNbzlglLUpnVprHru6lWs_htgfazHarCSY1V8bjwHTzGD1iazWyOI18GZB0MHRHrFU3YLMrtnYn0MMajZUJOLgNTNv2LfG8Z5cBcJD-433xrw5AW-6QbJ0iVXxUkH_Wom6o1nMypbvFO8NlGLAc_wh6XIrfoC-VA" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative"><div className="absolute -inset-2 bg-error/20 rounded-full animate-ping" /><div className="w-4 h-4 bg-error rounded-full border-2 border-white shadow-xl relative z-10" /></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 glass-panel bg-white/60 p-3 rounded-xl flex items-center justify-between pointer-events-none">
                <p className="text-[10px] font-bold text-zinc-800">Real-time Map View</p>
                <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-white rounded-full">{urgent} Alerts</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm">
            <h4 className="font-headline font-bold text-zinc-800 mb-6 flex items-center justify-between">Recent Cases {urgent > 0 && <span className="w-2 h-2 bg-error rounded-full" />}</h4>
            <div className="space-y-6">
              {cases.slice(0, 3).map(c => (
                <Link to={`/case/${c.id}`} key={c.id} className="flex gap-3 hover:opacity-80 transition-opacity">
                  <div className={`w-1.5 h-10 rounded-full ${c.priority === 'urgent' ? 'bg-error' : c.priority === 'moderate' ? 'bg-secondary' : 'bg-primary'}`} />
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{categoryLabel[c.category] || 'General'}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{c.description}</p>
                    <p className="text-[9px] text-zinc-400 mt-1 uppercase font-black">{timeAgo(c.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
