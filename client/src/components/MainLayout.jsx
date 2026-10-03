import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';
import api from '../services/api';

export default function MainLayout() {
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(10737418240);
  const location = useLocation();

  const fetchStorageInfo = async () => {
    try {
      const res = await api.get('/documents/dashboard-stats');
      if (res.data && res.data.data) {
        setStorageUsed(res.data.data.storageUsed || 0);
        setStorageLimit(res.data.data.storageLimit || 10737418240);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStorageInfo();
  }, [location.pathname]);

  // Determine title for mobile header
  const getPageTitle = (path) => {
    if (path === '/dashboard') return 'PaperlessDoc';
    if (path.startsWith('/documents/')) return 'Document Details';
    if (path === '/documents') return 'My Documents';
    if (path === '/upload') return 'Upload Document';
    if (path === '/categories') return 'Document Categories';
    if (path.startsWith('/categories/')) return 'Category Documents';
    if (path === '/important') return 'Important Documents';
    if (path === '/shared') return 'Shared Links';
    if (path === '/trash') return 'Recycle Bin';
    if (path === '/notifications') return 'Notifications';
    if (path === '/profile' || path.startsWith('/settings')) return 'Profile & Settings';
    return 'PaperlessDoc';
  };

  const showBack = location.pathname.includes('/documents/') || location.pathname.includes('/categories/');

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar storageUsed={storageUsed} storageLimit={storageLimit} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <TopNav />
        <MobileHeader title={getPageTitle(location.pathname)} showBack={showBack} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshStorage: fetchStorageInfo }} />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
