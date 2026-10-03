import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Shield, Upload, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (e) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read');
      showToast('All notifications marked as read', 'success');
      fetchNotifications();
    } catch (e) {
      showToast('Failed to update notifications', 'error');
    }
  };

  const clearAll = async () => {
    try {
      await api.delete('/notifications');
      showToast('Notifications cleared', 'info');
      setNotifications([]);
    } catch (e) {
      showToast('Failed to clear notifications', 'error');
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'upload':
        return <Upload className="w-5 h-5 text-[#111111] dark:text-white" />;
      case 'expiry':
        return <Clock className="w-5 h-5 text-[#111111] dark:text-white" />;
      case 'security':
        return <Shield className="w-5 h-5 text-[#111111] dark:text-white" />;
      default:
        return <Bell className="w-5 h-5 text-[#111111] dark:text-white" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#111111] dark:text-white" />
            Notifications
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            System alerts, expiry reminders, and security logs
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="py-2 px-3 bg-neutral-100 dark:bg-neutral-800 text-[#111111] dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={clearAll}
              className="py-2 px-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! System notifications and document expiry alerts will appear here."
          actionText=""
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 bg-white dark:bg-[#111111] border rounded-2xl flex items-start gap-3.5 transition ${
                !n.isRead
                  ? 'border-[#111111] dark:border-white bg-neutral-100/50 dark:bg-neutral-800/40'
                  : 'border-[#E2E2E2] dark:border-[#292929]'
              }`}
            >
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 text-[#111111] dark:text-white rounded-xl shrink-0">
                {getNotifIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-semibold text-sm text-[#111111] dark:text-white">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(n.createdAt).toLocaleDateString()}{' '}
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
