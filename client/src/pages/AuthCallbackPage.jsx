import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleTokenLogin } = useAuth();
  const { showToast } = useToast();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      let msg = 'Google sign-in failed. Please try again.';
      if (error === 'google_access_denied' || error === 'google_auth_cancelled' || error === 'access_denied') {
        msg = 'Google sign-in was cancelled or denied. Please try again.';
      } else if (error === 'redirect_uri_mismatch') {
        msg = 'Google OAuth redirect URI mismatch. Please check Google Cloud Console settings.';
      } else if (error === 'google_email_missing') {
        msg = 'Google account email unavailable.';
      } else if (error === 'google_oauth_misconfigured') {
        msg = 'Google OAuth is misconfigured on the server.';
      }

      showToast(msg, 'error');
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      handleTokenLogin(token)
        .then((userData) => {
          showToast(`Welcome back, ${userData.name}!`, 'success');
          if (!userData.isOnboarded) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        })
        .catch((err) => {
          console.error('Failed to complete Google authentication:', err);
          showToast(
            'Authentication session error. Please try logging in again.',
            'error'
          );
          navigate('/login', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, handleTokenLogin, showToast]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#080808] text-[#111111] dark:text-white flex flex-col items-center justify-center space-y-4 select-none">
      <div className="w-16 h-16 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center border border-neutral-300 dark:border-neutral-800 shadow-2xl">
        <img src={logoImg} alt="PaperlessDoc" className="w-full h-full object-contain" />
      </div>
      <h2 className="font-bold text-lg tracking-tight text-[#111111] dark:text-white">
        Completing sign-in...
      </h2>
      <div className="w-6 h-6 border-2 border-neutral-600 dark:border-neutral-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
