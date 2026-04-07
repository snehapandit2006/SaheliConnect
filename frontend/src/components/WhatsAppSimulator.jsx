import React, { useState, useRef, useEffect } from 'react';
import { Send, Smartphone, ShieldCheck } from 'lucide-react';
import { sendWhatsAppMessage } from '../api';
import { motion } from 'framer-motion';

const WhatsAppSimulator = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi, this is Aashray automated support. Please type your issue, and we will connect you to the right help immediately.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        try {
            const caseData = await sendWhatsAppMessage("9999999999", userMsg);
            
            setTimeout(() => {
                let botResponse = `Thank you. Your request (Priority: ${caseData.priority}) has been safely routed to ${caseData.ngo ? caseData.ngo.name : 'our team'}. They will reach out to you shortly. Stay safe.`;
                
                if (caseData.user?.preferred_language === 'hi_roman') {
                    botResponse = `Dhanyawad. Aapki request (Priority: ${caseData.priority}) safe tarike se ${caseData.ngo ? caseData.ngo.name : 'hamari team'} ko bhej di gayi hai. Wo jald hi aapse sampark karenge. Surakshit rahein.`;
                }

                setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
                setIsTyping(false);
            }, 1000);
            
        } catch (error) {
            console.error("Simulator error", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, we encountered a network error routing your request. Please try again.", sender: 'bot'}]);
        }
    };

    return (
        <div className="h-full flex items-center justify-center p-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="w-[380px] h-[750px] max-h-full glass-panel rounded-[2.5rem] border-[6px] border-surface flex flex-col overflow-hidden relative z-10 shadow-2xl bg-black">
                {/* Simulated Phone Header */}
                <div className="bg-surface/90 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-3 pt-8 pb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-whiteText text-base leading-tight">Aashray Support</h3>
                        <p className="text-xs text-accent font-medium mt-0.5 tracking-wide">✓ Verified NGO Network</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                    {messages.map(m => (
                        <motion.div 
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                                m.sender === 'user' 
                                    ? 'bg-primary text-white rounded-br-sm' 
                                    : 'bg-surfaceHighlight text-whiteText rounded-tl-sm border border-white/5'
                            }`}>
                                {m.text}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-surfaceHighlight border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-subText animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-subText animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-subText animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-surfaceHighlight/50 border-t border-white/5 backdrop-blur-md pb-6">
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-surface border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 placeholder-subText text-whiteText transition-all"
                            placeholder="Type a message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim()}
                            className="bg-primary hover:bg-primaryHover text-white p-3 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-95 shadow-lg"
                        >
                            <Send className="w-5 h-5 -ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
            
            <div className="absolute top-12 left-12 max-w-sm hidden lg:block">
               <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-subText bg-clip-text text-transparent mb-4">User Reporting Simulation</h3>
               <p className="text-subText leading-relaxed">
                   Type a message to simulate a vulnerable user reaching out for help via WhatsApp or SMS.
                   <br/><br/>
                   Try typing:<br/>
                   <span className="text-white font-medium bg-white/10 px-2 py-0.5 rounded text-sm block mt-2 mb-1 w-fit">"I need a job to support my family"</span>
                   <span className="text-white font-medium bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-sm block mb-1 w-fit border border-red-500/20">"Please help me someone is attacking me"</span>
                   <span className="text-white font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-sm block w-fit border border-blue-500/20">"I am feeling very depressed and alone"</span>
               </p>
            </div>
        </div>
    );
};

export default WhatsAppSimulator;
