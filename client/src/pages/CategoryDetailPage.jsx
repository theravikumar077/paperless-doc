import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Folder, Upload } from 'lucide-react';
import api from '../services/api';
import DocumentCard from '../components/DocumentCard';
import EmptyState from '../components/EmptyState';
import ShareModal from '../components/ShareModal';
import EditDocumentModal from '../components/EditDocumentModal';
import { useToast } from '../context/ToastContext';

export default function CategoryDetailPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDocForShare, setSelectedDocForShare] = useState(null);
  const [selectedDocForEdit, setSelectedDocForEdit] = useState(null);

  // Capitalize category param (e.g., 'education' -> 'Education')
  const categoryFormatted = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All';

  const fetchCategoryDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents', {
        params: { category: categoryFormatted },
      });
      setDocuments(res.data.data || []);
    } catch (err) {
      showToast('Failed to load category documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDocs();
  }, [category]);

  const handleStarToggle = async (docId) => {
    try {
      await api.patch(`/documents/${docId}/important`);
      fetchCategoryDocs();
    } catch (e) {
      showToast('Failed to update star status', 'error');
    }
  };

  const handleMoveToTrash = async (docId) => {
    try {
      await api.delete(`/documents/${docId}`);
      showToast('Moved to Recycle Bin', 'info');
      fetchCategoryDocs();
    } catch (e) {
      showToast('Failed to move to trash', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/categories')}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
              <Folder className="w-6 h-6 text-[#111111] dark:text-white" />
              {categoryFormatted}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Showing {documents.length} {documents.length === 1 ? 'document' : 'documents'} in {categoryFormatted}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 text-xs shadow-sm transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload to {categoryFormatted}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-56 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title={`No ${categoryFormatted} documents yet`}
          description={`Upload your first ${categoryFormatted.toLowerCase()} document to keep it organized.`}
          actionText="Upload Document"
          onAction={() => navigate('/upload')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              onStarToggle={handleStarToggle}
              onShare={(d) => setSelectedDocForShare(d)}
              onEdit={(d) => setSelectedDocForEdit(d)}
              onTrash={handleMoveToTrash}
            />
          ))}
        </div>
      )}

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
          onUpdated={fetchCategoryDocs}
        />
      )}
    </div>
  );
}
