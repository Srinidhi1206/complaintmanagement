import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { 
  Shield, 
  Phone, 
  User as UserIcon, 
  MapPin, 
  ArrowRight, 
  AlertCircle,
  Building2,
  Lock
} from 'lucide-react';
import MapPicker from '../components/MapPicker';
import Button from '../components/ui/Button';

export default function AuthPage() {
  const { loginUser } = useAuth();
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [reg, setReg] = useState({
    name: '', 
    phoneNumber: '', 
    area: '', 
    role: 'USER',
    latitude: null,
    longitude: null,
    geofenceRadiusKm: 5.0
  });

  const [location, setLocation] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login({ phoneNumber: phone });
      toast.success(`Welcome back, ${res.data.name}!`);
      loginUser(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Unauthorized access. Please check your number.';
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!location) {
      const msg = 'Please select your location on the map.';
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      const payload = { 
        ...reg, 
        latitude: location.lat, 
        longitude: location.lng 
      };
      const res = await authAPI.register(payload);
      toast.success(`Account created! Welcome, ${res.data.name}!`);
      loginUser(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. System error.';
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] flex flex-col md:flex-row glass-panel rounded-[32px] overflow-hidden shadow-2xl border-white/5"
      >
        {/* Left Side: Brand Story */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
           
           <div>
             <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                 <Shield className="text-white" size={28} />
               </div>
               <h1 className="text-2xl font-bold text-white tracking-tight">Colony<span className="text-primary-200">Care</span></h1>
             </div>
             <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
               Empowering <br /> 
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">Digital Governance.</span>
             </h2>
             <p className="text-primary-100/80 text-lg">
               Join thousands of citizens improving their neighborhoods through AI-driven complaint management.
             </p>
           </div>

           <div className="grid grid-cols-2 gap-4 mt-auto">
             {[
               { icon: MapPin, label: 'GPS Tracking' },
               { icon: Lock, label: 'Secure Data' },
               { icon: Building2, label: 'Direct Access' },
               { icon: Shield, label: 'AI Moderated' }
             ].map((feat, i) => (
               <div key={i} className="flex items-center gap-2 text-white/70 text-sm font-medium">
                 <feat.icon size={16} />
                 {feat.label}
               </div>
             ))}
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.2] p-8 md:p-12 bg-zinc-900/50">
          <div className="flex gap-8 mb-8 border-b border-white/5">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                  tab === t ? 'text-primary-500' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t}
                {tab === t && (
                  <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl bg-zinc-800/50 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 shadow-lg">
                  <AlertCircle size={18} className="text-red-500" />
                  {error}
                </motion.div>
              )}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={loading}
                    variant="primary"
                    className="w-full"
                    icon={ArrowRight}
                  >
                    Continue to Dashboard
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-zinc-500 pl-1">Name</label>
                      <input
                        required
                        value={reg.name}
                        onChange={e => setReg(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-zinc-500 pl-1">Phone</label>
                      <input
                        required
                        type="tel"
                        value={reg.phoneNumber}
                        onChange={e => setReg(p => ({ ...p, phoneNumber: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 pl-1">Locality / Area Name</label>
                    <input
                      required
                      value={reg.area}
                      onChange={e => setReg(p => ({ ...p, area: e.target.value }))}
                      placeholder="e.g. Green Valley Sector 4"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 pl-1">Location Selection</label>
                    <MapPicker 
                      position={location} 
                      setPosition={setLocation} 
                      onAddressChange={(addr) => setReg(p => ({ ...p, area: addr }))}
                      className="h-48" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 pl-1">Identity Role</label>
                    <div className="flex gap-3">
                      {['USER', 'ADMIN'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReg(p => ({ ...p, role: r }))}
                          className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${
                            reg.role === r 
                              ? 'bg-white/10 border-primary-500 text-white' 
                              : 'border-white/5 text-zinc-500 hover:bg-white/5'
                          }`}
                        >
                          {r === 'USER' ? 'Resident' : 'Official'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={loading}
                    variant="secondary"
                    className="w-full mt-4"
                  >
                    Create Account
                  </Button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
