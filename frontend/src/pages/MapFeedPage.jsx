import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../api';
import ComplaintCard from '../components/ComplaintCard';
import { 
  Search, 
  RefreshCw, 
  Map as MapIcon, 
  List as ListIcon, 
  Layers, 
  Filter,
  Navigation,
  ChevronDown,
  ArrowBigUp
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CATEGORIES = ['ALL', 'POTHOLE', 'DRAINAGE', 'STREETLIGHT', 'GARBAGE', 'WATER_ISSUE', 'OTHERS'];
const STATUSES = ['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];

function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 14);
    }, [position, map]);
    return null;
}

export default function MapFeedPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('map'); // 'map' or 'list'
  const [radius, setRadius] = useState(5);
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState(user?.latitude ? { lat: user.latitude, lng: user.longitude } : { lat: 12.9716, lng: 77.5946 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getNearby(userLocation.lat, userLocation.lng, radius);
      setComplaints(res.data);
    } catch (e) {
      toast.error('Failed to load complaints. Is the backend running?');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userLocation, radius]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = complaints.filter(c => {
    if (catFilter !== 'ALL' && c.category !== catFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (search && !c.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUpvote = async (id) => {
    try {
      const res = await complaintAPI.upvote(id);
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
    } catch {}
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">City Live Feed</h1>
          <p className="text-zinc-500 font-medium">Monitoring {complaints.length} active reports within {radius}km</p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setView('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'map' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-zinc-500 hover:text-white'}`}
          >
            <MapIcon size={16} /> Map
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-zinc-500 hover:text-white'}`}
          >
            <ListIcon size={16} /> List
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Filters Sidebar */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="glass-card p-5 rounded-2xl space-y-6">
            <div className="space-y-3">
               <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Search</label>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                 <input 
                   placeholder="Keywords..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm focus:border-primary-500/50 outline-none transition-all"
                 />
               </div>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Radius</label>
                 <span className="text-xs font-bold text-primary-400">{radius} KM</span>
               </div>
               <input 
                 type="range" min="1" max="20" step="1" 
                 value={radius} onChange={e => setRadius(parseInt(e.target.value))}
                 className="w-full accent-primary-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
               />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Category</label>
               <div className="flex flex-wrap gap-2">
                 {CATEGORIES.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setCatFilter(cat)}
                     className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${catFilter === cat ? 'bg-primary-500/10 border-primary-500 text-white' : 'border-white/5 text-zinc-500 hover:border-white/10'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</label>
               <div className="flex flex-wrap gap-2">
                 {STATUSES.map(st => (
                   <button
                     key={st}
                     onClick={() => setStatusFilter(st)}
                     className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${statusFilter === st ? 'bg-primary-500/10 border-primary-500 text-white' : 'border-white/5 text-zinc-500 hover:border-white/10'}`}
                   >
                     {st.replace('_', ' ')}
                   </button>
                 ))}
               </div>
            </div>

            <button 
              onClick={load}
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-lg"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh Data
            </button>
          </div>

          <div className="p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl flex items-start gap-3">
             <Layers className="text-primary-500 shrink-0" size={16} />
             <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
               Real-time data synchronization is enabled. Nearby results are calculated using the Haversine formula based on your pinned location.
             </p>
          </div>
        </div>

        {/* Main View Area */}
        <div className="flex-1 rounded-3xl overflow-hidden glass-panel relative border border-white/5 shadow-inner">
          <AnimatePresence mode="wait">
            {view === 'map' ? (
              <motion.div 
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full"
              >
                <MapContainer 
                  center={[userLocation.lat, userLocation.lng]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* User Marker */}
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>
                      <div className="text-xs font-bold text-primary-400">YOUR LOCATION</div>
                    </Popup>
                  </Marker>

                  {/* Complaint Markers */}
                  {filtered.map(c => (
                    <Marker key={c.id} position={[c.latitude, c.longitude]}>
                       <Popup className="custom-popup">
                         <div className="p-1 min-w-[200px]">
                           <span className="text-[10px] font-bold text-primary-500 uppercase">{c.category}</span>
                           <h4 className="text-sm font-bold text-white mt-1">{c.title}</h4>
                           <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{c.description}</p>
                           <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase">{c.status}</span>
                              <div className="flex items-center gap-1 text-xs font-bold">
                                <ArrowBigUp size={14} className="text-primary-500" />
                                {c.upvotes}
                              </div>
                           </div>
                         </div>
                       </Popup>
                    </Marker>
                  ))}
                  
                  <RecenterMap position={[userLocation.lat, userLocation.lng]} />
                </MapContainer>
                
                {/* Custom Overlay for Map Info */}
                <div className="absolute top-4 right-4 z-[1000] p-3 glass-panel rounded-2xl flex items-center gap-3">
                   <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Monitoring</span>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto p-6 custom-scrollbar"
              >
                {filtered.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <MapIcon className="text-zinc-700" size={32} />
                     </div>
                     <h3 className="text-xl font-bold mb-2">No reports found in this radius</h3>
                     <p className="text-zinc-500 text-sm max-w-sm">Try increasing the search radius or check your location settings to see reports from other areas.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filtered.map(c => (
                      <ComplaintCard 
                        key={c.id} 
                        complaint={c} 
                        onUpvote={handleUpvote}
                        isAdmin={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
