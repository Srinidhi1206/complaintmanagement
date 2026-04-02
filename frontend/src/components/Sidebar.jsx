import { motion } from 'framer-motion';
import { 
  Home, 
  Map as MapIcon, 
  PlusCircle, 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
    {active && (
      <motion.div
        layoutId="active-pill"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
      />
    )}
  </motion.button>
);

export default function Sidebar({ activePage, setActivePage }) {
  const { user, logoutUser } = useAuth();

  const menuItems = user?.role === 'USER' ? [
    { id: 'feed', label: 'City Feed', icon: MapIcon },
    { id: 'my-complaints', label: 'My Reports', icon: User },
    { id: 'submit', label: 'New Complaint', icon: PlusCircle },
  ] : [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-complaints', label: 'Management', icon: Home },
    { id: 'feed', label: 'Live Map', icon: MapIcon },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <MapIcon className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Colony<span className="text-primary-400">Care</span></h1>
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Smarter Communities</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activePage === item.id}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-xs font-bold uppercase">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase leading-none mt-1">{user?.role}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={logoutUser}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
