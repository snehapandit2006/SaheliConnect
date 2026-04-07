import React, { useState } from 'react';
import { ShieldAlert, Send, MapPin, CheckCircle } from 'lucide-react';
import { submitWebReport } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const ReportForm = () => {
    const [formData, setFormData] = useState({
        phone_number: '',
        message: '',
        location: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [caseData, setCaseData] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSOS = async () => {
        // Automatically inject SOS keyword so NLP routes it as urgent
        await submitForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitForm(false);
    };

    const submitForm = async (isSOS) => {
        if (!formData.phone_number || !formData.message) {
            setStatus('error');
            return;
        }

        setStatus('submitting');
        try {
            const payload = {
                phone_number: formData.phone_number,
                message: isSOS ? `EMERGENCY SOS: ${formData.message}` : formData.message,
                location: formData.location || null
            };
            const result = await submitWebReport(payload);
            setCaseData(result);
            setStatus('success');
            setFormData({ phone_number: '', message: '', location: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="h-full flex items-center justify-center p-8 relative overflow-y-auto custom-scrollbar">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="w-[500px] max-w-full glass-panel flex flex-col relative z-10 shadow-2xl p-8 border border-white/5 bg-surface/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Report an Issue</h2>
                    <p className="text-subText text-sm">Please fill out this form to connect with the nearest support NGO.</p>
                </div>

                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center"
                        >
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Request Submitted</h3>
                            <p className="text-green-200/80 mb-4 text-sm leading-relaxed">
                                Your request (Priority: <span className="font-semibold text-white">{caseData?.priority}</span>) has been securely routed.
                            </p>
                            <div className="bg-black/20 rounded-lg p-4 mb-6">
                                <p className="text-xs text-subText uppercase tracking-wider mb-1">Assigned Support</p>
                                <p className="font-medium text-white">{caseData?.ngo?.name || 'Awaiting Assignment'}</p>
                            </div>
                            <button 
                                onClick={() => { setStatus('idle'); setCaseData(null); }}
                                className="w-full btn-secondary"
                            >
                                Submit Another Report
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit} 
                            className="space-y-6"
                        >
                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-sm text-center">
                                    Please provide at least a phone number and message.
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-subText mb-1.5">Phone Number *</label>
                                <input 
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full bg-surfaceHighlight border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-white/20 transition-all font-mono"
                                    placeholder="+91 9999999999"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-subText mb-1.5">Your Location (Optional)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subText" />
                                    <input 
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full bg-surfaceHighlight border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-white/20 transition-all"
                                        placeholder="e.g. North District"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-subText mb-1.5">What do you need help with? *</label>
                                <textarea 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-surfaceHighlight border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-white/20 transition-all resize-none"
                                    placeholder="Describe your situation here so we can match you to the right NGO..."
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="btn-primary py-3.5 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleSOS}
                                    disabled={status === 'submitting'}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-semibold rounded-lg py-3.5 flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <ShieldAlert className="w-5 h-5" />
                                    SOS URGENT
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReportForm;
