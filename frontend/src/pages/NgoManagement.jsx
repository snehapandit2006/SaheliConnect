import React, { useState, useEffect } from 'react';
import { getNgos, getCases, getFieldWorkers, addWorker, deleteWorker, updateNgoProfile } from '../api';
import { useAuth } from '../context/AuthContext';

// Dummy coordinates for the seeded locations (assumed Delhi regions)
const locationCoords = {
  'North District': { lat: 28.7041, lng: 77.1025 },
  'South District': { lat: 28.5355, lng: 77.2642 },
  'East District':  { lat: 28.6258, lng: 77.2917 },
  'Central District': { lat: 28.6139, lng: 77.2090 },
};

const serviceLabel = {
  protection: 'Protection', shelter: 'Shelter', mental_health: 'Mental Health',
  counseling: 'Counseling', skill_development: 'Skill Dev', job: 'Jobs',
  study: 'Education', health_hygiene: 'Health', medical: 'Medical',
};
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

// Build OpenStreetMap iframe URL centered on Delhi
function buildMapUrl(ngos) {
  const base = 'https://www.openstreetmap.org/export/embed.html';
  return `${base}?bbox=76.80,28.40,77.60,28.90&layer=mapnik`;
}

export default function NgoManagement() {
  const [ngos, setNgos] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNgo, setSelectedNgo] = useState(null);

  const { currentUser } = useAuth();
  const [myWorkers, setMyWorkers] = useState([]);
  const [workerForm, setWorkerForm] = useState({ name: '', phone_number: '' });
  const [addingWorker, setAddingWorker] = useState(false);
  const [profileForm, setProfileForm] = useState({ contact_info: '', capacity: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    const p = [getNgos(), getCases()];
    if (currentUser?.id) p.push(getFieldWorkers(currentUser.id));
    
    Promise.all(p)
      .then((results) => { 
        setNgos(results[0]); 
        setCases(results[1]); 
        if (results[2]) setMyWorkers(results[2]);
        
        // initialize profile form
        const me = results[0].find(n => n.id === currentUser?.id);
        if (me) setProfileForm({ contact_info: me.contact_info, capacity: me.capacity });
      })
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [currentUser]);

  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!workerForm.name || !workerForm.phone_number) return;
    setAddingWorker(true);
    try {
      const newWorker = await addWorker({ ...workerForm, ngo_id: currentUser.id });
      setMyWorkers([newWorker, ...myWorkers]);
      setWorkerForm({ name: '', phone_number: '' });
    } catch(err) { alert('Failed to add worker'); }
    finally { setAddingWorker(false); }
  };

  const handleDeleteWorker = async (workerId) => {
    if(!window.confirm('Delete this field worker?')) return;
    try {
      await deleteWorker(workerId);
      setMyWorkers(myWorkers.filter(w => w.id !== workerId));
    } catch(err) { alert('Failed to delete worker'); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateNgoProfile({ contact_info: profileForm.contact_info, capacity: parseInt(profileForm.capacity) });
      const n = await getNgos(); // reload to get new stats locally
      setNgos(n);
      alert('Profile updated successfully!');
    } catch(err) { alert('Failed to update profile'); }
    finally { setUpdatingProfile(false); }
  };

  if (loading) return (
    <div className="px-4 md:px-12 py-8 animate-pulse space-y-8">
      <div className="h-12 bg-zinc-200 rounded w-72" />
      <div className="grid grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-60 bg-white rounded-2xl" />)}</div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <span className="material-symbols-outlined text-6xl text-error mb-4">cloud_off</span>
      <h2 className="font-headline text-2xl font-bold mb-2">Failed to Load</h2>
      <p className="text-zinc-500 mb-6">{error}</p>
      <button onClick={fetchData} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
        <span className="material-symbols-outlined">refresh</span> Retry
      </button>
    </div>
  );

  const totalServices = ngos.reduce((sum, n) => sum + n.services_offered.split(',').length, 0);
  const regions = [...new Set(ngos.map(n => n.location))];

  return (
    <div className="px-4 md:px-12 py-8 pb-20 space-y-12">
      {/* My NGO Admin Panel */}
      {currentUser && (
        <section className="bg-surface-container-low rounded-3xl p-8 border border-primary/20 shadow-lg">
          <div className="flex items-center gap-3 mb-8 border-b border-primary/10 pb-4">
            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
            <h2 className="text-3xl font-black font-headline text-on-surface">Manage My NGO</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Updater */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-zinc-800"><span className="material-symbols-outlined text-secondary">update</span> Update Profile Details</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Contact / Helplines</label>
                  <input type="text" value={profileForm.contact_info} onChange={e => setProfileForm({...profileForm, contact_info: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Max Bed/Service Capacity</label>
                  <input type="number" value={profileForm.capacity} onChange={e => setProfileForm({...profileForm, capacity: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                <button disabled={updatingProfile} className="w-full bg-secondary text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 hover:bg-secondary-container hover:text-on-secondary-container transition-colors">
                  {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Manage Workers */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col h-[320px]">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-zinc-800"><span className="material-symbols-outlined text-primary">group_add</span> Field Worker Roster</h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4">
                {myWorkers.length === 0 && <p className="text-xs text-zinc-400 italic">No workers assigned to your NGO yet.</p>}
                {myWorkers.map(w => (
                  <div key={w.id} className="flex justify-between items-center bg-surface-container px-4 py-2.5 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-zinc-800">{w.name}</p>
                      <p className="text-xs text-zinc-500 font-mono">{w.phone_number}</p>
                    </div>
                    <button onClick={() => handleDeleteWorker(w.id)} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors" title="Remove Worker">
                      <span className="material-symbols-outlined text-[18px]">person_remove</span>
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddWorker} className="flex gap-2 pt-4 border-t border-zinc-100">
                <input type="text" placeholder="Name" value={workerForm.name} onChange={e => setWorkerForm({...workerForm, name: e.target.value})} className="flex-1 min-w-[20px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" required/>
                <input type="text" placeholder="Phone" value={workerForm.phone_number} onChange={e => setWorkerForm({...workerForm, phone_number: e.target.value})} className="flex-1 min-w-[20px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" required/>
                <button disabled={addingWorker} className="bg-primary text-white p-2 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Network Directory */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">NGO Partner Network</h1>
          <p className="text-zinc-600 font-medium text-lg leading-relaxed max-w-2xl">
            Manage and monitor our trusted NGO partners.{' '}
            <span className="text-secondary font-bold">विश्वसनीय एनजीओ सहयोगियों का प्रबंधन करें।</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
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

        {/* Coverage Map — OpenStreetMap iframe, no react-leaflet */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-2xl overflow-hidden relative group min-h-[380px]">
          <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent z-10 p-6 flex flex-col pointer-events-none rounded-t-2xl">
            <h3 className="text-white text-2xl font-bold font-headline">Coverage Areas • कवरेज क्षेत्र</h3>
            <p className="text-white/80 text-sm">Safety networks across {regions.length} regions in Delhi-NCR.</p>
          </div>

          {/* NGO Pin Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 space-y-2 shadow-lg pointer-events-none">
            {ngos.map(ngo => {
              const coords = locationCoords[ngo.location];
              return (
                <div key={ngo.id} className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                  <span className="w-3 h-3 bg-primary rounded-full flex-shrink-0" />
                  <span>{ngo.name}</span>
                  {coords && <span className="text-zinc-400 font-normal">— {ngo.location}</span>}
                </div>
              );
            })}
          </div>

          <iframe
            title="NGO Coverage Map"
            src={buildMapUrl(ngos)}
            className="w-full h-full min-h-[380px] border-0"
            allowFullScreen
          />
        </div>
      </div>

      {/* NGO Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ngos.map(ngo => {
          const services = ngo.services_offered.split(',');
          const ngoCases = cases.filter(c => c.ngo_id === ngo.id);
          const resolved = ngoCases.filter(c => c.status === 'resolved').length;
          const active = ngoCases.filter(c => c.status !== 'resolved').length;
          const resRate = ngoCases.length > 0 ? Math.round((resolved / ngoCases.length) * 100) : 0;

          return (
            <div
              key={ngo.id}
              onClick={() => setSelectedNgo(selectedNgo?.id === ngo.id ? null : ngo)}
              className={`bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group border-2 ${selectedNgo?.id === ngo.id ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${serviceIconBg(ngo.services_offered)}`}>
                  <span className="material-symbols-outlined text-3xl">{serviceIcon(ngo.services_offered)}</span>
                </div>
                <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                </span>
              </div>
              <h4 className="text-xl font-bold mb-1 font-headline">{ngo.name}</h4>
              <p className="text-zinc-500 text-sm mb-1">{ngo.location} • Capacity: {ngo.capacity}</p>
              <p className="text-xs text-zinc-400 mb-4">📞 {ngo.contact_info}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {services.map(s => (
                  <span key={s} className="bg-surface-container-low px-3 py-1 rounded-lg text-xs font-semibold text-zinc-600">
                    {serviceLabel[s.trim()] || s.trim()}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-primary">{active}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Active</p>
                </div>
                <div className="flex-1 bg-secondary/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-secondary">{resolved}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Resolved</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-surface-container h-1.5 rounded-full">
                  <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${resRate}%` }} />
                </div>
                <span className="text-xs font-bold text-zinc-500">{resRate}%</span>
              </div>

              <div className="pt-4 border-t border-zinc-100 mt-4 flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400">ID: {ngo.id}</span>
                <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  {selectedNgo?.id === ngo.id ? 'Selected' : 'View'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected NGO Detail Panel */}
      {selectedNgo && (
        <div className="mt-8 bg-surface-container-low rounded-3xl p-8 border border-primary/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-black font-headline text-on-surface">{selectedNgo.name}</h3>
              <p className="text-zinc-500">{selectedNgo.location} • {selectedNgo.services_offered.split(',').join(', ')}</p>
            </div>
            <button onClick={() => setSelectedNgo(null)} className="material-symbols-outlined bg-zinc-100 hover:bg-zinc-200 rounded-full p-2 transition-colors">close</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl text-center">
              <p className="text-3xl font-black text-primary">{selectedNgo.capacity}</p>
              <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Capacity</p>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center">
              <p className="text-3xl font-black text-secondary">{cases.filter(c => c.ngo_id === selectedNgo.id).length}</p>
              <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Total Cases</p>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center">
              <p className="text-3xl font-black text-green-600">{cases.filter(c => c.ngo_id === selectedNgo.id && c.status === 'resolved').length}</p>
              <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Resolved</p>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center">
              <p className="text-lg font-black text-zinc-700">{selectedNgo.contact_info}</p>
              <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Contact</p>
            </div>
          </div>
        </div>
      )}
      </section>
    </div>
  );
}
