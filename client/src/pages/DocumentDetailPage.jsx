import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Share2,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Tag,
  Star,
  Info,
  ExternalLink,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import ShareModal from '../components/ShareModal';
import EditDocumentModal from '../components/EditDocumentModal';
import { useToast } from '../context/ToastContext';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Preview & Viewer States
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchDocumentDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/documents/${id}`);
      setDocument(res.data.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load document details', 'error');
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  };

  const loadPreviewFile = async (docId) => {
    try {
      setPreviewLoading(true);
      setPreviewError(false);
      const res = await api.get(`/documents/${docId}/preview`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], {
        type: res.headers['content-type'] || 'application/pdf',
      });
      const objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    } catch (err) {
      console.error('Failed to stream preview blob:', err);
      setPreviewError(true);
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentDetail();
  }, [id]);

  useEffect(() => {
    if (document?._id) {
      loadPreviewFile(document._id);
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [document?._id]);

  const handleDownload = async () => {
    try {
      showToast('Preparing download...', 'info');
      const res = await api.get(`/documents/${document._id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.originalFileName || document.name);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('Download started!', 'success');
    } catch (err) {
      showToast('Failed to download document', 'error');
    }
  };

  const handleStarToggle = async () => {
    try {
      const res = await api.patch(`/documents/${id}/important`);
      setDocument(res.data.data);
      showToast(
        res.data.data.isImportant ? 'Marked as important' : 'Removed from important',
        'success'
      );
    } catch (e) {
      showToast('Failed to update star status', 'error');
    }
  };

  const handleMoveToTrash = async () => {
    try {
      await api.delete(`/documents/${id}`);
      showToast('Document moved to Recycle Bin', 'info');
      navigate('/documents');
    } catch (e) {
      showToast('Failed to delete document', 'error');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[500px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-[500px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!document) return null;

  const isPDF = document.fileType?.includes('pdf');
  const isImage = document.fileType?.includes('image');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white truncate max-w-md">
                {document.name}
              </h1>
              <button
                onClick={handleStarToggle}
                className="p-1 text-[#777777] hover:text-amber-400"
              >
                <Star
                  className={`w-5 h-5 ${
                    document.isImportant ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-0.5">
              Original: {document.originalFileName}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons - Monochrome Vault Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="bg-white hover:bg-[#F0F0F0] dark:bg-[#181818] dark:hover:bg-[#222222] border border-[#E2E2E2] dark:border-[#333333] text-[#111111] dark:text-[#E5E5E5] font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setShowEditModal(true)}
            className="p-2.5 bg-white hover:bg-[#F0F0F0] dark:bg-[#181818] dark:hover:bg-[#222222] border border-[#E2E2E2] dark:border-[#333333] text-[#111111] dark:text-[#E5E5E5] rounded-xl transition"
            title="Edit metadata"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={handleMoveToTrash}
            className="p-2.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl transition"
            title="Move to trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Viewer + Metadata Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Viewer Frame - Requirement 15: #F2F2F2 / #FFFFFF in Light Mode, #080808 / #111111 in Dark Mode */}
        <div
          className={`lg:col-span-2 bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col min-h-[500px] ${
            isFullscreen ? 'fixed inset-4 z-50 overflow-auto bg-[#080808] p-6' : ''
          }`}
        >
          {/* Viewer Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E2E2] dark:border-[#292929] mb-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#111111] dark:text-white">
              <FileText className="w-4 h-4 text-[#777777]" />
              <span>Document Preview</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                className="p-1.5 bg-[#F5F5F5] dark:bg-[#181818] hover:bg-[#EBEBEB] dark:hover:bg-[#222222] border border-[#E2E2E2] dark:border-[#333333] rounded-lg text-[#111111] dark:text-[#E5E5E5]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-[#666666] dark:text-[#A5A5A5] min-w-[36px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                className="p-1.5 bg-[#F5F5F5] dark:bg-[#181818] hover:bg-[#EBEBEB] dark:hover:bg-[#222222] border border-[#E2E2E2] dark:border-[#333333] rounded-lg text-[#111111] dark:text-[#E5E5E5]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1 bg-[#F5F5F5] dark:bg-[#181818] hover:bg-[#EBEBEB] dark:hover:bg-[#222222] border border-[#E2E2E2] dark:border-[#333333] rounded-lg text-[10px] font-semibold text-[#111111] dark:text-[#E5E5E5]"
                title="Reset Fit"
              >
                Fit
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 bg-[#F5F5F5] dark:bg-[#181818] hover:bg-[#EBEBEB] dark:hover:bg-[#222222] border border-[#E2E2E2] dark:border-[#333333] rounded-lg text-[#111111] dark:text-[#E5E5E5]"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full bg-[#F2F2F2] dark:bg-[#080808] rounded-2xl overflow-hidden flex items-center justify-center relative min-h-[480px] border border-[#E2E2E2] dark:border-[#292929]">
            {previewLoading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-3 text-[#666666] dark:text-[#A5A5A5] animate-fade-in">
                <Loader2 className="w-8 h-8 animate-spin text-[#111111] dark:text-white" />
                <span className="text-xs font-semibold">Loading document vault preview...</span>
              </div>
            ) : previewError ? (
              <div className="text-center p-8 space-y-4 max-w-sm">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                <div>
                  <h3 className="text-[#111111] dark:text-white font-bold text-sm">Unable to preview this document</h3>
                  <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-1 leading-relaxed">
                    You can still try downloading the file to view it on your device.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold text-xs rounded-xl shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Document</span>
                  </button>
                  <button
                    onClick={() => loadPreviewFile(document._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#181818] border border-[#E2E2E2] dark:border-[#333333] text-[#111111] dark:text-[#E5E5E5] font-semibold text-xs rounded-xl"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            ) : isImage ? (
              <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                <img
                  src={previewUrl}
                  alt={document.name}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                  className="max-w-full max-h-[600px] object-contain mx-auto transition-transform duration-200"
                />
              </div>
            ) : isPDF ? (
              <div className="w-full h-full overflow-hidden flex flex-col">
                <iframe
                  src={`${previewUrl}#toolbar=1`}
                  title={document.name}
                  className="w-full h-[600px] rounded-2xl border-0"
                />
              </div>
            ) : (
              <div className="text-center p-8 space-y-4">
                <FileText className="w-16 h-16 text-[#777777] mx-auto" />
                <div>
                  <h3 className="text-[#111111] dark:text-white font-bold text-base">{document.name}</h3>
                  <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-1">
                    Direct viewer not available for type {document.fileType}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold text-xs rounded-xl shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download to View</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Details Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-6 rounded-3xl shadow-sm space-y-5">
            <h3 className="font-bold text-base text-[#111111] dark:text-white pb-3 border-b border-[#E2E2E2] dark:border-[#292929] flex items-center justify-between">
              <span>Document Details</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F5F5] dark:bg-[#181818] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#353535]">
                {document.category}
              </span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#E2E2E2]/60 dark:border-[#292929]">
                <span className="text-[#666666] dark:text-[#A5A5A5]">File Name</span>
                <span className="font-semibold text-[#111111] dark:text-white truncate max-w-[180px]">
                  {document.originalFileName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2E2E2]/60 dark:border-[#292929]">
                <span className="text-[#666666] dark:text-[#A5A5A5]">File Size</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {formatBytes(document.fileSize)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2E2E2]/60 dark:border-[#292929]">
                <span className="text-[#666666] dark:text-[#A5A5A5]">Uploaded On</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {new Date(document.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2E2E2]/60 dark:border-[#292929]">
                <span className="text-[#666666] dark:text-[#A5A5A5]">Issue Date</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {document.issueDate
                    ? new Date(document.issueDate).toLocaleDateString()
                    : 'Not specified'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2E2E2]/60 dark:border-[#292929]">
                <span className="text-[#666666] dark:text-[#A5A5A5]">Expiry Date</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {document.expiryDate
                    ? new Date(document.expiryDate).toLocaleDateString()
                    : 'Does not expire'}
                </span>
              </div>
            </div>

            {/* Description */}
            {document.description && (
              <div className="pt-2">
                <span className="block text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] mb-1">
                  Description
                </span>
                <p className="text-xs text-[#111111] dark:text-white bg-[#F5F5F5] dark:bg-[#181818] p-3 rounded-xl leading-relaxed border border-[#E2E2E2] dark:border-[#292929]">
                  {document.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="pt-2">
                <span className="block text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] mb-2">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {document.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[11px] font-medium bg-[#F5F5F5] dark:bg-[#181818] text-[#111111] dark:text-white rounded-lg flex items-center gap-1 border border-[#E2E2E2] dark:border-[#292929]"
                    >
                      <Tag className="w-3 h-3 text-[#777777]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl flex items-start gap-3 text-xs text-[#111111] dark:text-[#E5E5E5]">
            <ShieldCheck className="w-4 h-4 text-[#777777] shrink-0 mt-0.5" />
            <p>
              This document is private and isolated to your authenticated account. No unauthorized third party can view this document ID.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showShareModal && (
        <ShareModal document={document} onClose={() => setShowShareModal(null)} />
      )}

      {showEditModal && (
        <EditDocumentModal
          document={document}
          onClose={() => setShowEditModal(false)}
          onUpdated={fetchDocumentDetail}
        />
      )}
    </div>
  );
}
