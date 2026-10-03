import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import api from '../services/api';
import DocumentCard from '../components/DocumentCard';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

export default function TrashPage() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchTrashDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents', {
        params: { inTrash: 'true' },
      });
      setDocuments(res.data.data || []);
    } catch (e) {
      showToast('Failed to load trash documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashDocs();
  }, []);

  const handleRestore = async (docId) => {
    try {
      await api.post(`/documents/${docId}/restore`);
      showToast('Document restored successfully', 'success');
      fetchTrashDocs();
    } catch (e) {
      showToast('Failed to restore document', 'error');
    }
  };

  const handlePermanentDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to permanently delete this document? This cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/documents/${docId}/permanent`);
      showToast('Document permanently deleted', 'info');
      fetchTrashDocs();
    } catch (e) {
      showToast('Failed to permanently delete document', 'error');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (
      action === 'permanent-delete' &&
      !window.confirm(`Permanently delete ${selectedIds.length} items? This cannot be undone.`)
    ) {
      return;
    }

    try {
      await api.post('/documents/bulk', {
        action,
        documentIds: selectedIds,
      });
      showToast(`Bulk operation '${action}' completed`, 'success');
      setSelectedIds([]);
      fetchTrashDocs();
    } catch (e) {
      showToast('Bulk operation failed', 'error');
    }
  };

  const toggleSelectDoc = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-[#111111] dark:text-white" />
            Recycle Bin
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Deleted documents remain in trash until permanently removed
          </p>
        </div>

        {documents.length > 0 && (
          <button
            onClick={() => {
              setSelectedIds(documents.map((d) => d._id));
              handleBulkAction('permanent-delete');
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Recycle Bin</span>
          </button>
        )}
      </div>

      {/* Bulk actions header */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-neutral-100 dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl flex items-center justify-between text-xs animate-fade-in">
          <span className="font-semibold text-[#111111] dark:text-white">
            {selectedIds.length} items selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('restore')}
              className="px-3 py-1.5 bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold rounded-xl flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Selected</span>
            </button>
            <button
              onClick={() => handleBulkAction('permanent-delete')}
              className="px-3 py-1.5 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      )}

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
          icon={Trash2}
          title="Recycle Bin is empty"
          description="There are no deleted documents in your trash folder."
          actionText=""
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              inTrash={true}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
              onSelect={toggleSelectDoc}
              isSelected={selectedIds.includes(doc._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
