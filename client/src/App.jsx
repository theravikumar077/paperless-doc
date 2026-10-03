import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import MainLayout from './components/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import UploadPage from './pages/UploadPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ImportantPage from './pages/ImportantPage';
import SharedPage from './pages/SharedPage';
import TrashPage from './pages/TrashPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import PublicSharePage from './pages/PublicSharePage';

import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

import logoImg from './assets/paperlessdoc-logo.png';

// Protected Route Guard Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center space-y-4 select-none">
        <div className="w-16 h-16 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center border border-neutral-800 shadow-2xl">
          <img src={logoImg} alt="PaperlessDoc" className="w-full h-full object-contain" />
        </div>
        <h2 className="font-bold text-lg tracking-tight text-white">PaperlessDoc</h2>
        <div className="w-6 h-6 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Onboarding Guard Component (Ensures user completes onboarding first)
const OnboardingGuard = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user && !user.isOnboarded && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Public Route Guard (Redirects logged-in users from login/signup to dashboard)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/public/share/:token" element={<PublicSharePage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Protected Onboarding Flow */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Application Routes inside MainLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <MainLayout />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/documents/:id" element={<DocumentDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:category" element={<CategoryDetailPage />} />
              <Route path="/important" element={<ImportantPage />} />
              <Route path="/shared" element={<SharedPage />} />
              <Route path="/trash" element={<TrashPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<ProfilePage />} />
              <Route path="/settings/*" element={<ProfilePage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
