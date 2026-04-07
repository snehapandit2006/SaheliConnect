import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sendWhatsAppMessage } from '../api';

const categoryLabel = { protection: 'Safety & Protection', mental_health: 'Mental Health', health_hygiene: 'Health & Hygiene', skill_development: 'Skill Development', general: 'General' };

export default function WhatsAppChat() {
  const [phone, setPhone] = useState('');
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startChat = () => {
    if (!phone.trim() || phone.trim().length < 5) return;
    setStarted(true);
    setMessages([{
      type: 'bot',
      text: '🙏 Welcome to Saheli Connect helpline.\n\nSaheli Connect हेल्पलाइन में आपका स्वागत है।\n\nPlease describe your situation. We will connect you with the right support.\n\nकृपया अपनी स्थिति बताएं।',
    }]);
  };

  const sendMsg = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setSending(true);
    try {
      const result = await sendWhatsAppMessage(phone, text);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `✅ Case created successfully!\n\n📋 Case ID: #${result.id}\n🏷️ Category: ${categoryLabel[result.category] || result.category}\n⚡ Priority: ${result.priority.toUpperCase()}\n📍 Status: ${result.status}\n\nA support team will reach out to you shortly.\nएक सहायता टीम जल्द ही आपसे संपर्क करेगी।`,
        caseId: result.id,
      }]);
    } catch {
      setMessages(prev => [...prev, { type: 'bot', text: '❌ Sorry, something went wrong. Please try again.\nक्षमा करें, कुछ गलत हो गया।' }]);
    } finally { setSending(false); }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-green-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
        </div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">WhatsApp Simulator</h1>
        <p className="text-zinc-500 mb-1 text-lg">Simulate the helpline chat experience</p>
        <p className="text-secondary font-medium mb-8">हेल्पलाइन चैट का अनुभव करें</p>
        <div className="w-full space-y-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">phone</span>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && startChat()}
              placeholder="Enter phone number to start" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-base focus:outline-none focus:ring-2 focus:ring-green-500/30" />
          </div>
          <button onClick={startChat} disabled={!phone.trim() || phone.trim().length < 5}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 text-lg">
            <span className="material-symbols-outlined">chat</span> Start Chat
          </button>
        </div>
        <p className="text-xs text-zinc-400 mt-6">This simulator sends messages to the NLP pipeline to demonstrate smart routing.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-2xl flex items-center gap-3">
        <button onClick={() => { setStarted(false); setMessages([]); }} className="material-symbols-outlined hover:bg-white/10 rounded-full p-1 transition-colors">arrow_back</button>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">support_agent</span></div>
        <div>
          <p className="font-bold">Saheli Connect Helpline</p>
          <p className="text-xs text-green-100">📞 {phone} • Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#ece5dd] p-4 space-y-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c8c1b8\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
              msg.type === 'user' ? 'bg-[#dcf8c6] rounded-tr-sm' : 'bg-white rounded-tl-sm'
            }`}>
              {msg.text}
              {msg.caseId && (
                <Link to={`/case/${msg.caseId}`} className="block mt-2 text-primary text-xs font-bold hover:underline">
                  View Case #{msg.caseId} →
                </Link>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm"><span className="material-symbols-outlined text-zinc-400 animate-pulse text-sm">more_horiz</span></div></div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-3 rounded-b-2xl flex items-center gap-2 shadow-lg">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
          placeholder="Type a message... / संदेश लिखें..."
          className="flex-1 px-4 py-3 rounded-full bg-surface-container-low text-sm focus:outline-none" disabled={sending} />
        <button onClick={sendMsg} disabled={!input.trim() || sending}
          className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-40 active:scale-90">
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
}
