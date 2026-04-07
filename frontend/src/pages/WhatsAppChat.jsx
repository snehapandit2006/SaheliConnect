import React from 'react';

export default function WhatsAppChat() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto text-center space-y-8">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center shadow-lg">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp Logo" 
          className="w-12 h-12"
        />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline">Live WhatsApp Integration</h1>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          The simulated chat interface has been replaced. Saheli Connect is now hooked directly to the real world via the Twilio WhatsApp API.
        </p>
      </div>

      <div className="bg-surface-container-low p-8 rounded-[2rem] w-full text-left space-y-6 shadow-sm border border-outline-variant/20">
        <h3 className="font-bold text-xl flex items-center gap-2 text-on-surface border-b border-outline-variant/20 pb-4">
          <span className="material-symbols-outlined text-secondary">power</span>
          How to test the Live System:
        </h3>
        
        <ol className="space-y-4 list-decimal list-inside text-on-surface-variant font-medium leading-relaxed marker:text-primary marker:font-bold">
          <li>Register your Twilio WhatsApp Sandbox number on the Twilio Console.</li>
          <li>Set the Twilio Webhook URL to: <br/> <code className="bg-surface-container-high px-3 py-1.5 rounded-lg text-sm text-primary font-bold mt-2 inline-block shadow-inner break-all">https://[YOUR_NGROK_URL]/api/webhook/twilio</code></li>
          <li>Open WhatsApp on your actual phone.</li>
          <li>Send the sandbox join code to the number.</li>
          <li>Message the bot normally (e.g., "I need a doctor urgently in South Delhi").</li>
        </ol>

        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-4 flex gap-3 items-start">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="text-sm text-primary mt-0.5">
            <strong>System Magic:</strong> Watch your real phone message instantly appear on the dashboard, auto-assigned to the correct NGO, without any fake local mockups.
          </p>
        </div>
      </div>
    </div>
  );
}
