import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Star,
  Share2,
  Trash2,
  Upload,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function Sidebar({ storageUsed = 0, storageLimit = 10737418240 }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to format bytes
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const usedFormatted = formatBytes(storageUsed);
  const limitFormatted = formatBytes(storageLimit);
  const percentage = Math.min(100, Math.round((storageUsed / storageLimit) * 100));

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Documents', path: '/documents', icon: FileText },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Important', path: '/important', icon: Star },
    { name: 'Shared with Me', path: '/shared', icon: Share2 },
    { name: 'Recycle Bin', path: '/trash', icon: Trash2 },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#0D0D0D] text-[#111111] dark:text-[#FFFFFF] min-h-screen border-r border-[#E2E2E2] dark:border-[#292929] shrink-0 select-none transition-colors">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#E2E2E2] dark:border-[#292929]">
        <div className="w-10 h-10 rounded-xl bg-[#111111]/5 dark:bg-white/10 p-1 flex items-center justify-center border border-[#E2E2E2] dark:border-[#353535] shadow-sm shrink-0">
          <img src={logoImg} alt="PaperlessDoc Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-[#111111] dark:text-white flex items-center gap-1.5">
            PaperlessDoc
          </h1>
          <p className="text-[11px] text-[#666666] dark:text-[#A5A5A5] font-medium">Digital Vault</p>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="px-4 pt-5 pb-3">
        <button
          onClick={() => navigate('/upload')}
          className="w-full bg-[#111111] hover:bg-[#242424] dark:bg-white dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A] font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition duration-200 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#111111] text-white dark:bg-[#242424] dark:text-white border border-transparent dark:border-[#353535] font-semibold shadow-sm'
                    : 'text-[#666666] dark:text-[#A5A5A5] hover:text-[#111111] dark:hover:text-white hover:bg-[#EBEBEB] dark:hover:bg-[#181818]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Storage Widget */}
      <div className="p-4 m-3 bg-[#F5F5F5] dark:bg-[#171717] rounded-2xl border border-[#E2E2E2] dark:border-[#292929]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#111111] dark:text-[#FFFFFF]">
            <HardDrive className="w-3.5 h-3.5 text-[#555555] dark:text-[#A5A5A5]" />
            <span>Storage Used</span>
          </div>
          <span className="text-xs font-bold text-[#111111] dark:text-white">{percentage}%</span>
        </div>

        <div className="w-full bg-[#E2E2E2] dark:bg-[#292929] h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-[#111111] dark:bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>

        <div className="text-[11px] text-[#666666] dark:text-[#A5A5A5] flex items-center justify-between">
          <span>{usedFormatted}</span>
          <span>of {limitFormatted}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E2E2E2] dark:border-[#292929] flex items-center gap-1.5 text-[11px] text-[#111111] dark:text-[#E5E5E5] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
          <span>Encrypted Vault Active</span>
        </div>
      </div>
    </aside>
  );
}
