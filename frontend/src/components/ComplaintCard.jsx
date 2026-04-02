import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  ArrowBigUp, 
  Clock, 
  Tag,
  Calendar
} from 'lucide-react';

function getTimeSince(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const created = new Date(dateStr);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHrs > 0) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
  return `${diffMins} min ago`;
}

const priorityColors = {
  LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  URGENT: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusColors = {
  PENDING: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  IN_PROGRESS: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  RESOLVED: 'bg-accent/10 text-accent border-accent/20',
};

export default function ComplaintCard({ complaint, onUpvote, onStatusChange, isAdmin }) {
  const timeSince = getTimeSince(complaint.createdAt);
  const isPending = complaint.status === 'PENDING';
  const pendingDays = complaint.createdAt
    ? Math.floor((new Date() - new Date(complaint.createdAt)) / 86400000)
    : 0;

  const handleUpvoteClick = async () => {
    if (onUpvote) {
      await onUpvote(complaint.id);
      toast.success('Upvoted! This issue gains priority.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {complaint.images && complaint.images.length > 0 && (
        <div className="relative h-48 overflow-hidden group">
          <img 
            src={complaint.images[0]} 
            alt={complaint.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityColors[complaint.priority]}`}>
              {complaint.priority}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[complaint.status]}`}>
                {complaint.status?.replace('_', ' ')}
               </span>
               <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase">
                 <Tag size={10} />
                 {complaint.category}
               </span>
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
              {complaint.title}
            </h3>
          </div>
          
          <div className="flex flex-col items-center">
             <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleUpvoteClick}
              className="group flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary-500/10 transition-colors"
            >
              <ArrowBigUp className={`transition-colors ${complaint.upvotes > 0 ? 'text-primary-500 fill-primary-500' : 'text-zinc-600 group-hover:text-primary-400'}`} size={24} />
              <span className="text-xs font-bold">{complaint.upvotes}</span>
            </motion.button>
          </div>
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 leading-relaxed">
          {complaint.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MapPin size={12} className="text-primary-500 shrink-0" />
            <span className="truncate max-w-[140px]">{complaint.address || 'Location Detected'}</span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs font-semibold">
             {isPending && pendingDays > 0 && (
               <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                 <Clock size={11} /> Pending {pendingDays}d
               </span>
             )}
             {complaint.estimatedResolutionDays && complaint.status !== 'RESOLVED' && (
               <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                 <Calendar size={11} /> ETA {complaint.estimatedResolutionDays}d
               </span>
             )}
             <span className="flex items-center gap-1 text-zinc-600">
               <Clock size={11} />
               {timeSince}
             </span>
          </div>
        </div>

        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
            <select 
              value={complaint.status}
              onChange={(e) => onStatusChange(complaint.id, e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-primary-500 transition-colors"
            >
              <option value="PENDING">SET PENDING</option>
              <option value="IN_PROGRESS">SET IN PROGRESS</option>
              <option value="RESOLVED">SET RESOLVED</option>
            </select>
          </div>
        )}
      </div>
    </motion.div>
  );
}
