import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  IdCard,
  HeartPulse,
  Briefcase,
  CreditCard,
  Folder,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Bell,
  Sparkles,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([
    'Education',
    'Identity',
    'Medical',
    'Career',
  ]);

  const [preferences, setPreferences] = useState({
    expiryReminders: true,
    smartOrganization: true,
    secureLock: false,
    emailNotifications: true,
  });

  const [loading, setLoading] = useState(false);

  const categoriesList = [
    {
      id: 'Education',
      name: 'Education',
      desc: 'Certificates, Marksheets, Degrees, etc.',
      icon: GraduationCap,
      color: 'text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60',
    },
    {
      id: 'Identity',
      name: 'Identity',
      desc: 'Aadhaar, PAN, Passport, Driving Licence, etc.',
      icon: IdCard,
      color: 'text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60',
    },
    {
      id: 'Medical',
      name: 'Medical',
      desc: 'Reports, Prescriptions, Vaccination, etc.',
      icon: HeartPulse,
      color: 'text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60',
    },
    {
      id: 'Career',
      name: 'Career',
      desc: 'Resume, Offer Letters, Experience, etc.',
      icon: Briefcase,
      color: 'text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60',
    },
    {
      id: 'Financial',
      name: 'Financial',
      desc: 'Bank Statements, Insurance, Tax, etc.',
      icon: CreditCard,
      color: 'text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60',
    },
    {
      id: 'Other',
      name: 'Other',
      desc: 'Any other personal documents',
      icon: Folder,
      color: 'text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60',
    },
  ];

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedCategories.length === 0) {
      showToast('Please select at least one category to continue', 'warning');
      return;
    }
    setStep(step + 1);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      await completeOnboarding(selectedCategories, preferences);

      // Trigger celebratory confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast('Vault initialized successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Failed to save onboarding preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#080808] text-[#111111] dark:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between py-4 border-b border-[#E2E2E2] dark:border-[#292929]">
        <div className="flex items-center gap-3">
          <div className="bg-[#111111]/5 dark:bg-white/10 p-1.5 rounded-xl border border-[#E2E2E2] dark:border-[#353535] flex items-center justify-center">
            <img
              src={logoImg}
              alt="PaperlessDoc Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-lg text-[#111111] dark:text-white">PaperlessDoc</span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] hover:text-[#111111] dark:hover:text-white transition"
        >
          Skip for now
        </button>
      </header>

      {/* Main Card */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Step Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] mb-2">
              <span className={step === 1 ? 'text-[#111111] dark:text-white font-bold' : ''}>
                1 — Categories
              </span>
              <span className={step === 2 ? 'text-[#111111] dark:text-white font-bold' : ''}>
                2 — Preferences
              </span>
              <span className={step === 3 ? 'text-[#111111] dark:text-white font-bold' : ''}>
                3 — Done
              </span>
            </div>
            <div className="w-full bg-[#EBEBEB] dark:bg-[#181818] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#111111] dark:bg-white h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Categories */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
                  Step 1 of 3
                </span>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white mt-1">
                  What will you store?
                </h2>
                <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-1">
                  Select the document categories you want to organize. You can always change this later.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {categoriesList.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#111111] bg-[#F5F5F5] dark:border-white dark:bg-[#181818] shadow-md'
                          : 'border-[#E2E2E2] dark:border-[#292929] bg-white dark:bg-[#111111] hover:border-[#3A3A3A]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${cat.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-semibold text-sm text-[#111111] dark:text-white">{cat.name}</h4>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-[#111111] dark:text-white focus:ring-0"
                          />
                        </div>
                        <p className="text-[11px] text-[#666666] dark:text-[#A5A5A5] leading-tight">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  onClick={handleNext}
                  className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-3 px-7 rounded-xl flex items-center gap-2 text-xs shadow-md transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Preferences */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
                  Step 2 of 3
                </span>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white mt-1">
                  Set your preferences
                </h2>
                <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-1">
                  Choose a few options to personalize your vault experience.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'expiryReminders',
                    title: 'Expiry reminders',
                    desc: 'Get notified before your documents expire (e.g. Passport, Licence, Insurance).',
                    icon: Bell,
                  },
                  {
                    key: 'smartOrganization',
                    title: 'Smart organization',
                    desc: 'Automatically suggest categories based on uploaded file names.',
                    icon: Sparkles,
                  },
                  {
                    key: 'secureLock',
                    title: 'Secure lock',
                    desc: 'Require re-authentication after idle period.',
                    icon: ShieldCheck,
                  },
                  {
                    key: 'emailNotifications',
                    title: 'Email notifications',
                    desc: 'Receive important updates and security alerts on your registered email.',
                    icon: Mail,
                  },
                ].map((pref) => {
                  const Icon = pref.icon;
                  return (
                    <div
                      key={pref.key}
                      className="p-4 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#181818] border border-[#E2E2E2] dark:border-[#353535] text-[#111111] dark:text-white flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[#111111] dark:text-white">
                            {pref.title}
                          </h4>
                          <p className="text-xs text-[#666666] dark:text-[#A5A5A5] leading-tight">
                            {pref.desc}
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={preferences[pref.key]}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              [pref.key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#EBEBEB] dark:bg-[#292929] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#111111] dark:peer-checked:bg-white" />
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] hover:text-[#111111] dark:hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-3 px-7 rounded-xl flex items-center gap-2 text-xs shadow-md transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Done */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center mx-auto shadow-xl border-4 border-[#E2E2E2] dark:border-[#353535]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-[#111111] dark:text-white">You're all set!</h2>
                <p className="text-xs text-[#666666] dark:text-[#A5A5A5] max-w-md mx-auto mt-2 leading-relaxed">
                  Your PaperlessDoc account is initialized. Let's keep your important documents organized and accessible — always.
                </p>
              </div>

              <div className="p-4 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl max-w-md mx-auto text-left space-y-2 text-xs text-[#111111] dark:text-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111] dark:text-white shrink-0" />
                  <span>Account created for {user?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111] dark:text-white shrink-0" />
                  <span>{selectedCategories.length} categories configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111] dark:text-white shrink-0" />
                  <span>10 GB encrypted personal storage ready</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={loading}
                className="w-full max-w-md bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl transition transform hover:-translate-y-0.5 mx-auto"
              >
                <span>{loading ? 'Finalizing Setup...' : 'Go to Dashboard'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center text-xs text-[#777777] py-2">
        PaperlessDoc • Secure Personal Vault
      </footer>
    </div>
  );
}
