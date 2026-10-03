import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  FileText,
  FileImage,
  FileCode,
  MoreVertical,
  Star,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  RotateCcw,
  Calendar,
  AlertCircle,
  CheckSquare,
  Square,
} from 'lucide-react';

export default function DocumentCard({
  document: doc,
  viewMode = 'grid',
  onStarToggle,
  onShare,
  onEdit,
  onTrash,
  onRestore,
  onPermanentDelete,
  onSelect,
  isSelected = false,
  inTrash = false,
}) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleDownloadDoc = async (e, docId, fileName) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await api.get(`/documents/${docId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Category badge colors matching monochrome design system
  const getCategoryStyles = (cat) => {
    switch (cat) {
      case 'Education':
        return 'bg-neutral-200/80 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
      case 'Identity':
        return 'bg-[#242424]/10 text-[#111111] dark:bg-[#353535]/40 dark:text-white border-[#3A3A3A]/20 dark:border-[#3A3A3A]';
      case 'Medical':
        return 'bg-[#EBEBEB] text-[#353535] dark:bg-[#181818] dark:text-[#B5B5B5] border-[#E2E2E2] dark:border-[#292929]';
      case 'Career':
        return 'bg-neutral-300/60 text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-300 border-neutral-400/40 dark:border-neutral-600';
      case 'Financial':
        return 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700';
      default:
        return 'bg-[#F5F5F5] text-[#666666] dark:bg-[#151515] dark:text-[#A5A5A5] border-[#E2E2E2] dark:border-[#292929]';
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const token = localStorage.getItem('token');
  const previewImageSrc = doc.fileUrl + (token ? `?auth_token=${token}` : '');

  const isPDF = doc.fileType?.includes('pdf');
  const isImage = doc.fileType?.includes('image');

  // Check expiry
  let expiryStatus = null;
  if (doc.expiryDate) {
    const exp = new Date(doc.expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      expiryStatus = { label: 'Expired', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' };
    } else if (diffDays <= 30) {
      expiryStatus = { label: `Expires in ${diffDays}d`, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' };
    }
  }

  const handleCardClick = (e) => {
    // If clicking checkbox, menu, or star button, ignore redirect
    if (
      e.target.closest('.card-action') ||
      e.target.closest('.card-checkbox') ||
      e.target.closest('.card-menu')
    ) {
      return;
    }
    navigate(`/documents/${doc._id}`);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className={`group flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-[#111111] border rounded-2xl hover:shadow-md transition duration-200 cursor-pointer ${
          isSelected
            ? 'border-[#111111] bg-[#F5F5F5] dark:border-white dark:bg-[#181818]'
            : 'border-[#E2E2E2] dark:border-[#292929]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {onSelect && (
            <button
              onClick={() => onSelect(doc._id)}
              className="card-checkbox text-[#777777] hover:text-[#111111] dark:hover:text-white shrink-0"
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-[#111111] dark:text-white" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Icon / Thumbnail */}
          <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] dark:bg-[#181818] flex items-center justify-center shrink-0 border border-[#E2E2E2] dark:border-[#292929] overflow-hidden">
            {isImage ? (
              <img
                src={previewImageSrc}
                alt={doc.name}
                className="w-full h-full object-cover"
              />
            ) : isPDF ? (
              <div className="bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] w-full h-full flex items-center justify-center font-bold text-xs">
                PDF
              </div>
            ) : (
              <FileText className="w-5 h-5 text-[#666666] dark:text-[#A5A5A5]" />
            )}
          </div>

          {/* Text details */}
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-[#111111] dark:text-white truncate group-hover:text-[#111111] dark:group-hover:text-white transition">
              {doc.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-[#666666] dark:text-[#A5A5A5] mt-0.5">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryStyles(
                  doc.category
                )}`}
              >
                {doc.category}
              </span>
              <span>•</span>
              <span>{formatBytes(doc.fileSize)}</span>
              <span>•</span>
              <span>{formatDate(doc.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 shrink-0">
          {expiryStatus && (
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg ${expiryStatus.color}`}
            >
              <AlertCircle className="w-3 h-3" />
              {expiryStatus.label}
            </span>
          )}

          {!inTrash && onStarToggle && (
            <button
              onClick={() => onStarToggle(doc._id)}
              className="card-action p-2 text-[#777777] hover:text-amber-400 transition"
              title={doc.isImportant ? 'Remove star' : 'Mark important'}
            >
              <Star
                className={`w-4 h-4 ${
                  doc.isImportant ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
          )}

          {/* Menu Dropdown */}
          <div className="relative card-menu" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-[#777777] hover:text-[#111111] dark:hover:text-white rounded-lg hover:bg-[#EBEBEB] dark:hover:bg-[#181818] transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[#E2E2E2] dark:border-[#292929] py-1.5 z-50 text-xs">
                {!inTrash ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        navigate(`/documents/${doc._id}`);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                    >
                      <Eye className="w-4 h-4 text-[#777777]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={(e) => {
                        setShowMenu(false);
                        handleDownloadDoc(e, doc._id, doc.originalFileName || doc.name);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818] text-left"
                    >
                      <Download className="w-4 h-4 text-[#777777]" />
                      <span>Download</span>
                    </button>
                    {onShare && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onShare(doc);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                      >
                        <Share2 className="w-4 h-4 text-[#777777]" />
                        <span>Share</span>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEdit(doc);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                      >
                        <Edit className="w-4 h-4 text-[#777777]" />
                        <span>Edit</span>
                      </button>
                    )}
                    <div className="my-1 border-t border-[#E2E2E2] dark:border-[#292929]" />
                    {onTrash && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onTrash(doc._id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Move to Trash</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {onRestore && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onRestore(doc._id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-white hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                    )}
                    {onPermanentDelete && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onPermanentDelete(doc._id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Permanently</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view card matching provided monochrome vault aesthetic
  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col bg-white dark:bg-[#111111] border rounded-2xl p-4 hover:shadow-lg hover:border-[#111111] dark:hover:border-white transition duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#111111] bg-[#F5F5F5] dark:border-white dark:bg-[#181818]'
          : 'border-[#E2E2E2] dark:border-[#292929]'
      }`}
    >
      {/* Top Header inside card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {onSelect && (
            <button
              onClick={() => onSelect(doc._id)}
              className="card-checkbox text-[#777777] hover:text-[#111111] dark:hover:text-white"
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-[#111111] dark:text-white" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          )}

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getCategoryStyles(
              doc.category
            )}`}
          >
            {doc.category}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!inTrash && onStarToggle && (
            <button
              onClick={() => onStarToggle(doc._id)}
              className="card-action p-1 text-[#777777] hover:text-amber-400 transition"
              title={doc.isImportant ? 'Remove star' : 'Mark important'}
            >
              <Star
                className={`w-4 h-4 ${
                  doc.isImportant ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
          )}

          <div className="relative card-menu" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-[#777777] hover:text-[#111111] dark:hover:text-white rounded-lg hover:bg-[#EBEBEB] dark:hover:bg-[#181818] transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[#E2E2E2] dark:border-[#292929] py-1.5 z-50 text-xs">
                {!inTrash ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        navigate(`/documents/${doc._id}`);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                    >
                      <Eye className="w-4 h-4 text-[#777777]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={(e) => {
                        setShowMenu(false);
                        handleDownloadDoc(e, doc._id, doc.originalFileName || doc.name);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818] text-left"
                    >
                      <Download className="w-4 h-4 text-[#777777]" />
                      <span>Download</span>
                    </button>
                    {onShare && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onShare(doc);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                      >
                        <Share2 className="w-4 h-4 text-[#777777]" />
                        <span>Share</span>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEdit(doc);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-[#E5E5E5] hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                      >
                        <Edit className="w-4 h-4 text-[#777777]" />
                        <span>Edit</span>
                      </button>
                    )}
                    <div className="my-1 border-t border-[#E2E2E2] dark:border-[#292929]" />
                    {onTrash && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onTrash(doc._id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Move to Trash</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {onRestore && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onRestore(doc._id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#111111] dark:text-white hover:bg-[#EBEBEB] dark:hover:bg-[#181818]"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                    )}
                    {onPermanentDelete && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onPermanentDelete(doc._id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Permanently</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Box / Document Thumbnail */}
      <div className="w-full h-32 mb-3 bg-[#F5F5F5] dark:bg-[#181818] rounded-xl border border-[#E2E2E2] dark:border-[#292929] overflow-hidden flex items-center justify-center relative">
        {isImage ? (
          <img
            src={previewImageSrc}
            alt={doc.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : isPDF ? (
          <div className="flex flex-col items-center justify-center gap-1.5 text-[#111111] dark:text-white">
            <div className="w-12 h-12 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center font-black text-sm shadow-md">
              PDF
            </div>
            <span className="text-[10px] text-[#777777] dark:text-[#707070] font-semibold tracking-wider uppercase">
              Document
            </span>
          </div>
        ) : (
          <FileText className="w-10 h-10 text-[#353535] dark:text-[#B5B5B5] opacity-80" />
        )}

        {expiryStatus && (
          <div
            className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${expiryStatus.color}`}
          >
            {expiryStatus.label}
          </div>
        )}
      </div>

      {/* Title & Metadata */}
      <h4 className="font-semibold text-sm text-[#111111] dark:text-white truncate group-hover:text-[#111111] dark:group-hover:text-white transition mb-1">
        {doc.name}
      </h4>

      <div className="flex items-center justify-between text-xs text-[#666666] dark:text-[#A5A5A5] mt-auto pt-2 border-t border-[#E2E2E2] dark:border-[#292929]">
        <span>{formatBytes(doc.fileSize)}</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#777777]" />
          {formatDate(doc.createdAt)}
        </span>
      </div>
    </div>
  );
}
