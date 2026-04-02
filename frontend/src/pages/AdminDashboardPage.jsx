import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  History,
  Activity,
  Map as MapIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';

const COLORS = {
  primary: '#3b82f6',
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  zinc: '#71717a'
};

const GRADIENTS = [
  { id: 'blue', start: '#3b82f6', end: '#60a5fa' },
  { id: 'emerald', start: '#10b981', end: '#34d399' },
  { id: 'amber', start: '#f59e0b', end: '#fbbf24' },
  { id: 'rose', start: '#f43f5e', end: '#fb7185' },
];

const StatCard = ({ label, value, icon: Icon, colorClass, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-3xl relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full ${colorClass}`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${colorClass.replace('bg-', 'text-')}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
           <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-3xl font-black">{value}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  </motion.div>
);

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getStats(user.latitude || 12.9716, user.longitude || 77.5946, user.geofenceRadiusKm || 5);
      setStats(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary-500" size={40} />
        <p className="text-zinc-500 font-bold text-sm animate-pulse">Synchronizing Cluster Data...</p>
      </div>
    </div>
  );

  if (!stats) return null;

  const categoryData = Object.entries(stats.byCategory || {}).map(([k, v]) => ({
    name: k.replace('_', ' '), count: v
  }));

  const statusData = [
    { name: 'Pending', value: stats.pending, color: COLORS.amber },
    { name: 'In Progress', value: stats.inProgress, color: COLORS.indigo },
    { name: 'Resolved', value: stats.resolved, color: COLORS.emerald },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Governance Insight</h1>
          <p className="text-zinc-500 font-medium">Monitoring Zone: {user?.area || 'Central Command'} · {user?.geofenceRadiusKm || 5}km Radius</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={load} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all">
             <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all">
             <MapIcon size={18} /> View Zone Map
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Reports" value={stats.total} icon={FileText} colorClass="bg-blue-500" trend="+12%" />
        <StatCard label="Critical/Pending" value={stats.pending} icon={AlertTriangle} colorClass="bg-amber-500" trend="+5%" />
        <StatCard label="Active Dispatch" value={stats.inProgress} icon={Activity} colorClass="bg-indigo-500" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} colorClass="bg-emerald-500" trend="88%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main SLA Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[32px] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Category Distribution</h3>
              <p className="text-xs text-zinc-500 font-medium">Issue density across municipal services</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase">
                  <span className="w-2 h-2 rounded-full bg-primary-500" /> Current
               </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[Object.keys(COLORS)[index % Object.keys(COLORS).length]]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie */}
        <div className="glass-card p-8 rounded-[32px] border border-white/5 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold">Operational Status</h3>
            <p className="text-xs text-zinc-500 font-medium">Efficiency & backlog overview</p>
          </div>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-emerald-400">{(stats.resolved / stats.total * 100 || 0).toFixed(0)}%</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Success</span>
            </div>
          </div>

          <div className="space-y-3 mt-4">
             {statusData.map((s, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                   <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{s.name}</span>
                 </div>
                 <span className="text-xs font-black text-white">{s.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* SLA Metrics & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-card p-8 rounded-[32px] border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                  <History size={20} />
                </div>
                <h3 className="text-xl font-bold">Priority Resolution SLA</h3>
              </div>
            </div>
            <div className="space-y-6">
               {[
                 { label: 'Urgent Phase', progress: 92, time: '2.4 hrs', color: 'bg-rose-500' },
                 { label: 'High Priority', progress: 78, time: '8.1 hrs', color: 'bg-orange-500' },
                 { label: 'Standard Maintenance', progress: 64, time: '24.5 hrs', color: 'bg-indigo-500' },
               ].map((sla, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-zinc-500">{sla.label}</span>
                     <span className="text-zinc-300">Target: {sla.time}</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${sla.progress}%` }}
                       className={`h-full ${sla.color} rounded-full`} 
                     />
                   </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass-card p-8 rounded-[32px] border border-white/5">
            <h3 className="text-xl font-bold mb-6">Critical Hotspots</h3>
            <div className="space-y-4">
               {stats.topComplaints?.slice(0, 3).map((c, i) => (
                 <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-xs font-black">
                      #{i+1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">{c.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{c.category} • {c.upvotes} UPVOTES</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${c.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                         {c.status}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}


