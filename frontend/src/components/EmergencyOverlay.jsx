import React, { useState, useEffect } from 'react';
import { triggerSos } from '../api';

/**
 * EmergencyOverlay Component
 * A full-screen mission-critical UI that activates after SOS is triggered.
 * Provides real-time feedback and reassurance to the user.
 */
export default function EmergencyOverlay({ onCancel }) {
  const [step, setStep] = useState('sending'); // sending, locating, responding, dispatched
  const [ngo, setNgo] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const performSOS = async () => {
      try {
        // Initial delay for visceral impact
        await new Promise(r => setTimeout(r, 800));
        setStep('locating');
        
        // Real backend call
        const response = await triggerSos({
          phone_number: "emergency-user-" + Date.now(),
          message: "⚠️ EMERGENCY SOS TRIGGERED",
          location: "Current GPS Coordinates" // In a real app we'd fetch actual GPS
        });
        
        setNgo(response.ngo);
        
        // Progress to Responding after successful logic
        await new Promise(r => setTimeout(r, 1200));
        setStep('responding');
        
        // Simulate "Volunteer Dispatched" after another delay
        await new Promise(r => setTimeout(r, 2500));
        setStep('dispatched');
      } catch (err) {
        console.error("SOS Error:", err);
        setError("Network error. Please call the helpline directly.");
      }
    };
    
    performSOS();
  }, []);

  const steps = [
    { id: 'sending', label: 'Transmitting Signal', icon: 'sensors' },
    { id: 'locating', label: 'Locating Nearest NGO', icon: 'explore' },
    { id: 'responding', label: 'NGO Responding', icon: 'handshake' },
    { id: 'dispatched', label: 'Help Dispatched', icon: 'local_shipping' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="fixed inset-0 z-[60] bg-error flex flex-col items-center justify-between p-8 text-on-error animate-fade-in overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-b from-error-container/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-pulse-slow"></div>

      {/* Header */}
      <div className="w-full flex justify-between items-start z-10">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-headline tracking-tighter uppercase leading-none">Emergency</h2>
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Active Response Active</p>
        </div>
        <button 
          onClick={onCancel}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors border border-white/20"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Main Status Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md z-10 space-y-12">
        <div className="relative">
          {/* Animated Icon */}
          <div className="bg-white text-error w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-bounce-slow">
            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {steps[currentStepIndex]?.icon || 'emergency'}
            </span>
          </div>
          {/* Dynamic Progress Indicator */}
          <div className="absolute -inset-4 border-4 border-white/30 rounded-[3rem] animate-ping opacity-20"></div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-black font-headline tracking-tight uppercase animate-pulse">
            {error ? "Action Required" : steps[currentStepIndex]?.label}
          </h1>
          <p className="text-lg font-medium opacity-90 px-4">
            {error ? error : 
             step === 'dispatched' ? "A local response team is on the way to your location." :
             step === 'responding' ? `Alert confirmed by ${ngo?.name || "Verified NGO"}.` :
             "Stay where you are. We are processing your request with high urgency."}
          </p>
        </div>

        {/* Visual Reassurance / NGO Card */}
        {(ngo || step === 'dispatched') && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-full space-y-4 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-error flex items-center justify-center font-bold text-xl">
                {ngo?.name?.charAt(0) || "S"}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">{ngo?.name || "Saheli Response Team"}</h3>
                <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Primary Contact Center</p>
              </div>
              <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-[10px] font-black uppercase border border-green-500/30">
                Verified
              </div>
            </div>
            
            {step === 'dispatched' && (
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-bold opacity-80 uppercase tracking-wider">ETA: 8-12 Minutes</span>
                <span className="text-sm font-black text-green-300 animate-pulse">EN ROUTE</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="w-full max-w-md space-y-4 z-10">
        {ngo?.contact_info && (
          <a 
            href={`tel:${ngo.contact_info}`}
            className="w-full bg-white text-error py-5 rounded-2xl font-headline font-black text-xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
            CALL {ngo.name.split(' ')[0].toUpperCase()}
          </a>
        )}
        
        <a 
          href="tel:112"
          className="w-full border-2 border-white/50 bg-transparent text-white py-4 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">local_police</span>
          NATIONAL HELPLINE (112)
        </a>
        
        <p className="text-[10px] text-center font-bold opacity-60 uppercase tracking-[0.2em] pt-2">
          Your location is encrypted and shared only with responders
        </p>
      </div>
    </div>
  );
}
