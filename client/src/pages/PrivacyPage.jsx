import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/paperlessdoc-logo.png';

const privacySections = [
  { id: 'info-collect', title: '1. Information We Collect' },
  { id: 'info-use', title: '2. How We Use Your Information' },
  { id: 'uploaded-docs', title: '3. Your Uploaded Documents' },
  { id: 'doc-privacy', title: '4. Document Privacy' },
  { id: 'doc-sharing', title: '5. Document Sharing' },
  { id: 'data-security', title: '6. Data Security' },
  { id: 'auth-passwords', title: '7. Passwords and Authentication' },
  { id: 'google-signin', title: '8. Google Sign-In' },
  { id: 'cookies-storage', title: '9. Cookies and Local Storage' },
  { id: 'data-retention', title: '10. Data Retention' },
  { id: 'account-deletion', title: '11. Account Deletion' },
  { id: 'third-parties', title: '12. Third-Party Service Providers' },
  { id: 'children-privacy', title: "13. Children's Privacy" },
  { id: 'privacy-choices', title: '14. Your Privacy Choices' },
  { id: 'policy-changes', title: '15. Changes to This Privacy Policy' },
  { id: 'contact', title: '16. Contact' },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('info-collect');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = 'PaperlessDoc — Privacy Policy';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 180;
      for (const section of privacySections) {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#A5A5A5] mt-2 leading-relaxed">
            Learn how PaperlessDoc collects, uses, stores, and protects your information.
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
              {privacySections.map((sec) => (
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
                {privacySections.map((sec) => (
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
            <section id="info-collect" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                1. Information We Collect
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                At PaperlessDoc, we respect your privacy and process personal information strictly to deliver service functionality. We collect the following categories of data:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li><strong>Account Registration Data:</strong> Full name, email address, password hash, and account registration timestamp.</li>
                <li><strong>Document Metadata:</strong> File name, file size, mime type, upload timestamp, category label, and star status.</li>
                <li><strong>Usage & System Logs:</strong> Technical activity logs including IP addresses, browser agent information, and share link access counts for security auditing.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="info-use" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                2. How We Use Your Information
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                Your information is used strictly to power your personal document vault experience. Specifically, we use your data to:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>Authenticate your identity and manage secure account sessions.</li>
                <li>Organize, index, and display your uploaded personal documents in your private dashboard.</li>
                <li>Generate and serve secure public share links when explicitly requested by you.</li>
                <li>Provide system notifications regarding document expiry, security alerts, and account updates.</li>
                <li>Enforce service security, prevent fraudulent activity, and ensure compliance with platform terms.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="uploaded-docs" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                3. Your Uploaded Documents
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                Your uploaded documents are stored in dedicated isolated storage directories associated with your account. We treat your personal documents as confidential material. PaperlessDoc does not scan, index, read, or mine the contents of your documents for targeted advertising, analytics profiling, or third-party monetization.
              </p>
            </section>

            {/* Section 4 */}
            <section id="doc-privacy" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                4. Document Privacy
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                All files uploaded to PaperlessDoc are private by default. Only authenticated account holders can view, stream, download, or edit documents stored within their vault, unless a document is explicitly published via a share link.
              </p>
            </section>

            {/* Section 5 */}
            <section id="doc-sharing" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                5. Document Sharing
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                When you share a document, PaperlessDoc generates a unique access token. You maintain complete governance over shared files:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>Public share links grant view and download permissions to anyone possessing the exact URL token.</li>
                <li>You can assign expiration timeframes to automatically invalidate links after a set period.</li>
                <li>You can immediately revoke any share link at any time to block future external access.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="data-security" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                6. Data Security
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We implement robust security measures to protect your personal information and uploaded files:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and PaperlessDoc is encrypted using Transport Layer Security (TLS/HTTPS).</li>
                <li><strong>Access Controls:</strong> JWT authentication tokens with strict signature validation ensure unauthorized users cannot access private APIs.</li>
                <li><strong>Storage Isolation:</strong> Uploaded files are segregated on storage systems with strict file system permission controls.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="auth-passwords" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                7. Passwords and Authentication
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                User passwords are never stored in plain text. PaperlessDoc uses industry-standard cryptographic hashing algorithm bcrypt to secure passwords. PaperlessDoc team members cannot view your plaintext password.
              </p>
            </section>

            {/* Section 8 */}
            <section id="google-signin" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                8. Google Sign-In
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                If you choose to authenticate using Google Sign-In, PaperlessDoc requests access only to basic profile information (your full name, email address, and profile photo URL). We do not request access to your Google Drive, Gmail, or private Google data.
              </p>
            </section>

            {/* Section 9 */}
            <section id="cookies-storage" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                9. Cookies and Local Storage
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                PaperlessDoc uses web browser local storage and essential session cookies strictly for core application functionality, including:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>Maintaining authenticated user login state across page reloads.</li>
                <li>Saving your preferred appearance theme preference (Light Mode / Dark Mode / System).</li>
              </ul>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We do not use third-party tracking cookies or advertising cookies.
              </p>
            </section>

            {/* Section 10 */}
            <section id="data-retention" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                10. Data Retention
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We retain your personal information and uploaded files for as long as your account remains active. Documents moved to the Recycle Bin are retained until you permanently delete them or empty your trash folder.
              </p>
            </section>

            {/* Section 11 */}
            <section id="account-deletion" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                11. Account Deletion
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                You have the right to delete your PaperlessDoc account at any time. Account deletion can be initiated from the Profile settings section by confirming with your account keyword. Permanent account deletion will irreversibly erase your account record, metadata, and all uploaded physical document files from server disk storage.
              </p>
            </section>

            {/* Section 12 */}
            <section id="third-parties" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                12. Third-Party Service Providers
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We may engage trusted third-party service providers (such as hosting infrastructure and cloud platform providers) to facilitate system operation. These providers access your data only as necessary to perform contracted technical infrastructure services on our behalf under confidentiality obligations.
              </p>
            </section>

            {/* Section 13 */}
            <section id="children-privacy" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                13. Children's Privacy
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                PaperlessDoc is not directed to individuals under the age of 13. We do not knowingly collect or solicit personal information from children under 13. If we discover that a child under 13 has provided personal data, we will take steps to promptly remove such information and delete the account.
              </p>
            </section>

            {/* Section 14 */}
            <section id="privacy-choices" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                14. Your Privacy Choices
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                You have full governance over your personal information:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-[#444444] dark:text-[#CCCCCC] space-y-1.5 pl-2 leading-relaxed">
                <li>Access and update your account profile details directly within Profile settings.</li>
                <li>Manage, revoke, or set expiration dates for document share links.</li>
                <li>Permanently remove individual documents or delete your entire account vault.</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section id="policy-changes" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                15. Changes to This Privacy Policy
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                We may update this Privacy Policy from time to time to reflect changes in our technology, security practices, or regulatory requirements. Any updates will be posted on this page with an updated "Last Updated" date.
              </p>
            </section>

            {/* Section 16 */}
            <section id="contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pb-2 border-b border-[#E2E2E2] dark:border-[#292929]">
                16. Contact
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#444444] dark:text-[#CCCCCC]">
                If you have questions or concerns regarding this Privacy Policy or how your personal information is protected, please contact the PaperlessDoc team through the official support channels.
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
            <Link to="/terms" className="hover:text-[#111111] dark:hover:text-white transition">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-[#111111] dark:text-white underline">
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
