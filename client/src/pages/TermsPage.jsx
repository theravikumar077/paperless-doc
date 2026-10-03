import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import logoImg from '../assets/paperlessdoc-logo.png';

const termsSections = [
  { id: 'about', title: '1. About PaperlessDoc' },
  { id: 'account', title: '2. Your Account' },
  { id: 'content', title: '3. Your Documents and Content' },
  { id: 'storage', title: '4. Document Storage' },
  { id: 'sharing', title: '5. Document Sharing' },
  { id: 'prohibited', title: '6. Prohibited Use' },
  { id: 'suspension', title: '7. Account Suspension or Termination' },
  { id: 'availability', title: '8. Service Availability' },
  { id: 'third-party', title: '9. Third-Party Services' },
  { id: 'ip', title: '10. Intellectual Property' },
  { id: 'disclaimer', title: '11. Disclaimer' },
  { id: 'service-changes', title: '12. Changes to the Service' },
  { id: 'terms-changes', title: '13. Changes to These Terms' },
  { id: 'contact', title: '14. Contact' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('about');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = 'PaperlessDoc — Terms of Service';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 180;
      for (const section of termsSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setShowMobileToc(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#080808] text-[#111111] dark:text-white flex flex-col font-sans transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#E2E2E2] dark:border-[#292929]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[#111111]/5 dark:bg-white/10 p-1.5 rounded-xl border border-[#E2E2E2] dark:border-[#353535] group-hover:scale-105 transition">
              <img src={logoImg} alt="PaperlessDoc Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-lg text-[#111111] dark:text-white">PaperlessDoc</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] hover:text-[#111111] dark:hover:text-white px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Back to Home
            </Link>
            <Link
              to="/login"
              className="text-xs font-semibold text-[#111111] dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-[#E2E2E2] dark:border-[#333333] px-3.5 py-2 rounded-xl transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-xs font-bold bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] px-4 py-2 rounded-xl shadow-sm transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {/* Header Block */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-200/60 dark:bg-neutral-800/80 border border-[#E2E2E2] dark:border-[#333333] rounded-full text-xs font-medium text-[#666666] dark:text-[#A5A5A5] mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-white">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#A5A5A5] mt-2 leading-relaxed">
            Please read these terms carefully before using PaperlessDoc.
          </p>
          <p className="text-xs font-semibold text-[#777777] dark:text-[#707070] mt-3">
            Last Updated: October 2, 2026
          </p>
        </div>

        {/* Mobile TOC Collapsible Dropdown */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileToc(!showMobileToc)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl text-xs font-bold text-[#111111] dark:text-white shadow-sm"
          >
            <span>Table of Contents</span>
            {showMobileToc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMobileToc && (
            <div className="mt-2 p-3 bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl shadow-lg space-y-1">
              {termsSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl transition ${
                    activeSection === sec.id
                      ? 'bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] font-bold'
                      : 'text-[#666666] dark:text-[#A5A5A5] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-3xl p-5 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777] dark:text-[#707070] px-2 mb-2">
                Table of Contents
              </h3>
              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 no-scrollbar">
                {termsSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl transition leading-snug ${
                      activeSection === sec.id
                        ? 'bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] font-bold shadow-sm'
                        : 'text-[#666666] dark:text-[#A5A5A5] hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Document Content Card */}
          <article className="lg:col-span-3 bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-3xl p-6 sm:p-10 shadow-sm space-y-10">
            {/* Section 1 */}
            <section id="about" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                1. About PaperlessDoc
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                PaperlessDoc is a digital document vault and personal record management platform designed to organize, store, access, and share your personal and professional documents securely. By accessing, registering for, or using PaperlessDoc, you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service.
              </p>
            </section>

            {/* Section 2 */}
            <section id="account" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                2. Your Account
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                To access and use PaperlessDoc services, you must register for an account. You agree to fulfill the following obligations regarding your account:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>Provide accurate, current, and complete account information during signup.</li>
                <li>Maintain and promptly update your profile information as necessary.</li>
                <li>Safeguard your authentication credentials and keep your account password confidential.</li>
                <li>Accept full responsibility for all activities that occur under your account.</li>
                <li>Notify PaperlessDoc immediately if you suspect any unauthorized access or security breach.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="content" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                3. Your Documents and Content
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                You retain full ownership, intellectual property rights, and copyright to all documents, files, metadata, and data uploaded to your PaperlessDoc vault. PaperlessDoc does not claim any ownership rights over your uploaded content.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                By uploading documents, you grant PaperlessDoc a limited, non-exclusive, world-wide license solely to host, store, transfer, render, and display your files as necessary to provide the service to you and any recipients you explicitly authorize through share links.
              </p>
            </section>

            {/* Section 4 */}
            <section id="storage" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                4. Document Storage
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                PaperlessDoc provides allocated digital storage capacity for your account. Storage rules and guidelines include:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>You are responsible for managing your storage limit as displayed in your account settings.</li>
                <li>Files exceeding account storage limits may be restricted from uploading until space is freed.</li>
                <li>Documents moved to the Recycle Bin remain accessible for restoration unless permanently purged.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="sharing" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                5. Document Sharing
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                PaperlessDoc features secure document sharing via unique public access tokens. When generating share links:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>You are solely responsible for determining who receives your generated share links.</li>
                <li>Anyone with access to an active share link can view or download the linked document.</li>
                <li>You may set expiration dates or manually revoke share links at any time through your dashboard.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="prohibited" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                6. Prohibited Use
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                You agree not to misuse PaperlessDoc services. Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>Uploading, storing, or transmitting illegal, fraudulent, or infringing material.</li>
                <li>Attempting to compromise, probe, or breach the security or authentication of the platform.</li>
                <li>Uploading viruses, malware, ransomware, or malicious code designed to harm systems.</li>
                <li>Engaging in automated scraping, unauthorized API spamming, or denial-of-service attacks.</li>
                <li>Impersonating any individual or entity or misrepresenting your affiliation.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="suspension" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                7. Account Suspension or Termination
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                PaperlessDoc reserves the right to suspend or terminate your account and access to the service at our discretion, without prior notice, if:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>You commit a material breach of these Terms of Service.</li>
                <li>Your account is engaged in illegal or fraudulent operations.</li>
                <li>Required by law enforcement or governmental authority request.</li>
              </ul>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                You may also delete your account at any time via your account settings. Account deletion permanently purges all stored documents.
              </p>
            </section>

            {/* Section 8 */}
            <section id="availability" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                8. Service Availability
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We continuously strive to maintain high service availability and operational reliability. However, PaperlessDoc is provided on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee uninterrupted, error-free, or 100% bug-free service execution during regular maintenance windows or technical downtime.
              </p>
            </section>

            {/* Section 9 */}
            <section id="third-party" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                9. Third-Party Services
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                PaperlessDoc integrates with third-party authentication services, such as Google Sign-In (OAuth 2.0). Your use of third-party login mechanisms is subject to the privacy policy and terms of service of the respective third-party provider.
              </p>
            </section>

            {/* Section 10 */}
            <section id="ip" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                10. Intellectual Property
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                The PaperlessDoc platform name, trademarks, official brand assets, source code, user interface designs, and visual branding are the exclusive property of PaperlessDoc. Nothing in these terms grants you rights to use PaperlessDoc logos or trademarks without prior written consent.
              </p>
            </section>

            {/* Section 11 */}
            <section id="disclaimer" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                11. Disclaimer
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAPERLESSDOC AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES, INCLUDING LOSS OF DATA, REVENUE, OR UNAUTHORIZED ACCESS ARISING OUT OF YOUR USE OF THE SERVICE.
              </p>
            </section>

            {/* Section 12 */}
            <section id="service-changes" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                12. Changes to the Service
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We reserve the right to modify, enhance, or discontinue features of PaperlessDoc at any time to improve system security, compliance, performance, or overall user experience.
              </p>
            </section>

            {/* Section 13 */}
            <section id="terms-changes" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                13. Changes to These Terms
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We may revise these Terms of Service periodically. When changes occur, we will update the "Last Updated" date at the top of this document. Continued use of PaperlessDoc after updates take effect signifies your binding acceptance of the revised terms.
              </p>
            </section>

            {/* Section 14 */}
            <section id="contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                14. Contact
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                If you have questions, feedback, or concerns regarding these Terms of Service, please reach out through the official PaperlessDoc support channels within your account dashboard.
              </p>
            </section>
          </article>
        </div>
      </main>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] rounded-2xl shadow-xl transition flex items-center justify-center border border-neutral-700 dark:border-neutral-300"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E2E2E2] dark:border-[#292929] bg-white dark:bg-[#0D0D0D] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="PaperlessDoc" className="w-6 h-6 object-contain" />
              <span className="font-bold text-base text-[#111111] dark:text-white">PaperlessDoc</span>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#A5A5A5]">
              Your documents. One secure place.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#666666] dark:text-[#A5A5A5]">
            <Link to="/terms" className="text-[#111111] dark:text-white underline">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-[#111111] dark:hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/login" className="hover:text-[#111111] dark:hover:text-white transition">
              Login
            </Link>
            <Link to="/signup" className="hover:text-[#111111] dark:hover:text-white transition">
              Create Account
            </Link>
          </div>

          <p className="text-xs text-[#777777] dark:text-[#707070]">
            © 2026 PaperlessDoc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
