import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitWebReport } from '../api';

const categories = [
  { value: '', label: 'Auto-detect from description', labelHi: 'विवरण से स्वतः पता लगाएं' },
  { value: 'danger', label: 'Safety / Protection', labelHi: 'सुरक्षा / संरक्षण' },
  { value: 'depressed', label: 'Mental Health', labelHi: 'मानसिक स्वास्थ्य' },
  { value: 'health', label: 'Health & Hygiene', labelHi: 'स्वास्थ्य और स्वच्छता' },
  { value: 'job', label: 'Employment / Skills', labelHi: 'रोजगार / कौशल' },
];

export default function ReportSubmission() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ description: '', location: '', phone: '', categoryHint: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Please describe your situation / कृपया अपनी स्थिति बताएं';
    else if (form.description.trim().length < 10) e.description = 'Please provide more detail (at least 10 characters)';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const message = form.categoryHint ? `${form.categoryHint} ${form.description}` : form.description;
      const result = await submitWebReport({
        phone_number: form.phone.trim() || `anon-${Date.now()}`,
        message,
        location: form.location.trim() || null,
      });
      setSuccess(result);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pt-2 pb-32 px-6 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-6 bg-green-100 blur-3xl rounded-full opacity-60" />
          <div className="relative bg-green-50 w-28 h-28 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Report Submitted</h2>
        <p className="text-secondary font-semibold text-xl mb-2">रिपोर्ट सफलतापूर्वक दर्ज हो गई</p>
        <div className="bg-surface-container-low rounded-2xl p-6 my-6 w-full text-left space-y-3">
          <div className="flex justify-between"><span className="text-zinc-500 text-sm font-bold">Case ID</span><span className="font-bold text-primary">#{success.id}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500 text-sm font-bold">Priority</span><span className={`font-bold uppercase text-sm ${success.priority === 'urgent' ? 'text-error' : success.priority === 'moderate' ? 'text-secondary' : 'text-zinc-500'}`}>{success.priority}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500 text-sm font-bold">Category</span><span className="font-bold">{success.category}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500 text-sm font-bold">Status</span><span className="font-bold text-primary">{success.status}</span></div>
        </div>
        <p className="text-zinc-500 text-sm mb-6">Your case has been created and routed to the appropriate NGO. You can track its progress on the dashboard.</p>
        <div className="flex gap-4 w-full">
          <button onClick={() => navigate('/')} className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-container transition-colors">View Dashboard</button>
          <button onClick={() => { setSuccess(null); setForm({ description: '', location: '', phone: '', categoryHint: '' }); }} className="flex-1 border-2 border-primary/20 text-primary py-4 rounded-2xl font-bold hover:bg-primary/5 transition-colors">New Report</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-32 px-6 max-w-lg mx-auto min-h-screen">
      <section className="mb-8 text-center">
        <div className="mb-4 relative inline-block">
          <div className="absolute -inset-4 bg-primary-fixed/30 blur-3xl rounded-full" />
          <div className="relative bg-primary-fixed w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
          </div>
        </div>
        <h1 className="font-headline font-bold text-3xl text-primary leading-tight mb-2">Report a Concern</h1>
        <p className="text-zinc-600 text-lg">चिंता की रिपोर्ट करें — We are here to listen and help.</p>
      </section>

      {submitError && (
        <div className="bg-error-container text-on-error-container p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-medium">
          <span className="material-symbols-outlined">error</span> {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">What happened? / क्या हुआ? <span className="text-error">*</span></label>
          <textarea
            value={form.description}
            onChange={e => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: null }); }}
            placeholder="Describe your situation in any language... / किसी भी भाषा में बताएं..."
            className={`w-full h-36 p-4 rounded-2xl bg-surface-container-lowest border ${errors.description ? 'border-error ring-2 ring-error/20' : 'border-outline-variant/30'} text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
          />
          {errors.description && <p className="text-error text-xs font-bold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.description}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">Location / स्थान <span className="text-zinc-400">(optional)</span></label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">location_on</span>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Sector 45, Gurgaon"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Category Hint */}
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">Category / श्रेणी <span className="text-zinc-400">(optional)</span></label>
          <div className="grid grid-cols-1 gap-2">
            {categories.map(cat => (
              <button type="button" key={cat.value}
                onClick={() => setForm({ ...form, categoryHint: cat.value })}
                className={`p-4 rounded-2xl border text-left transition-all ${form.categoryHint === cat.value ? 'border-primary bg-primary-fixed/30 ring-2 ring-primary/20' : 'border-outline-variant/20 bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                <span className="font-bold text-sm text-on-surface">{cat.label}</span>
                <span className="block text-xs text-zinc-500">{cat.labelHi}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">Contact Number <span className="text-zinc-400">(optional, anonymous otherwise)</span></label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="Leave blank for anonymous reporting"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg">
          {submitting ? (
            <><span className="material-symbols-outlined animate-spin">progress_activity</span> Submitting...</>
          ) : (
            <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span> Submit Report / रिपोर्ट जमा करें</>
          )}
        </button>
      </form>

      <div className="mt-8 p-6 bg-surface-container-low rounded-2xl flex items-start gap-4">
        <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
        <div>
          <h3 className="font-bold text-on-surface">Your safety is private</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">Everything you share with Saheli Connect is secure and confidential. We are here to support you.</p>
        </div>
      </div>
    </div>
  );
}
