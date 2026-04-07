import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCase, updateCase } from '../api';

const categoryLabel = { protection: 'Safety & Protection', mental_health: 'Mental Health', health_hygiene: 'Health & Hygiene', skill_development: 'Skill Development', general: 'General Inquiry' };
const categoryHindi = { protection: 'सुरक्षा एवं संरक्षण', mental_health: 'मानसिक स्वास्थ्य', health_hygiene: 'स्वास्थ्य और स्वच्छता', skill_development: 'कौशल विकास', general: 'सामान्य पूछताछ' };
const statusLabel = { reported: 'Reported', 'in-progress': 'In Progress', resolved: 'Resolved' };
const statusHindi = { reported: 'रिपोर्ट किया गया', 'in-progress': 'प्रगति पर है', resolved: 'हल किया गया' };
const priorityStyle = { urgent: 'bg-error text-white', moderate: 'bg-secondary-fixed text-secondary', low: 'bg-zinc-100 text-zinc-500' };

function timeAgo(d) { const s = Math.floor((Date.now() - new Date(d)) / 1000); if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s/60)} mins ago`; if (s < 86400) return `${Math.floor(s/3600)} hours ago`; return `${Math.floor(s/86400)} days ago`; }
function formatDate(d) { return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }

export default function CaseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setLoading(true);
    getCase(id)
      .then(data => { setCaseData(data); setNotes(data.notes || ''); })
      .catch(e => setError(e.message || 'Failed to load case'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const updated = await updateCase(id, { status: newStatus });
      setCaseData(updated);
    } catch { alert('Failed to update status'); }
    finally { setUpdating(false); }
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    try {
      const updated = await updateCase(id, { notes });
      setCaseData(updated);
    } catch { alert('Failed to save notes'); }
    finally { setUpdating(false); }
  };

  if (loading) return (
    <div className="pt-2 pb-32 px-4 max-w-5xl mx-auto animate-pulse space-y-6">
      <div className="h-6 w-24 bg-zinc-200 rounded" />
      <div className="h-10 w-64 bg-zinc-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl h-64" />
        <div className="bg-zinc-200 rounded-3xl h-48" />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
      <h2 className="font-headline text-2xl font-bold mb-2">Case Not Found</h2>
      <p className="text-zinc-500 mb-6">{error}</p>
      <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Back to Dashboard</button>
    </div>
  );

  const c = caseData;
  const ps = priorityStyle[c.priority] || priorityStyle.low;

  return (
    <div className="pt-2 pb-32 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <section className="space-y-4 pt-2">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-all active:scale-95">arrow_back</button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Case ID: #{c.id}</span>
          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${ps}`}>{c.priority} Priority</span>
          <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{statusLabel[c.status]}</span>
        </div>
        <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-background leading-tight">
          {categoryLabel[c.category] || 'Case'} – {c.location || 'Location Unknown'}
          <span className="block text-xl font-semibold text-secondary mt-1 tracking-tight">{categoryHindi[c.category] || ''}</span>
        </h2>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">description</span>
              <h3 className="font-headline font-bold text-xl">Case Description / विवरण</h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-base">{c.description}</p>
            <div className="pt-6 border-t border-outline-variant/20 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary-fixed rounded-2xl text-secondary"><span className="material-symbols-outlined">fingerprint</span></div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</p>
                  <p className="font-headline font-bold text-on-surface">{categoryLabel[c.category] || c.category}</p>
                  <p className="text-sm text-zinc-500">({categoryHindi[c.category] || ''})</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-fixed rounded-2xl text-primary"><span className="material-symbols-outlined">schedule</span></div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Reported At</p>
                  <p className="font-headline font-bold text-on-surface">{formatDate(c.created_at)}</p>
                  <p className="text-sm text-zinc-500">{timeAgo(c.created_at)}</p>
                </div>
              </div>
              {c.ngo && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-fixed rounded-2xl text-primary"><span className="material-symbols-outlined">corporate_fare</span></div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Assigned NGO</p>
                    <p className="font-headline font-bold text-on-surface">{c.ngo.name}</p>
                    <p className="text-sm text-zinc-500">{c.ngo.location}</p>
                  </div>
                </div>
              )}
              {c.field_worker && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary-fixed rounded-2xl text-secondary"><span className="material-symbols-outlined">support_agent</span></div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Field Worker</p>
                    <p className="font-headline font-bold text-on-surface">{c.field_worker.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-surface-container-low p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">edit_note</span>
              <h3 className="font-headline font-bold text-xl">Case Notes / टिप्पणियाँ</h3>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add internal notes about this case..."
              className="w-full h-32 p-4 rounded-2xl bg-white border border-outline-variant/20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={handleSaveNotes} disabled={updating} className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-colors disabled:opacity-50">
              {updating ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className={`p-8 rounded-3xl shadow-xl space-y-6 ${c.status === 'resolved' ? 'bg-zinc-700 text-white' : 'bg-secondary text-on-secondary'}`} style={c.status === 'resolved' ? {} : { boxShadow: '0 20px 40px -10px rgba(115,72,171,0.3)' }}>
            <div className="space-y-1">
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Current Status</p>
              <p className="font-headline text-2xl font-bold">{statusLabel[c.status]}</p>
              <p className="text-sm opacity-90">{statusHindi[c.status]}</p>
            </div>
            <div className="space-y-3">
              {c.status === 'reported' && (
                <button onClick={() => handleStatusUpdate('in-progress')} disabled={updating}
                  className="w-full bg-white text-secondary font-headline font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  <span className="material-symbols-outlined">verified</span> {updating ? 'Updating...' : 'Accept Case'}
                </button>
              )}
              {c.status === 'in-progress' && (
                <button onClick={() => handleStatusUpdate('resolved')} disabled={updating}
                  className="w-full bg-white text-secondary font-headline font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  <span className="material-symbols-outlined">task_alt</span> {updating ? 'Updating...' : 'Mark Resolved'}
                </button>
              )}
              {c.status === 'resolved' && (
                <div className="w-full bg-white/20 font-headline font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-white/80">
                  <span className="material-symbols-outlined">check_circle</span> Case Closed
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl space-y-6">
            <h4 className="font-headline font-bold text-on-surface">Trust Indicators</h4>
            <div className="space-y-4">
              {['Identity Verified via NGO Portal', 'Safe Communication Channel Active', 'Data Encrypted & Confidential'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span></div>
                  <p className="text-sm font-medium text-on-surface-variant">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {c.location && (
            <div className="rounded-3xl overflow-hidden h-48 relative shadow-sm">
              <img className="w-full h-full object-cover" alt="Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARsieDtFDqLNIu2o2r1FvPE6JEVfl1rXDxErOFcaAmSJ1PziechnIBS4sqkrKDEB-1_R3E7ngRE2Wy-_HX6rwMlKx0Zj3ZJd8yMtYYjFbJYVT5uZra_aptFCx7WWh46Ng1WQs33vbFUXtzyv8JxpBrxDEgxkTNeDpVIipUe960RYUHRdH_n9Q1QAtx8DFa-HuNqnVEdf4OE4cbFxhkDBvqgy9GEQQ8v52XYP4b6LlqYlFhJjtxNqVEYFK7qifaHx-bkEcGWsmB2Q" />
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                  <span className="text-xs font-bold text-on-surface">{c.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
