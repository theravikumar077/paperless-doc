import React, { useState } from 'react';
import { X, Copy, Check, ShieldAlert, Link as LinkIcon, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ShareModal({ document: doc, onClose }) {
  const { showToast } = useToast();
  const [expiryOption, setExpiryOption] = useState('7days');
  const [customDate, setCustomDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreateShareLink = async () => {
    try {
      setLoading(true);
      const res = await api.post('/share/create', {
        documentId: doc._id,
        expiryOption,
        customExpiryDate: customDate,
      });

      setShareData(res.data.data);
      showToast('Share link created successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create share link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareData?.shareUrl) {
      navigator.clipboard.writeText(shareData.shareUrl);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRevoke = async () => {
    if (!shareData?.id) return;
    try {
      setLoading(true);
      await api.patch(`/share/${shareData.id}/revoke`);
      setShareData(null);
      showToast('Share link access revoked immediately', 'info');
    } catch (err) {
      showToast('Failed to revoke share link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111111] rounded-3xl max-w-md w-full border border-[#E2E2E2] dark:border-[#292929] shadow-2xl overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E2E2] dark:border-[#292929] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] dark:bg-[#181818] border border-[#E2E2E2] dark:border-[#353535] text-[#111111] dark:text-white flex items-center justify-center font-bold">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111111] dark:text-white text-base">
                Share Document
              </h3>
              <p className="text-xs text-[#666666] dark:text-[#A5A5A5] truncate max-w-[220px]">
                {doc.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] dark:hover:text-white rounded-xl hover:bg-[#EBEBEB] dark:hover:bg-[#171717] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {!shareData ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#777777]" />
                  Link Expiry Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '7days', label: '7 Days' },
                    { id: '30days', label: '30 Days' },
                    { id: 'never', label: 'Never Expire' },
                    { id: 'custom', label: 'Custom Date' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setExpiryOption(opt.id)}
                      className={`py-2 px-3 text-xs font-medium rounded-xl border transition ${
                        expiryOption === opt.id
                          ? 'border-[#111111] bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] font-semibold'
                          : 'border-[#E2E2E2] dark:border-[#292929] text-[#666666] dark:text-[#A5A5A5] hover:bg-[#F5F5F5] dark:hover:bg-[#171717]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {expiryOption === 'custom' && (
                <div>
                  <label className="block text-xs font-medium text-[#666666] dark:text-[#A5A5A5] mb-1">
                    Select Expiry Date
                  </label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-xs bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                  />
                </div>
              )}

              <div className="p-3.5 bg-[#F5F5F5] dark:bg-[#151515] rounded-2xl border border-[#E2E2E2] dark:border-[#292929] flex items-start gap-2.5 text-xs text-[#111111] dark:text-[#E5E5E5]">
                <ShieldAlert className="w-4 h-4 text-[#777777] shrink-0 mt-0.5" />
                <p>
                  Anyone with this link will be able to view and download this document until the link expires or is revoked.
                </p>
              </div>

              <button
                onClick={handleCreateShareLink}
                disabled={loading}
                className="w-full bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow-md"
              >
                {loading ? 'Generating Link...' : 'Create Secure Share Link'}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl text-xs text-[#111111] dark:text-[#E5E5E5] font-medium text-center">
                ✨ Share link created successfully!
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                  Shareable URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareData.shareUrl}
                    className="flex-1 px-3 py-2 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-[#E5E5E5] rounded-xl border border-[#E2E2E2] dark:border-[#292929] font-mono truncate focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="py-2 px-3 bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-medium text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {shareData.expiresAt && (
                <p className="text-[11px] text-[#666666] dark:text-[#A5A5A5] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#777777]" />
                  Expires on: {new Date(shareData.expiresAt).toLocaleDateString()}
                </p>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleRevoke}
                  disabled={loading}
                  className="w-full py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold transition"
                >
                  Revoke Link Access
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
