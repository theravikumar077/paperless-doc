import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Shield,
  HardDrive,
  Bell,
  Trash2,
  Lock,
  Moon,
  Sun,
  Laptop,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, changePassword, deleteAccount, theme, setTheme } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('account');

  // Account Tab State
  const [name, setName] = useState(user?.name || '');
  const [savingAccount, setSavingAccount] = useState(false);

  // Security Tab State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Delete Account Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingAccount(true);
      await updateProfile({ name: name.trim() });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    try {
      setChangingPass(true);
      await changePassword(currentPassword, newPassword);
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      showToast('Please type DELETE to confirm account removal', 'warning');
      return;
    }

    try {
      setDeleting(true);
      await deleteAccount('DELETE');
      showToast('Account deleted permanently.', 'info');
    } catch (err) {
      showToast('Failed to delete account', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const storageUsed = user?.storageUsed || 0;
  const storageLimit = user?.storageLimit || 10737418240;
  const storagePercentage = Math.min(
    100,
    Math.round((storageUsed / storageLimit) * 100)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] flex items-center justify-center font-bold text-3xl shrink-0 shadow-sm border border-neutral-800 dark:border-neutral-200">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl font-bold text-[#111111] dark:text-white truncate">
            {user?.name}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
            {user?.email}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-[#111111] dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-full text-[11px] font-semibold">
            <span>Encrypted Vault Active</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#E2E2E2] dark:border-[#292929] pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'account', label: 'Account', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'storage', label: 'Storage', icon: HardDrive },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Account */}
      {activeTab === 'account' && (
        <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
          <h3 className="font-bold text-base text-[#111111] dark:text-white pb-3 border-b border-[#E2E2E2] dark:border-[#292929]">
            Account Settings
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address (Primary)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 border border-[#E2E2E2] dark:border-[#292929] rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Appearance Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Laptop },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                        theme === t.id
                          ? 'border-[#111111] dark:border-white bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A]'
                          : 'border-[#E2E2E2] dark:border-[#292929] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={savingAccount}
              className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold py-2.5 px-5 rounded-xl text-xs shadow-sm transition"
            >
              {savingAccount ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Account Danger Zone */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-rose-600 uppercase tracking-wider">
              Danger Zone
            </h4>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-semibold text-xs text-slate-900 dark:text-white">
                  Delete PaperlessDoc Account
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Permanently delete your account and remove all stored documents.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-sm shrink-0 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Security */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
          <h3 className="font-bold text-base text-[#111111] dark:text-white pb-3 border-b border-[#E2E2E2] dark:border-[#292929] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#111111] dark:text-white" />
            Security & Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold py-2.5 px-5 rounded-xl text-xs shadow-sm transition"
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Storage */}
      {activeTab === 'storage' && (
        <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
          <h3 className="font-bold text-base text-[#111111] dark:text-white pb-3 border-b border-[#E2E2E2] dark:border-[#292929] flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#111111] dark:text-white" />
            Storage Breakdown
          </h3>

          <div className="space-y-4 max-w-lg">
            <div className="p-5 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-[#E2E2E2] dark:border-[#292929] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                <span>Vault Capacity</span>
                <span className="text-[#111111] dark:text-white font-bold">
                  {storagePercentage}% Used
                </span>
              </div>

              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#111111] dark:bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(storagePercentage, 1)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{formatBytes(storageUsed)}</span>
                <span>of {formatBytes(storageLimit)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
          <h3 className="font-bold text-base text-[#111111] dark:text-white pb-3 border-b border-[#E2E2E2] dark:border-[#292929] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#111111] dark:text-white" />
            Notification Settings
          </h3>

          <div className="space-y-3 max-w-lg">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-[#E2E2E2] dark:border-[#292929] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#111111] dark:text-white">
                  Document Expiry Alerts
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Receive notifications before your documents expire
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-[#111111] focus:ring-[#111111]"
              />
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-[#E2E2E2] dark:border-[#292929] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#111111] dark:text-white">
                  Email Notifications
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Send email digest for document shares & security updates
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-[#111111] focus:ring-[#111111]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete your account?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This action will permanently delete your account and all associated document files from disk. Type{' '}
              <strong className="text-rose-600 font-mono">DELETE</strong> below to confirm.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-rose-500 font-mono"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || deleteConfirmText !== 'DELETE'}
                  className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl shadow-md"
                >
                  {deleting ? 'Deleting Account...' : 'Delete Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
