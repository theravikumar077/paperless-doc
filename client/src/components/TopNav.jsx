import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  CheckCheck,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function TopNav({ onSearch }) {
  const { user, logout, theme, setTheme } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const menuRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        navigate(`/documents?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const markNotificationsRead = async () => {
    try {
      await api.put('/notifications/read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const clearNotifications = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-white dark:bg-[#0D0D0D] border-b border-[#E2E2E2] dark:border-[#292929] sticky top-0 z-30 transition-colors">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777] dark:text-[#707070]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents, categories..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-[#FFFFFF] rounded-xl border border-[#E2E2E2] dark:border-[#292929] focus:border-[#111111] dark:focus:border-white focus:bg-white dark:focus:bg-[#111111] focus:outline-none transition-all placeholder:text-[#777777] dark:placeholder:text-[#707070]"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2 text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl transition"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-[#111111]" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#111111] dark:bg-white rounded-full border-2 border-white dark:border-[#0D0D0D]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[#E2E2E2] dark:border-[#292929] overflow-hidden z-50">
              <div className="p-4 border-b border-[#E2E2E2] dark:border-[#292929] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#111111] dark:text-[#FFFFFF] text-sm">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markNotificationsRead}
                    title="Mark all as read"
                    className="p-1 hover:bg-[#EBEBEB] dark:hover:bg-[#171717] text-[#666666] dark:text-[#A5A5A5] rounded-lg"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearNotifications}
                    title="Clear all"
                    className="p-1 hover:bg-[#EBEBEB] dark:hover:bg-[#171717] text-[#666666] dark:text-[#A5A5A5] rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E2E2] dark:divide-[#292929]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[#777777] dark:text-[#707070] text-xs">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3.5 text-xs transition ${
                        !n.isRead
                          ? 'bg-[#EBEBEB]/60 dark:bg-[#171717]'
                          : 'hover:bg-[#F5F5F5] dark:hover:bg-[#171717]/50'
                      }`}
                    >
                      <div className="font-semibold text-[#111111] dark:text-[#FFFFFF] mb-0.5">
                        {n.title}
                      </div>
                      <div className="text-[#666666] dark:text-[#A5A5A5] mb-1">
                        {n.message}
                      </div>
                      <div className="text-[10px] text-[#777777] dark:text-[#707070]">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pl-2 hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl transition"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center font-bold text-sm shadow-sm border border-[#3A3A3A] dark:border-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-semibold text-[#111111] dark:text-[#FFFFFF]">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-4 h-4 text-[#777777] dark:text-[#707070]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[#E2E2E2] dark:border-[#292929] py-1.5 z-50">
              <div className="px-4 py-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                <p className="text-xs font-semibold text-[#111111] dark:text-[#FFFFFF] truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[#666666] dark:text-[#A5A5A5] truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] transition"
              >
                <User className="w-4 h-4 text-[#777777] dark:text-[#707070]" />
                <span>Profile & Settings</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] transition"
              >
                <Settings className="w-4 h-4 text-[#777777] dark:text-[#707070]" />
                <span>Account Settings</span>
              </Link>

              <div className="my-1 border-t border-[#E2E2E2] dark:border-[#292929]" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
