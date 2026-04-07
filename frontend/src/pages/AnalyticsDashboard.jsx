import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics, getCases, getNgos, getTimeSeries } from '../api';

const categoryLabel = { protection: 'Safety & Protection', mental_health: 'Mental Health', health_hygiene: 'Health & Hygiene', skill_development: 'Skill Development', general: 'General Inquiry' };
const priorityColor = { urgent: 'bg-error', moderate: 'bg-secondary', low: 'bg-primary' };
const priorityLabel = { urgent: 'CRITICAL', moderate: 'ACTIVE', low: 'MINOR' };
const priorityTextColor = { urgent: 'text-error', moderate: 'text-secondary', low: 'text-primary' };

function timeAgo(d) { const s = Math.floor((Date.now() - new Date(d)) / 1000); if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s/60)} mins ago`; if (s < 86400) return `${Math.floor(s/3600)} hours ago`; return `${Math.floor(s/86400)} days ago`; }

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [cases, setCases] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeSeries, setTimeSeries] = useState(null);

  const fetchData = () => {
    if (!analytics) setLoading(true);
    Promise.all([getAnalytics(), getCases(), getNgos(), getTimeSeries()])
      .then(([a, c, n, t]) => { 
        setAnalytics(a); 
        setCases(c); 
        setNgos(n); 
        setTimeSeries(t.trends);
        setError(null); 
      })
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { 
    fetchData(); 
    const interval = setInterval(() => {
      Promise.all([getAnalytics(), getCases(), getNgos(), getTimeSeries()])
        .then(([a, c, n, t]) => { 
          setAnalytics(a); 
          setCases(c); 
          setNgos(n); 
          setTimeSeries(t.trends);
          setError(null); 
        })
        .catch(console.error);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="px-6 md:px-12 py-8 animate-pulse space-y-8"><div className="h-12 bg-zinc-200 rounded w-64" /><div className="grid grid-cols-4 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-2xl" />)}</div></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <span className="material-symbols-outlined text-6xl text-error mb-4">cloud_off</span>
      <h2 className="font-headline text-2xl font-bold mb-2">Connection Error</h2>
      <p className="text-zinc-500 mb-6">{error}</p>
      <button onClick={fetchData} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><span className="material-symbols-outlined">refresh</span> Retry</button>
    </div>
  );

  const resRate = analytics.total > 0 ? ((analytics.resolved / analytics.total) * 100).toFixed(1) : 0;
  const catCounts = cases.reduce((acc, c) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; }, {});

  return (
    <div className="px-6 md:px-12 py-8 w-full">
      <section className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-2 font-headline">Impact Analytics</h1>
        <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed">Real-time monitoring of safety interventions and community support metrics.</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-primary-fixed font-medium mb-1">Total Cases Reported</p>
            <h3 className="text-6xl font-black mb-4 font-headline">{analytics.total.toLocaleString()}</h3>
            <div className="flex items-center gap-2 text-primary-fixed bg-white/10 w-fit px-3 py-1 rounded-full text-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>{analytics.in_progress} in progress</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20 transition-transform group-hover:scale-110 duration-700"><span className="material-symbols-outlined text-[12rem]">analytics</span></div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_40px_40px_-15px_rgba(27,28,28,0.06)] flex flex-col justify-between border-t-4 border-secondary">
          <div><p className="text-zinc-500 font-medium mb-1">Resolution Rate</p><h3 className="text-4xl font-black text-on-surface font-headline">{resRate}%</h3></div>
          <div className="w-full bg-secondary-fixed h-3 rounded-full overflow-hidden mt-4"><div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: `${resRate}%` }} /></div>
          <p className="text-xs text-zinc-400 mt-4">{analytics.resolved} of {analytics.total} cases resolved</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_40px_40px_-15px_rgba(27,28,28,0.06)] flex flex-col justify-between">
          <div><p className="text-zinc-500 font-medium mb-1">Active NGO Partners</p><h3 className="text-4xl font-black text-on-surface font-headline">{ngos.length}</h3></div>
          <div className="flex -space-x-3 mt-4">
            {ngos.slice(0, 3).map((n, i) => (
              <div key={n.id} className="w-8 h-8 rounded-full bg-primary-fixed-dim border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">{n.name.charAt(0)}</div>
            ))}
            {ngos.length > 3 && <div className="w-8 h-8 rounded-full bg-primary-fixed-dim border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">+{ngos.length - 3}</div>}
          </div>
          <p className="text-xs text-secondary font-bold mt-4">Across {new Set(ngos.map(n => n.location)).size} regions</p>
        </div>
      </section>

      {/* Backend Time-Series Trends */}
      <section className="mb-12">
        <h4 className="text-xl font-bold text-on-surface font-headline mb-6">7-Day Incident Trends</h4>
        {timeSeries && (
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {timeSeries.map((t, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/20 text-center">
                <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">
                  {new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="bg-primary/10 rounded overflow-hidden">
                    <p className="text-sm font-black text-primary p-1" title={`${t.reported} Reported`}>{t.reported}</p>
                  </div>
                  <div className="bg-secondary/10 rounded overflow-hidden">
                    <p className="text-sm font-bold text-secondary p-1" title={`${t.resolved} Resolved`}>{t.resolved}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Category + NGO Performance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-8">
          <h4 className="text-xl font-bold text-on-surface font-headline mb-6">Case Distribution by Category</h4>
          <div className="space-y-4">
            {Object.entries(catCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-4">
                <span className="text-sm font-bold w-40 truncate">{categoryLabel[cat] || cat}</span>
                <div className="flex-1 bg-surface-container h-4 rounded-full overflow-hidden"><div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${(count / cases.length) * 100}%` }} /></div>
                <span className="text-sm font-black text-primary w-10 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_40px_40px_-15px_rgba(27,28,28,0.06)]">
          <h4 className="text-xl font-bold text-on-surface mb-6 font-headline">NGO Performance</h4>
          <div className="space-y-6">
            {ngos.map(n => {
              const ngoCases = cases.filter(c => c.ngo_id === n.id);
              const ngoResolved = ngoCases.filter(c => c.status === 'resolved').length;
              const rate = ngoCases.length > 0 ? Math.round((ngoResolved / ngoCases.length) * 100) : 0;
              return (
                <div key={n.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{n.name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1"><span className="text-sm font-bold opacity-90">{n.name}</span><span className="text-sm text-primary font-black">{rate}%</span></div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full"><div className="bg-primary h-full rounded-full" style={{ width: `${rate}%` }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/ngo-partners" className="block w-full mt-8 py-3 rounded-xl border border-outline-variant text-zinc-600 font-bold hover:bg-surface-container-low transition-colors text-center">View All Partners</Link>
        </div>
      </section>

      {/* Activity Stream */}
      <section className="bg-surface-container-low rounded-3xl p-8 mb-12">
        <h4 className="text-2xl font-black text-on-surface font-headline mb-8">Recent Activity Stream</h4>
        <div className="space-y-4">
          {cases.slice(0, 6).map(c => (
            <Link to={`/case/${c.id}`} key={c.id} className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-6 shadow-sm hover:translate-x-2 transition-transform cursor-pointer">
              <div className={`w-2 h-12 ${priorityColor[c.priority] || 'bg-zinc-300'} rounded-full`} />
              <div className="flex-1">
                <h5 className="font-bold text-lg font-headline">{categoryLabel[c.category] || c.category}</h5>
                <p className="text-sm text-zinc-500">{c.location || 'Unknown location'} {c.ngo ? `• NGO: ${c.ngo.name}` : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{timeAgo(c.created_at)}</p>
                <span className={`text-[10px] uppercase tracking-widest ${priorityTextColor[c.priority] || 'text-zinc-500'} font-black`}>{priorityLabel[c.priority] || c.priority}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
