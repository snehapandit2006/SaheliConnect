import React from 'react';

/**
 * SOSButton Component
 * A high-visibility, sticky button for emergency alerts.
 * Positioned at bottom-center with a pulsing animation.
 */
export default function SOSButton({ onClick }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        className="group relative flex items-center justify-center"
      >
        {/* Pulsing rings */}
        <div className="absolute inset-0 rounded-full bg-error/40 animate-ping scale-150 opacity-20"></div>
        <div className="absolute inset-0 rounded-full bg-error/20 animate-ping delay-700 scale-[2] opacity-10"></div>
        
        {/* Main Button */}
        <div className="relative bg-error text-on-error w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(179,38,30,0.5)] border-4 border-white/20 hover:scale-110 active:scale-90 transition-all duration-300">
          <span className="material-symbols-outlined text-4xl mb-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            emergency
          </span>
          <span className="font-headline font-black text-xs tracking-widest uppercase">SOS</span>
        </div>

        {/* Hover label */}
        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
          TAP IN EMERGENCY
        </div>
      </button>
      
      {/* Subtle helper text */}
      <p className="text-[10px] font-bold text-error uppercase tracking-[0.2em] drop-shadow-sm bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-error/10">
        Emergency Support
      </p>
    </div>
  );
}
