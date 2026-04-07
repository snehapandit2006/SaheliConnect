import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, AlertCircle, Clock, CheckCircle, User } from 'lucide-react';
import { getCases, updateCase, getFieldWorkers } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workersByNgo, setWorkersByNgo] = useState({});

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await getCases();
      setCases(data);
      
      // Fetch workers for any distinct NGO found in cases
      const ngoIds = [...new Set(data.map(c => c.ngo_id).filter(id => id != null))];
      for (const id of ngoIds) {
          if (!workersByNgo[id]) {
              fetchWorkersForNgo(id);
          }
      }
    } catch (error) {
      console.error("Error fetching cases", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkersForNgo = async (ngoId) => {
    try {
      const workers = await getFieldWorkers(ngoId);
      setWorkersByNgo(prev => ({ ...prev, [ngoId]: workers }));
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCases();
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'reported' ? 'in-progress' : currentStatus === 'in-progress' ? 'resolved' : 'reported';
    try {
      await updateCase(id, { status: nextStatus });
      fetchCases();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleAssignWorker = async (caseId, workerId) => {
    try {
      await updateCase(caseId, { field_worker_id: workerId ? parseInt(workerId) : null });
      fetchCases();
    } catch (err) {
      console.error("Failed to assign worker", err);
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return <span className="badge-urgent">Urgent</span>;
      case 'moderate': return <span className="badge-moderate">Moderate</span>;
      case 'low': return <span className="badge-low">Low</span>;
      default: return <span className="badge-low">{priority}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
        case 'reported': return <AlertCircle className="w-5 h-5 text-red-400" />;
        case 'in-progress': return <Clock className="w-5 h-5 text-yellow-400" />;
        case 'resolved': return <CheckCircle className="w-5 h-5 text-green-400" />;
        default: return null;
    }
  }

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden relative custom-scrollbar overflow-y-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40 z-0"></div>
        
        <header className="flex justify-between items-end mb-8 relative z-10 flex-shrink-0">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Active Cases</h2>
                <p className="text-subText">Manage and route incoming support requests.</p>
            </div>
            <button 
                onClick={fetchCases}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
            </button>
        </header>

        <div className="flex-1 rounded-2xl border border-white/5 bg-surfaceHighlight/30 relative z-10 p-6 shadow-inner">
            {cases.length === 0 && !loading ? (
                <div className="h-full flex flex-col items-center justify-center text-subText py-20">
                    <CheckCircle className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg">No active cases reported.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-full pb-10">
                    <AnimatePresence>
                        {cases.map((c) => (
                            <motion.div 
                                key={c.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-panel p-6 flex flex-col justify-between hover:bg-surface/90 transition-colors group"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        {getPriorityBadge(c.priority)}
                                        <button 
                                            onClick={() => handleUpdateStatus(c.id, c.status)}
                                            className="flex items-center gap-2 text-sm font-medium hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
                                            title="Click to update status"
                                        >
                                            {getStatusIcon(c.status)}
                                            <span className="capitalize">{c.status.replace('-', ' ')}</span>
                                        </button>
                                    </div>
                                    <p className="text-whiteText text-lg font-medium leading-snug mb-4 line-clamp-3">"{c.description}"</p>
                                    
                                    <div className="bg-background/50 rounded-lg p-4 text-sm mb-4 border border-white/5 space-y-3">
                                        <div>
                                            <p className="font-semibold text-primary mb-1 text-xs uppercase tracking-wide">Assigned To</p>
                                            <p className="flex items-center gap-2 text-whiteText font-medium">
                                                {c.ngo ? c.ngo.name : 'Unassigned'}
                                            </p>
                                            {c.category && (
                                                <p className="text-subText mt-1 flex items-center gap-1.5 text-xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> 
                                                Category: <span className="capitalize">{c.category.replace('_', ' ')}</span>
                                                </p>
                                            )}
                                        </div>

                                        {c.ngo && c.status !== 'resolved' && (
                                            <div className="pt-3 border-t border-white/5">
                                                <label className="flex items-center gap-1.5 font-semibold text-subText mb-2 text-xs py-0.5 uppercase tracking-wide">
                                                    <User className="w-3.5 h-3.5" /> Field Worker
                                                </label>
                                                <select
                                                    value={c.field_worker_id || ''}
                                                    onChange={(e) => handleAssignWorker(c.id, e.target.value)}
                                                    className="w-full bg-surface border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:ring-1 focus:ring-primary outline-none"
                                                >
                                                    <option value="">Unassigned</option>
                                                    {(workersByNgo[c.ngo_id] || []).map(w => (
                                                        <option key={w.id} value={w.id}>{w.name} - {w.phone_number}</option>
                                                    ))}
                                                </select>
                                                {c.field_worker_id && (
                                                    <span className="inline-block mt-2 text-xs text-accent">Worker Assigned ✓</span>
                                                )}
                                            </div>
                                        )}
                                        {c.ngo && c.status === 'resolved' && c.field_worker_id && (
                                            <div className="pt-3 border-t border-white/5">
                                                <p className="text-xs text-subText uppercase">Resolved By</p>
                                                <p className="text-sm text-white/80">{c.field_worker?.name || `Worker #${c.field_worker_id}`}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs text-subText flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.location || 'Unknown'}</span>
                                    <div className="text-right">
                                        <div className="mb-0.5">#{c.id}</div>
                                        <div>{new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    </div>
  );
};

export default Dashboard;
