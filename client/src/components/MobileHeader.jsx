import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function MobileHeader({ title, showBack = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white dark:bg-[#0D0D0D] border-b border-[#E2E2E2] dark:border-[#292929] sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="bg-[#111111]/5 dark:bg-white/10 p-1 rounded-lg border border-[#E2E2E2] dark:border-[#353535] flex items-center justify-center shrink-0">
            <img
              src={logoImg}
              alt="PaperlessDoc Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
        )}
        <h1 className="font-bold text-base text-[#111111] dark:text-white tracking-tight truncate">
          {title || 'PaperlessDoc'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/documents')}
          className="p-2 text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
