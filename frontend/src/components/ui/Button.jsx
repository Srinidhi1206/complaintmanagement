import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  isLoading = false, 
  isDisabled = false, 
  className = '',
  icon: Icon
}) {
  const baseStyles = "relative flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-2xl transition-all duration-300 overflow-hidden outline-none group";
  
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] focus:ring-4 focus:ring-primary-500/20",
    secondary: "bg-white text-black hover:bg-zinc-200 focus:ring-4 focus:ring-white/20",
    outline: "border border-zinc-700 hover:bg-zinc-800 text-white focus:ring-4 focus:ring-zinc-700/50",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isLoading || isDisabled}
      whileHover={{ scale: isDisabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {children}
          {Icon && <Icon size={18} className="transition-transform group-hover:translate-x-1" />}
        </>
      )}
    </motion.button>
  );
}
