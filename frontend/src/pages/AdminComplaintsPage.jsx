import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../api';
import ComplaintCard from '../components/ComplaintCard';
import { 
  Search, 
  RefreshCw, 
  Filter, 
  SlidersHorizontal,
  LayoutGrid,
  MapPin,
  CheckCircle2,
  Clock,
  Zap,
  Loader2
} from 'lucide-react';

const CATEGORIES = ['ALL', 'POTHOLE', 'DRAINAGE', 'STREETLIGHT', 'GARBAGE', 'WATER_ISSUE', 'OTHERS'];
const STATUSES = ['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];

export default function AdminComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(user?.geofenceRadiusKm || 5);
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getNearby(user.latitude || 12.9716, user.longitude || 77.5946, radius);
      setComplaints(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, radius]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await complaintAPI.updateStatus(id, status);
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
      const label = status === 'RESOLVED' ? '✅ Marked Resolved' : status === 'IN_PROGRESS' ? '🔧 Set In Progress' : '⏳ Set to Pending';
      toast.success(`${label}`);
    } catch (e) {
      toast.error('Failed to update status. Try again.');
      console.error(e);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await complaintAPI.upvote(id);
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
    } catch (e) { console.error(e); }
  };

  const filtered = complaints.filter(c => {
    if (catFilter !== 'ALL' && c.category !== catFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (search && !c.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Case Management</h1>
          <p className="text-zinc-500 font-medium">Resolving {complaints.length} localized issues in {user?.area}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Range</span>
            <input 
              type="range" min="1" max="20" 
              value={radius} onChange={e => setRadius(parseInt(e.target.value))}
              className="w-24 accent-primary-500"
            />
            <span className="text-xs font-bold text-primary-400">{radius}km</span>
          </div>
          <button 
            onClick={load}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-6 sticky top-8">
             <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fast Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                  <input 
                    placeholder="Search by ID or title..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-sm outline-none focus:border-primary-500/50 transition-all"
                  />
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status Priority</label>
                <div className="flex flex-col gap-2">
                  {STATUSES.map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                        statusFilter === st 
                          ? 'bg-primary-500/10 border-primary-500 text-white' 
                          : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'
                      }`}
                    >
                      {st.replace('_', ' ')}
                      {statusFilter === st && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Department</label>
                <div className="flex flex-wrap gap-2">
                   {CATEGORIES.map(cat => (
                     <button
                       key={cat}
                       onClick={() => setCatFilter(cat)}
                       className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                         catFilter === cat 
                           ? 'bg-primary-500/10 border-primary-500 text-white' 
                           : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-3">
           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none">
               {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />)}
             </div>
           ) : filtered.length === 0 ? (
             <div className="glass-card rounded-[32px] p-20 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                 <LayoutGrid className="text-zinc-700" size={32} />
               </div>
               <h3 className="text-xl font-bold mb-2">No active cases match filters</h3>
               <p className="text-zinc-500 text-sm max-w-sm">All operations are currently up to date for this sector and filter set.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {filtered.map(c => (
                 <ComplaintCard 
                   key={c.id} 
                   complaint={c} 
                   onUpvote={handleUpvote}
                   onStatusChange={handleStatusChange}
                   isAdmin
                 />
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
