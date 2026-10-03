import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, Plus, FolderTree, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Documents', path: '/documents', icon: FileText },
    // Center Floating Upload Button handled separately below
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md border-t border-[#E2E2E2] dark:border-[#292929] px-4 py-2">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* First 2 items */}
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-xl transition ${
                  isActive
                    ? 'text-[#111111] dark:text-white font-semibold'
                    : 'text-[#666666] dark:text-[#A5A5A5] hover:text-[#111111] dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {/* Center Floating Plus Upload Button */}
        <div className="-mt-7">
          <button
            onClick={() => navigate('/upload')}
            className="w-12 h-12 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center shadow-lg border-4 border-[#F5F5F5] dark:border-[#080808] active:scale-95 transition transform hover:bg-[#242424] dark:hover:bg-[#E5E5E5]"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Next 2 items */}
        {navItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-xl transition ${
                  isActive
                    ? 'text-[#111111] dark:text-white font-semibold'
                    : 'text-[#666666] dark:text-[#A5A5A5] hover:text-[#111111] dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
