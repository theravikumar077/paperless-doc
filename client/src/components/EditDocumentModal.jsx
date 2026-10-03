import React, { useState } from 'react';
import { X, Save, FileText, Tag, Calendar, Folder } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function EditDocumentModal({ document: doc, onClose, onUpdated }) {
  const { showToast } = useToast();
  const [name, setName] = useState(doc.name || '');
  const [category, setCategory] = useState(doc.category || 'Other');
  const [issueDate, setIssueDate] = useState(
    doc.issueDate ? new Date(doc.issueDate).toISOString().split('T')[0] : ''
  );
  const [expiryDate, setExpiryDate] = useState(
    doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : ''
  );
  const [description, setDescription] = useState(doc.description || '');
  const [tags, setTags] = useState(doc.tags ? doc.tags.join(', ') : '');
  const [loading, setLoading] = useState(false);

  const categoriesList = ['Education', 'Identity', 'Medical', 'Career', 'Financial', 'Other'];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Document name is required', 'error');
      return;
    }

    try {
      setLoading(true);
      const tagArray = tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const res = await api.put(`/documents/${doc._id}`, {
        name: name.trim(),
        category,
        issueDate: issueDate || null,
        expiryDate: expiryDate || null,
        description: description.trim(),
        tags: tagArray,
      });

      showToast('Document updated successfully!', 'success');
      if (onUpdated) onUpdated(res.data.data);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update document', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111111] rounded-3xl max-w-lg w-full border border-[#E2E2E2] dark:border-[#292929] shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-[#E2E2E2] dark:border-[#292929] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] dark:bg-[#181818] border border-[#E2E2E2] dark:border-[#353535] text-[#111111] dark:text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111111] dark:text-white text-base">
                Edit Document
              </h3>
              <p className="text-xs text-[#666666] dark:text-[#A5A5A5]">Update metadata details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] dark:hover:text-white rounded-xl hover:bg-[#EBEBEB] dark:hover:bg-[#171717] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1">
              Document Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1">
                Issue Date (Optional)
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add short description or summary..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. semester1, marksheets, college"
              className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E2E2] dark:border-[#292929] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] rounded-xl shadow-md transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
