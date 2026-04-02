import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../api';
import ComplaintCard from '../components/ComplaintCard';
import { 
  History, 
  RefreshCw, 
  LayoutGrid,
  MapPin,
  Clock,
  ArrowRight,
  PlusCircle
} from 'lucide-react';

export default function MyComplaintsPage({ onNavigate }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getUserComplaints(user.id);
      setComplaints(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpvote = async (id) => {
    try {
      const res = await complaintAPI.upvote(id);
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">My Reports</h1>
          <p className="text-zinc-500 font-medium">Tracking {complaints.length} concerns filed from your account</p>
        </div>
        <button 
          onClick={load}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all self-end md:self-auto"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[32px] animate-pulse" />)}
        </div>
      ) : complaints.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[40px] p-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/5"
        >
          <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mb-8">
            <History className="text-primary-500/50" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3">No reports yet</h2>
          <p className="text-zinc-500 max-w-sm mb-10 text-sm leading-relaxed">
            Your report history is empty. Start by reporting an issue you've noticed in the city.
          </p>
          <button 
            onClick={() => onNavigate('submit')}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary-500/20 transition-all group"
          >
            <PlusCircle size={20} />
            File First Complaint
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {complaints.map(c => (
            <ComplaintCard 
              key={c.id} 
              complaint={c} 
              onUpvote={handleUpvote}
            />
          ))}
        </div>
      )}

      {complaints.length > 0 && (
        <div className="mt-12 p-8 glass-panel rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Resolution Center Active</p>
                <p className="text-xs text-zinc-500 font-medium">Our agents typically respond to local reports within 12 hours.</p>
              </div>
           </div>
           <button 
             onClick={() => onNavigate('submit')}
             className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
           >
             File New Concern
           </button>
        </div>
      )}
    </div>
  );
}
