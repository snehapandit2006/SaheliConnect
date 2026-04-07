import React from 'react';

export default function TopNav() {
  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md shadow-[0_40px_40px_-15px_rgba(27,28,28,0.06)] no-line-rule surface-tonal-shift md:left-80 md:w-[calc(100%-20rem)]">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-white">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOz6bIxdm-xR-mBLAMOFoc7T9PtSdk6GA4suJuj-3A45Fy_nNu1Ir63bbv3Y6uw231TUrONsSBY8p2TQgk60PxQ2Z2F0Z4xFuvAKh7q0d9D4HVNLtpBg-XPcs9zHoMuy42esc2e5t-6JCbpKjgm4VY7-m7OWFzgnySJqhrVzFezRvx0UJMWXdCHJlZm1BqEFeAhiluXT-PGZwdxwzywBjwJuXmiSffRVCxMVQ_q0hn5xKjIDPUIOH2hUfXB7zD7BR8jDgQv-r4qA"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-headline font-bold text-lg text-[#016464]">Saheli Team Member</h1>
            <p className="text-[10px] text-zinc-500 font-medium tracking-wider">NGO DASHBOARD • सुरक्षित समुदाय</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <span className="material-symbols-outlined text-[14px] text-green-600 mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Verified NGO</span>
          </div>
          <button className="bg-error text-on-error px-4 py-2 rounded-xl font-headline font-bold text-sm hover:scale-[1.02] transition-transform active:scale-95 duration-200 flex items-center gap-2 shadow-lg shadow-error/20">
            <span className="material-symbols-outlined text-sm">emergency</span>
            SOS
          </button>
        </div>
      </div>
    </header>
  );
}
