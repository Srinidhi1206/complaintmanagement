import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../api';
import { 
  PlusCircle, 
  Upload, 
  X, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  Info,
  Mic,
  MicOff
} from 'lucide-react';
import MapPicker from '../components/MapPicker';
import Dropzone from '../components/ui/Dropzone';
import Button from '../components/ui/Button';

const CATEGORIES = [
  { id: 'POTHOLE', label: 'Pothole', icon: '🕳️' },
  { id: 'DRAINAGE', label: 'Drainage', icon: '💧' },
  { id: 'STREETLIGHT', label: 'Streetlight', icon: '💡' },
  { id: 'GARBAGE', label: 'Garbage', icon: '🗑️' },
  { id: 'WATER_ISSUE', label: 'Water', icon: '🚰' },
  { id: 'OTHERS', label: 'Others', icon: '📋' },
];

export default function SubmitComplaintPage({ onNavigate }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', category: 'POTHOLE', address: '' });
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // AI Suggestions state
  const [duplicates, setDuplicates] = useState([]);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  // Auto-detect category based on title (Simple AI Proxy)
  useEffect(() => {
    const title = form.title.toLowerCase();
    if (title.includes('light') || title.includes('dark')) setForm(p => ({ ...p, category: 'STREETLIGHT' }));
    else if (title.includes('hole') || title.includes('road')) setForm(p => ({ ...p, category: 'POTHOLE' }));
    else if (title.includes('water') || title.includes('leak')) setForm(p => ({ ...p, category: 'WATER_ISSUE' }));
    else if (title.includes('smell') || title.includes('waste') || title.includes('garbage')) setForm(p => ({ ...p, category: 'GARBAGE' }));
  }, [form.title]);

  // Check for duplicates when location and title are ready
  useEffect(() => {
    const check = async () => {
      if (location && form.title.length > 5) {
        setIsCheckingDuplicates(true);
        try {
          const res = await complaintAPI.getDuplicates(location.lat, location.lng, form.title);
          setDuplicates(res.data);
        } catch (e) {
          console.error(e);
        } finally {
          setIsCheckingDuplicates(false);
        }
      }
    };
    const debounce = setTimeout(check, 1000);
    return () => clearTimeout(debounce);
  }, [location, form.title]);

  useEffect(() => {
    return () => {
      if (window.recognitionInstance) window.recognitionInstance.stop();
    };
  }, []);

  const toggleVoice = (e) => {
    e.preventDefault();
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("🎙️ Your browser doesn't support Voice-to-Text. Please use Chrome or Edge.");
      return;
    }
    
    if (isListening) {
      window.recognitionInstance?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setForm(p => ({ ...p, description: p.description + (p.description ? ' ' : '') + finalTranscript.trim() }));
      }
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    window.recognitionInstance = recognition;
    recognition.start();
    setIsListening(true);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      const msg = 'Please drop a pin on the map.';
      setError(msg);
      toast.error(msg);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        latitude: location.lat,
        longitude: location.lng,
        address: form.address,
        images: images,
        user: { id: user.id }
      };
      await complaintAPI.create(payload);
      toast.success('Report submitted successfully! Authorities have been notified.');
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-8 border border-accent/30"
        >
          <CheckCircle2 size={48} className="text-accent" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Report Lodged Successfully</h2>
        <p className="text-zinc-400 max-w-md mb-10 leading-relaxed">
          The Smart City AI has categorized this as <span className="text-primary-400 font-bold">{form.category}</span> and notified the relevant authorities.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => { setSuccess(false); setForm({ title: '', description: '', category: 'POTHOLE', address: '' }); setLocation(null); setImages([]); }}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold"
          >
            File Another
          </button>
          <button 
            onClick={() => onNavigate('my-complaints')}
            className="px-6 py-3 rounded-xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all"
          >
            Track My Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Report a City Concern</h1>
          <p className="text-zinc-500 font-medium">Use the map to pin issues and our AI will handle the rest.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-2xl text-primary-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          AI Classification Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Issue Title</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Broken water pipe near main square"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-lg font-semibold text-white focus:border-primary-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1 flex items-center gap-2">
                    Primary Category 
                    <span className="text-[10px] text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">AI Suggested</span>
                 </label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {CATEGORIES.map(cat => (
                     <button
                       key={cat.id}
                       type="button"
                       onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                       className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                         form.category === cat.id 
                           ? 'bg-primary-500/10 border-primary-500 text-white' 
                           : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 group'
                       }`}
                     >
                       <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
                       <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
                     </button>
                   ))}
                 </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Detailed Description</label>
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      isListening 
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isListening ? (
                      <><MicOff size={12} className="animate-pulse" /> Stop Listening</>
                    ) : (
                      <><Mic size={12} /> Voice Dictation</>
                    )}
                  </button>
                </div>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder="Provide any additional context, landmarks, or severity details..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-primary-500/50 outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                 <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Visual Evidence</label>
                 <Dropzone images={images} setImages={setImages} maxImages={3} />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="primary"
              className="w-full py-5 text-lg"
              icon={PlusCircle}
            >
              Submit Report to ColonyCare
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-6 rounded-3xl sticky top-8">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1 mb-4 block">Precise Location Pin</label>
              <MapPicker 
                position={location} 
                setPosition={setLocation} 
                onAddressChange={(addr) => setForm(p => ({ ...p, address: addr }))}
                className="h-[400px] mb-4" 
              />
              
              {form.address && (
                <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-start gap-3">
                  <MapPin size={16} className="text-primary-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase text-primary-500 tracking-wider mb-1">Detected Address</p>
                    <p className="text-sm text-zinc-300 font-medium leading-relaxed">{form.address}</p>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                 <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <AlertTriangle size={14} className="text-amber-500" />
                    Duplicate Prevention
                 </h4>
                 
                 <AnimatePresence mode="wait">
                    {isCheckingDuplicates ? (
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Loader2 className="animate-spin" size={14} />
                        Scanning vicinity for existing reports...
                      </div>
                    ) : duplicates.length > 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <p className="text-xs text-amber-500/80 font-medium">We found {duplicates.length} similar reports nearby. Please check if this issue is already reported:</p>
                        {duplicates.map(d => (
                          <div key={d.id} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs hover:border-white/10 cursor-pointer">
                            <p className="font-bold text-zinc-200">{d.title}</p>
                            <p className="text-zinc-500 mt-1">{d.status} • {d.upvotes} Upvotes</p>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-emerald-500/80">
                        <CheckCircle2 size={14} />
                        Unique report – Proceeding.
                      </div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
                 <Info className="text-primary-500 flex-shrink-0" size={16} />
                 <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                   Providing an accurate location and a clear photo helps the City AI prioritize and assign technicians faster.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
