import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  Upload,
  Trash2,
  Star,
  ArrowUpDown,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';
import api from '../services/api';
import DocumentCard from '../components/DocumentCard';
import EmptyState from '../components/EmptyState';
import ShareModal from '../components/ShareModal';
import EditDocumentModal from '../components/EditDocumentModal';
import { useToast } from '../context/ToastContext';

export default function DocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  const [selectedDocForShare, setSelectedDocForShare] = useState(null);
  const [selectedDocForEdit, setSelectedDocForEdit] = useState(null);

  const categories = ['All', 'Education', 'Identity', 'Medical', 'Career', 'Financial', 'Other'];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        sort: sortOption,
      };

      const res = await api.get('/documents', { params });
      setDocuments(res.data.data || []);
    } catch (err) {
      showToast('Failed to fetch documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, searchQuery, sortOption]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleStarToggle = async (docId) => {
    try {
      await api.patch(`/documents/${docId}/important`);
      fetchDocuments();
    } catch (e) {
      showToast('Failed to update star status', 'error');
    }
  };

  const handleMoveToTrash = async (docId) => {
    try {
      await api.delete(`/documents/${docId}`);
      showToast('Moved to Recycle Bin', 'info');
      fetchDocuments();
    } catch (e) {
      showToast('Failed to move document to trash', 'error');
    }
  };

  // Select all logic
  const toggleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((d) => d._id));
    }
  };

  const toggleSelectDoc = (id) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedDocIds.length === 0) return;
    try {
      await api.post('/documents/bulk', {
        action,
        documentIds: selectedDocIds,
      });
      showToast(
        `Bulk operation '${action}' completed on ${selectedDocIds.length} items`,
        'success'
      );
      setSelectedDocIds([]);
      fetchDocuments();
    } catch (e) {
      showToast('Bulk operation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white">
            My Documents
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-0.5">
            Manage and view all stored document records
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-bold py-2.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition transform hover:-translate-y-0.5"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Filter Pills & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-3xl border border-[#E2E2E2] dark:border-[#292929] shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#111111] text-white dark:bg-white dark:text-[#0A0A0A] shadow-sm'
                  : 'bg-[#F5F5F5] dark:bg-[#181818] text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#222222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Sort, View Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#777777] dark:text-[#707070]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white rounded-xl border border-[#E2E2E2] dark:border-[#292929] focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="expiry">Expiry Date</option>
            <option value="size-desc">File Size</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F5F5F5] dark:bg-[#151515] p-1 rounded-xl border border-[#E2E2E2] dark:border-[#292929]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#181818] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#777777]'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#181818] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#777777]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-select Bulk Actions Bar */}
      {selectedDocIds.length > 0 && (
        <div className="p-3 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-3 font-semibold text-[#111111] dark:text-white">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 hover:underline"
            >
              {selectedDocIds.length === documents.length ? (
                <CheckSquare className="w-4 h-4 text-[#111111] dark:text-white" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>{selectedDocIds.length} selected</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('important')}
              className="px-3 py-1.5 bg-white dark:bg-[#181818] text-amber-600 dark:text-amber-400 font-semibold rounded-xl border border-amber-200 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>Mark Important</span>
            </button>
            <button
              onClick={() => handleBulkAction('trash')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl flex items-center gap-1 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Move to Trash</span>
            </button>
          </div>
        </div>
      )}

      {/* Documents Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-56 bg-[#EBEBEB] dark:bg-[#181818] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No documents found' : 'Your vault is empty'}
          description={
            searchQuery
              ? `No matching document records found for "${searchQuery}". Try another search keyword.`
              : 'Upload your first document to keep everything organized in one secure place.'
          }
          actionText={searchQuery ? 'Clear Search' : 'Upload Document'}
          onAction={
            searchQuery ? () => setSearchQuery('') : () => navigate('/upload')
          }
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          }
        >
          {documents.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              viewMode={viewMode}
              onStarToggle={handleStarToggle}
              onShare={(d) => setSelectedDocForShare(d)}
              onEdit={(d) => setSelectedDocForEdit(d)}
              onTrash={handleMoveToTrash}
              onSelect={toggleSelectDoc}
              isSelected={selectedDocIds.includes(doc._id)}
            />
          ))}
        </div>
      )}

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
          onUpdated={fetchDocuments}
        />
      )}
    </div>
  );
}
