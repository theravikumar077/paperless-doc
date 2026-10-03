import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      showToast(res.data.message, 'success');
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to process request', 'error');
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
              Forgot password?
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-1">
              Enter your email address to receive password reset instructions
            </p>
          </div>

          {!resetToken ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777] dark:text-[#707070]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-3 px-4 rounded-xl text-xs shadow-md transition duration-200"
              >
                {loading ? 'Sending Instructions...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl text-xs text-[#111111] dark:text-[#E5E5E5]">
                <p className="font-semibold mb-1">Reset token generated!</p>
                <p className="text-[11px]">Click the button below to proceed to reset password.</p>
              </div>

              <button
                onClick={() => navigate(`/reset-password/${resetToken}`)}
                className="w-full bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-3 px-4 rounded-xl text-xs shadow-md transition"
              >
                Reset Password Now
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#111111] dark:text-[#A5A5A5] dark:hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
