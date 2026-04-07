import React, { useState, useEffect } from 'react';
import { getNgos, getCases } from '../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Dummy coordinates for the seeded locations (assumed Delhi regions)
const locationCoords = {
  'North District': [28.7041, 77.1025],
  'South District': [28.5355, 77.2642],
  'East District': [28.6258, 77.2917],
  'West District': [28.6502, 77.0601]
};

const serviceLabel = { protection: 'Protection', shelter: 'Shelter', mental_health: 'Mental Health', counseling: 'Counseling', skill_development: 'Skill Dev', job: 'Jobs', study: 'Education', health_hygiene: 'Health', medical: 'Medical' };
const serviceIcon = (services) => {
  if (services.includes('protection')) return 'shield';
  if (services.includes('mental_health') || services.includes('counseling')) return 'psychology';
  if (services.includes('health') || services.includes('medical')) return 'healing';
  if (services.includes('skill') || services.includes('job')) return 'work';
  return 'volunteer_activism';
};
const serviceIconBg = (services) => {
  if (services.includes('protection')) return 'bg-[#ffdad6] text-error';
  if (services.includes('mental_health') || services.includes('counseling')) return 'bg-secondary-fixed text-secondary';
  if (services.includes('health') || services.includes('medical')) return 'bg-primary-fixed-dim text-primary';
  return 'bg-primary-fixed text-primary';
};

export default function NgoManagement() {
  const [ngos, setNgos] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getNgos(), getCases()])
      .then(([n, c]) => { setNgos(n); setCases(c); })
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="px-4 md:px-12 py-8 animate-pulse space-y-8"><div className="h-12 bg-zinc-200 rounded w-72" /><div className="grid grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-60 bg-white rounded-2xl" />)}</div></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <span className="material-symbols-outlined text-6xl text-error mb-4">cloud_off</span>
      <h2 className="font-headline text-2xl font-bold mb-2">Failed to Load</h2>
      <p className="text-zinc-500 mb-6">{error}</p>
    </div>
  );

  const totalServices = ngos.reduce((sum, n) => sum + n.services_offered.split(',').length, 0);
  const regions = [...new Set(ngos.map(n => n.location))];

  return (
    <div className="px-4 md:px-12 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">NGO Partner Network</h1>
          <p className="text-zinc-600 font-medium text-lg leading-relaxed max-w-2xl">
            Manage and monitor our trusted NGO partners.{' '}
            <span className="text-secondary font-bold">विश्वसनीय एनजीओ सहयोगियों का प्रबंधन करें।</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Stats */}
        <div className="lg:col-span-4 bg-white p-8 rounded-2xl shadow-[0_40px_40px_-15px_rgba(27,28,28,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-4">Network Overview</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-primary">{ngos.length}</span>
              <span className="text-zinc-400 font-bold">Verified NGOs</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
              <span className="font-bold">Active Services</span>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">{totalServices} Total</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
              <span className="font-bold">Coverage Regions</span>
              <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">{regions.length} Areas</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
              <span className="font-bold">Total Capacity</span>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">{ngos.reduce((s, n) => s + n.capacity, 0)} People</span>
            </div>
          </div>
        </div>

        {/* Coverage Map */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-1 overflow-hidden relative group min-h-[400px]">
          <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent z-[400] p-6 flex flex-col pointer-events-none rounded-t-2xl">
            <h3 className="text-white text-2xl font-bold font-headline">Coverage Areas • कवरेज क्षेत्र</h3>
            <p className="text-white/80 text-sm">Expanding safety networks across {regions.length} regions.</p>
          </div>
          
          <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden relative z-0">
            <MapContainer center={[28.6139, 77.2090]} zoom={10} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {ngos.map(ngo => {
                const coords = locationCoords[ngo.location] || [28.6139 + (Math.random()-0.5)*0.1, 77.2090 + (Math.random()-0.5)*0.1];
                return (
                  <Marker key={ngo.id} position={coords}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="block text-primary font-bold mb-1">{ngo.name}</strong>
                        <span className="text-xs text-zinc-500">{ngo.location}</span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* NGO Cards */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map(ngo => {
            const services = ngo.services_offered.split(',');
            const ngoCases = cases.filter(c => c.ngo_id === ngo.id);
            const resolved = ngoCases.filter(c => c.status === 'resolved').length;
            return (
              <div key={ngo.id} className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${serviceIconBg(ngo.services_offered)}`}>
                    <span className="material-symbols-outlined text-3xl">{serviceIcon(ngo.services_offered)}</span>
                  </div>
                  <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-1 font-headline">{ngo.name}</h4>
                <p className="text-zinc-500 text-sm mb-2">{ngo.location} • Capacity: {ngo.capacity}</p>
                <p className="text-xs text-zinc-400 mb-4">📞 {ngo.contact_info}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {services.map(s => <span key={s} className="bg-surface-container-low px-3 py-1 rounded-lg text-xs font-semibold text-zinc-600">{serviceLabel[s.trim()] || s.trim()}</span>)}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-surface-container h-1.5 rounded-full"><div className="bg-primary h-full rounded-full" style={{ width: `${ngoCases.length > 0 ? (resolved / ngoCases.length) * 100 : 0}%` }} /></div>
                  <span className="text-xs font-bold text-zinc-500">{resolved}/{ngoCases.length} resolved</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-400">ID: {ngo.id}</span>
                  <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Profile <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
