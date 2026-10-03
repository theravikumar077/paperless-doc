import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, ShieldAlert, Trash2, Calendar, Eye } from 'lucide-react';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

export default function SharedPage() {
  const { showToast } = useToast();
  const [shareLinks, setShareLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);

  const fetchShareLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/share');
      setShareLinks(res.data.data || []);
    } catch (e) {
      showToast('Failed to load share links', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShareLinks();
  }, []);

  const copyLink = (shareUrl, token) => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedToken(token);
    showToast('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleRevoke = async (id) => {
    try {
      await api.patch(`/share/${id}/revoke`);
      showToast('Share link access revoked immediately', 'info');
      fetchShareLinks();
    } catch (e) {
      showToast('Failed to revoke share link', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
          <Share2 className="w-6 h-6 text-[#111111] dark:text-white" />
          Shared Documents & Links
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Manage secure share links generated for external view/download access
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : shareLinks.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="No active share links"
          description="You haven't generated any share links yet. Click 'Share' on any document to create a secure link."
          actionText=""
        />
      ) : (
        <div className="space-y-3">
          {shareLinks.map((link) => (
            <div
              key={link.id}
              className={`p-4 bg-white dark:bg-[#111111] border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                link.isRevoked || link.isExpired
                  ? 'opacity-60 border-[#E2E2E2] dark:border-[#292929] bg-neutral-50/50 dark:bg-neutral-800/30'
                  : 'border-[#E2E2E2] dark:border-[#292929] hover:border-[#111111] dark:hover:border-white'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-[#111111] dark:text-white truncate">
                    {link.document?.name || 'Document'}
                  </h4>
                  {link.isRevoked ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-full">
                      Revoked
                    </span>
                  ) : link.isExpired ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 rounded-full">
                      Expired
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Views: {link.accessCount}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {link.expiresAt
                      ? `Expires: ${new Date(link.expiresAt).toLocaleDateString()}`
                      : 'Never Expires'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!link.isRevoked && !link.isExpired && (
                  <button
                    onClick={() => copyLink(link.shareUrl, link.token)}
                    className="py-2 px-3 bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] hover:bg-[#242424] dark:hover:bg-[#E5E5E5] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedToken === link.token ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedToken === link.token ? 'Copied' : 'Copy Link'}</span>
                  </button>
                )}

                {!link.isRevoked && (
                  <button
                    onClick={() => handleRevoke(link.id)}
                    className="py-2 px-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
