import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      showToast('Password reset successful! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid or expired token', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#080808] text-[#111111] dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex flex-col items-center gap-2 mb-4">
          <div className="bg-[#111111]/5 dark:bg-white/10 p-2 rounded-2xl border border-[#E2E2E2] dark:border-[#353535] flex items-center justify-center">
            <img
              src={logoImg}
              alt="PaperlessDoc Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#111111] dark:text-white">
            PaperlessDoc
          </span>
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#111111] py-8 px-6 shadow-xl rounded-3xl border border-[#E2E2E2] dark:border-[#292929] sm:px-10">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-[#111111] dark:text-white">
              Set New Password
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-1">
              Enter your new secure password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777] dark:text-[#707070]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777] dark:text-[#707070]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-3 px-4 rounded-xl text-xs shadow-md transition"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
