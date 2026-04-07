import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    contact_info: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      location: formData.location.trim(),
      contact_info: formData.contact_info.trim()
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mb-4 relative inline-block">
          <div className="absolute -inset-4 bg-primary-fixed/30 blur-3xl rounded-full" />
          <div className="relative bg-primary-fixed w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>app_registration</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">Join Network</h2>
        <p className="text-zinc-500 mt-2 font-medium">Partner with Saheli Connect to coordinate effectively.</p>
        <p className="text-secondary font-bold text-sm">पंजीकरण</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-surface-container-lowest py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-outline-variant/20">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">error</span> {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface mb-2">NGO Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">domain</span>
                  <input 
                    type="text" 
                    name="name"
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Safe Haven Org"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface mb-2">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">mail</span>
                  <input 
                    type="email" 
                    name="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="admin@ngo.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">location_on</span>
                  <input 
                    type="text" 
                    name="location"
                    required 
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="New Delhi, India"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Contact Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">call</span>
                  <input 
                    type="text" 
                    name="contact_info"
                    required 
                    value={formData.contact_info}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="+91 99999 99999"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface mb-2">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">lock</span>
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-2xl font-bold font-headline shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Registering...</>
              ) : (
                <><span className="material-symbols-outlined">person_add</span> Create Account</>
              )}
            </button>
          </form>
          
          <div className="mt-8 border-t border-outline-variant/20 pt-6 text-center">
            <p className="text-zinc-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
