import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  FolderTree,
  Bell,
  ArrowRight,
  Lock,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl w-full mx-auto border-b border-[#292929]">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded-xl border border-[#353535] flex items-center justify-center">
            <img
              src={logoImg}
              alt="PaperlessDoc Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">PaperlessDoc</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A5A5A5]">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#security" className="hover:text-white transition">Security</a>
          <a href="#categories" className="hover:text-white transition">Categories</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-[#0A0A0A] hover:bg-[#E5E5E5] text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#A5A5A5] hover:text-white px-4 py-2 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white hover:bg-[#E5E5E5] text-[#0A0A0A] text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section matching visual identity */}
      <section className="relative px-6 py-20 lg:py-28 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717] border border-[#292929] text-[#A5A5A5] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Secure • Organized • Always Accessible</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Your documents.{' '}
            <span className="text-[#B5B5B5]">
              One secure place.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#A5A5A5] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Store, organize, and access all your important documents — from academic marksheets, Aadhaar, and medical reports to professional certificates — in one encrypted digital locker.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-white hover:bg-[#E5E5E5] text-[#0A0A0A] font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition transform hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto bg-[#111111] hover:bg-[#181818] text-[#E5E5E5] border border-[#292929] font-semibold py-3.5 px-7 rounded-2xl flex items-center justify-center transition"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Quick tags */}
          <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-[#A5A5A5]">
            <span className="px-3 py-1 rounded-lg bg-[#111111] border border-[#292929]">Aadhaar Card</span>
            <span className="px-3 py-1 rounded-lg bg-[#111111] border border-[#292929]">Marksheets</span>
            <span className="px-3 py-1 rounded-lg bg-[#111111] border border-[#292929]">Degree & Diplomas</span>
            <span className="px-3 py-1 rounded-lg bg-[#111111] border border-[#292929]">Medical Reports</span>
            <span className="px-3 py-1 rounded-lg bg-[#111111] border border-[#292929]">Resume & Offer Letters</span>
          </div>
        </div>

        {/* Hero Illustration / Preview Graphic matching vault UI */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none flex justify-center">
          <div className="relative w-full max-w-md p-6 bg-[#111111] border border-[#292929] rounded-3xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#292929]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#353535]" />
                <div className="w-3 h-3 rounded-full bg-[#555555]" />
                <div className="w-3 h-3 rounded-full bg-[#777777]" />
              </div>
              <span className="text-xs font-mono text-[#707070]">paperlessdoc.vault</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#171717] rounded-2xl flex items-center justify-between border border-[#292929]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#242424] text-white flex items-center justify-center font-bold text-xs border border-[#3A3A3A]">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">B.Tech Marksheet.pdf</h4>
                    <span className="text-[10px] text-[#A5A5A5]">Education • 2.4 MB</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] bg-[#242424] text-[#E5E5E5] rounded-md font-semibold border border-[#3A3A3A]">
                  Education
                </span>
              </div>

              <div className="p-3 bg-[#171717] rounded-2xl flex items-center justify-between border border-[#292929]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#242424] text-white flex items-center justify-center font-bold text-xs border border-[#3A3A3A]">
                    ID
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Aadhaar Card.pdf</h4>
                    <span className="text-[10px] text-[#A5A5A5]">Identity • 1.1 MB</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] bg-[#242424] text-[#E5E5E5] rounded-md font-semibold border border-[#3A3A3A]">
                  Identity
                </span>
              </div>

              <div className="p-3 bg-[#171717] rounded-2xl flex items-center justify-between border border-[#292929]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#242424] text-white flex items-center justify-center font-bold text-xs border border-[#3A3A3A]">
                    DOC
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Medical Report.pdf</h4>
                    <span className="text-[10px] text-[#A5A5A5]">Medical • 3.5 MB</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] bg-[#242424] text-[#E5E5E5] rounded-md font-semibold border border-[#3A3A3A]">
                  Medical
                </span>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-[#171717] border border-[#292929] rounded-2xl flex items-center gap-3 text-xs text-[#E5E5E5] font-medium">
              <Lock className="w-4 h-4 text-white shrink-0" />
              <span>AES-256 Encrypted & Scoped User Authentication</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-16 px-6 bg-[#0D0D0D] border-t border-[#292929]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Designed for modern document management
            </h2>
            <p className="text-[#A5A5A5] text-sm">
              Keep your life’s crucial records organized, searchable, and always at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Secure Storage',
                desc: 'Your documents are strictly isolated per user with authentication.',
              },
              {
                icon: FolderTree,
                title: 'Smart Categories',
                desc: 'Organize by Education, Identity, Medical, Career, Financial, or custom folders.',
              },
              {
                icon: Search,
                title: 'Instant Search',
                desc: 'Quickly find any document by name, category, description, or custom tags.',
              },
              {
                icon: Bell,
                title: 'Expiry Reminders',
                desc: 'Receive alerts before passports, licences, or insurance documents expire.',
              },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-[#111111] border border-[#292929] rounded-3xl hover:border-white transition duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#181818] border border-[#353535] text-white flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[#A5A5A5] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#292929] bg-[#080808] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-1.5 rounded-xl border border-[#353535] flex items-center justify-center">
              <img src={logoImg} alt="PaperlessDoc Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-base text-white">PaperlessDoc</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#A5A5A5]">
            <Link to="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/login" className="hover:text-white transition">
              Login
            </Link>
            <Link to="/signup" className="hover:text-white transition">
              Create Account
            </Link>
          </div>

          <p className="text-xs text-[#707070]">
            © {new Date().getFullYear()} PaperlessDoc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
