import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      let msg = 'Google sign-in failed. Please try again.';
      if (errorParam === 'google_access_denied' || errorParam === 'google_auth_cancelled' || errorParam === 'access_denied') {
        msg = 'Google sign-in was cancelled or denied. Please try again.';
      } else if (errorParam === 'redirect_uri_mismatch') {
        msg = 'Google OAuth redirect URI mismatch. Please check Google Cloud Console settings.';
      } else if (errorParam === 'google_email_missing') {
        msg = 'Google account email is missing or unavailable.';
      } else if (errorParam === 'google_oauth_misconfigured') {
        msg = 'Google OAuth configuration is incomplete on the server.';
      }
      showToast(msg, 'error');
    }
  }, [searchParams, showToast]);

  const handleGoogleSignIn = () => {
    setLoading(true);
    const backendUrl = import.meta.env.VITE_API_URL || '';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      const userData = await login(email.trim(), password);
      showToast(`Welcome back, ${userData.name}!`, 'success');

      if (!userData.isOnboarded) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Invalid credentials. Please try again.',
        'error'
      );
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
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
              Welcome back
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-1">
              Your documents. One secure place.
            </p>
          </div>

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

            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777] dark:text-[#707070]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#111111] dark:text-white focus:ring-0"
                />
                <span className="text-[#666666] dark:text-[#A5A5A5]">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-[#111111] dark:text-white hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition duration-200"
            >
              <span>{loading ? 'Signing in...' : 'Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E2E2] dark:border-[#292929]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-semibold">
              <span className="bg-white dark:bg-[#111111] px-3 text-[#777777] dark:text-[#707070]">
                OR
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleGoogleSignIn()}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-[#F0F0F0] dark:bg-[#181818] dark:hover:bg-[#222222] border border-[#E2E2E2] dark:border-[#333333] rounded-xl text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="mt-6 text-center text-xs text-[#666666] dark:text-[#A5A5A5]">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-[#111111] dark:text-white hover:underline"
            >
              Create account
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-[#E2E2E2] dark:border-[#292929] flex items-center justify-center gap-4 text-[11px] text-[#777777] dark:text-[#707070]">
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
