import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  FolderTree,
  FileText,
  Clock,
  ArrowRight,
  GraduationCap,
  IdCard,
  HeartPulse,
  Briefcase,
  Folder,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DocumentCard from '../components/DocumentCard';
import EmptyState from '../components/EmptyState';
import EditDocumentModal from '../components/EditDocumentModal';
import ShareModal from '../components/ShareModal';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDocuments: 0,
    categoryCounts: {
      Education: 0,
      Identity: 0,
      Medical: 0,
      Career: 0,
      Financial: 0,
      Other: 0,
    },
    recentDocuments: [],
    expiringDocuments: [],
    storageUsed: 0,
    storageLimit: 10737418240,
  });

  const [loading, setLoading] = useState(true);
  const [selectedDocForShare, setSelectedDocForShare] = useState(null);
  const [selectedDocForEdit, setSelectedDocForEdit] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents/dashboard-stats');
      if (res.data && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleStarToggle = async (docId) => {
    try {
      await api.patch(`/documents/${docId}/important`);
      fetchDashboardStats();
    } catch (e) {
      showToast('Failed to update star status', 'error');
    }
  };

  const handleMoveToTrash = async (docId) => {
    try {
      await api.delete(`/documents/${docId}`);
      showToast('Document moved to Recycle Bin', 'info');
      fetchDashboardStats();
    } catch (e) {
      showToast('Failed to move to trash', 'error');
    }
  };

  // Category Icon & Color Mapping matching monochrome design system
  const categoryConfig = [
    {
      name: 'Education',
      icon: GraduationCap,
      color: 'bg-neutral-200/80 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    },
    {
      name: 'Identity',
      icon: IdCard,
      color: 'bg-[#242424]/10 text-[#111111] dark:bg-[#353535]/40 dark:text-white',
    },
    {
      name: 'Medical',
      icon: HeartPulse,
      color: 'bg-[#EBEBEB] text-[#353535] dark:bg-[#181818] dark:text-[#B5B5B5]',
    },
    {
      name: 'Career',
      icon: Briefcase,
      color: 'bg-neutral-300/60 text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-300',
    },
    {
      name: 'Financial',
      icon: CreditCard,
      color: 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
    },
    {
      name: 'Other',
      icon: Folder,
      color: 'bg-[#F5F5F5] text-[#666666] dark:bg-[#151515] dark:text-[#A5A5A5]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner matching graphite digital document vault aesthetic */}
      <div className="relative bg-gradient-to-r from-[#0A0A0A] via-[#111111] to-[#181818] text-white p-6 sm:p-8 rounded-3xl overflow-hidden shadow-xl border border-[#242424]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              Good Morning, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-sm text-[#B5B5B5] mt-1 max-w-lg">
              Your documents, organized and always with you in your secure personal digital locker.
            </p>
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="bg-white hover:bg-[#F0F0F0] text-[#0A0A0A] font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg transition transform hover:-translate-y-0.5 shrink-0 text-sm"
          >
            <Upload className="w-4 h-4 text-[#0A0A0A]" />
            <span>+ Upload Document</span>
          </button>
        </div>
      </div>

      {/* Database Statistics Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] mb-1">
            <div className="w-7 h-7 rounded-lg bg-[#F5F5F5] dark:bg-[#181818] border border-[#E2E2E2] dark:border-[#353535] text-[#111111] dark:text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <span>Total</span>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">
            {stats.totalDocuments}
          </div>
          <p className="text-[10px] text-[#777777] dark:text-[#707070] mt-0.5">Documents</p>
        </div>

        {categoryConfig.slice(0, 5).map((cat) => {
          const Icon = cat.icon;
          const count = stats.categoryCounts[cat.name] || 0;
          return (
            <div
              key={cat.name}
              onClick={() => navigate(`/categories/${cat.name.toLowerCase()}`)}
              className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-4 rounded-2xl shadow-sm hover:border-[#111111] dark:hover:border-white transition cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] mb-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{cat.name}</span>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">
                {count}
              </div>
              <p className="text-[10px] text-[#777777] dark:text-[#707070] mt-0.5">Documents</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Documents & Categories / Expiring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#111111] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#777777]" />
              Recent Documents
            </h3>
            <Link
              to="/documents"
              className="text-xs font-semibold text-[#111111] dark:text-white hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 bg-[#EBEBEB] dark:bg-[#181818] rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : stats.recentDocuments.length === 0 ? (
            <EmptyState
              title="No recent documents"
              description="Upload your first Aadhaar, degree, marksheets, or medical report to populate your vault."
              actionText="Upload First Document"
              onAction={() => navigate('/upload')}
            />
          ) : (
            <div className="space-y-3">
              {stats.recentDocuments.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  viewMode="list"
                  onStarToggle={handleStarToggle}
                  onShare={(d) => setSelectedDocForShare(d)}
                  onEdit={(d) => setSelectedDocForEdit(d)}
                  onTrash={handleMoveToTrash}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Categories & Expiring Soon */}
        <div className="space-y-6">
          {/* Document Categories */}
          <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-5 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#111111] dark:text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-[#777777]" />
                Document Categories
              </h3>
              <Link
                to="/categories"
                className="text-xs font-semibold text-[#111111] dark:text-white hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {categoryConfig.map((cat) => {
                const Icon = cat.icon;
                const count = stats.categoryCounts[cat.name] || 0;
                return (
                  <button
                    key={cat.name}
                    onClick={() => navigate(`/categories/${cat.name.toLowerCase()}`)}
                    className="flex flex-col p-3 rounded-2xl border border-[#E2E2E2] dark:border-[#292929] hover:border-[#111111] dark:hover:border-white bg-[#F5F5F5]/50 dark:bg-[#151515]/50 text-left transition"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-[#111111] dark:text-white">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#777777] dark:text-[#707070] mt-0.5">
                      {count} {count === 1 ? 'document' : 'documents'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expiring Soon Widget */}
          <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-5 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#111111] dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#777777]" />
                Expiring Soon
              </h3>
            </div>

            {stats.expiringDocuments.length === 0 ? (
              <div className="p-4 text-center bg-[#F5F5F5] dark:bg-[#151515] rounded-2xl border border-[#E2E2E2] dark:border-[#292929]">
                <p className="text-xs font-semibold text-[#111111] dark:text-white">
                  ✨ You're all clear!
                </p>
                <p className="text-[11px] text-[#777777] dark:text-[#707070] mt-0.5">
                  No documents are expiring soon.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.expiringDocuments.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => navigate(`/documents/${doc._id}`)}
                    className="p-3 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#EBEBEB] dark:hover:bg-[#181818] transition"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="font-semibold text-xs text-[#111111] dark:text-white truncate">
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-[#666666] dark:text-[#A5A5A5]">
                        {doc.category}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] rounded-lg shrink-0">
                      {new Date(doc.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedDocForShare && (
        <ShareModal
          document={selectedDocForShare}
          onClose={() => setSelectedDocForShare(null)}
        />
      )}

      {selectedDocForEdit && (
        <EditDocumentModal
          document={selectedDocForEdit}
          onClose={() => setSelectedDocForEdit(null)}
          onUpdated={fetchDashboardStats}
        />
      )}
    </div>
  );
}
