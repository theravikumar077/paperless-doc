import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../services/api';
import DocumentCard from '../components/DocumentCard';
import EmptyState from '../components/EmptyState';
import ShareModal from '../components/ShareModal';
import EditDocumentModal from '../components/EditDocumentModal';
import { useToast } from '../context/ToastContext';

export default function ImportantPage() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDocForShare, setSelectedDocForShare] = useState(null);
  const [selectedDocForEdit, setSelectedDocForEdit] = useState(null);

  const fetchImportantDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents', {
        params: { isImportant: 'true' },
      });
      setDocuments(res.data.data || []);
    } catch (e) {
      showToast('Failed to load important documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImportantDocs();
  }, []);

  const handleStarToggle = async (docId) => {
    try {
      await api.patch(`/documents/${docId}/important`);
      fetchImportantDocs();
    } catch (e) {
      showToast('Failed to update star status', 'error');
    }
  };

  const handleMoveToTrash = async (docId) => {
    try {
      await api.delete(`/documents/${docId}`);
      showToast('Moved to Recycle Bin', 'info');
      fetchImportantDocs();
    } catch (e) {
      showToast('Failed to move to trash', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-[#111111] dark:text-white fill-[#111111] dark:fill-white" />
          Important Documents
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Starred documents for quick priority access
        </p>
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
          icon={Star}
          title="No important documents yet"
          description="Click the star icon on any document card to pin it here for instant access."
          actionText=""
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
          onUpdated={fetchImportantDocs}
        />
      )}
    </div>
  );
}
