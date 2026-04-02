import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Sidebar from './components/Sidebar';
import MapFeedPage from './pages/MapFeedPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import './index.css';

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(() => {
    if (!user) return 'auth';
    return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'admin-dashboard' : 'feed';
  });

  if (!user) return <AuthPage />;

  const renderPage = () => {
    switch (activePage) {
      case 'feed':             return <MapFeedPage />;
      case 'my-complaints':    return <MyComplaintsPage onNavigate={setActivePage} />;
      case 'submit':           return <SubmitComplaintPage onNavigate={setActivePage} />;
      case 'admin-dashboard':  return <AdminDashboardPage />;
      case 'admin-complaints': return <AdminComplaintsPage />;
      default:                 return <MapFeedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 ml-64 p-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}
