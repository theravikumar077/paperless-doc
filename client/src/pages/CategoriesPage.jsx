import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  GraduationCap,
  IdCard,
  HeartPulse,
  Briefcase,
  CreditCard,
  Folder,
  Trash2,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const iconMap = {
    'graduation-cap': GraduationCap,
    'id-card': IdCard,
    'heart-pulse': HeartPulse,
    briefcase: Briefcase,
    'credit-card': CreditCard,
    folder: Folder,
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (e) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/categories', { name: newCatName.trim() });
      showToast('Custom category created!', 'success');
      setNewCatName('');
      setShowAddModal(false);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Delete category "${catName}"? Documents will be moved to Other.`)) {
      return;
    }

    try {
      await api.delete(`/categories/${catId}`);
      showToast(`Category "${catName}" deleted`, 'info');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white">
            Document Categories
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Organize documents into structured categories
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-semibold py-2.5 px-4 rounded-2xl flex items-center gap-1.5 text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Category</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Folder;
            return (
              <div
                key={cat.id || cat.name}
                onClick={() =>
                  navigate(`/categories/${encodeURIComponent(cat.name.toLowerCase())}`)
                }
                className="group p-5 bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-3xl shadow-sm hover:shadow-md hover:border-[#111111] dark:hover:border-white transition cursor-pointer flex items-start justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-neutral-100 dark:bg-neutral-800 text-[#111111] dark:text-white"
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#111111] dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {cat.count} {cat.count === 1 ? 'document' : 'documents'}
                    </p>
                  </div>
                </div>

                {!cat.isSystem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat.id, cat.name);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111111] rounded-3xl max-w-sm w-full border border-[#E2E2E2] dark:border-[#292929] shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-[#111111] dark:text-white">
              Create Custom Category
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Taxes, Vehicle, Receipts"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] rounded-xl shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
