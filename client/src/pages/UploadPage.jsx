import React, { useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  FileImage,
  CheckCircle2,
  X,
  AlertCircle,
  Tag,
  Calendar,
  Folder,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function UploadPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refreshStorage } = useOutletContext() || {};

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('Education');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = ['Education', 'Identity', 'Medical', 'Career', 'Financial', 'Other'];

  const handleFileChange = (file) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds the 10 MB limit', 'error');
      return;
    }

    // Validate type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PDF, JPG, JPEG, PNG, and WEBP formats are allowed', 'error');
      return;
    }

    setSelectedFile(file);

    // Auto-fill document name if empty
    if (!documentName) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setDocumentName(nameWithoutExt);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select a document file to upload', 'error');
      return;
    }

    if (!documentName.trim()) {
      showToast('Document name is required', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', documentName.trim());
      formData.append('category', category);
      if (issueDate) formData.append('issueDate', issueDate);
      if (expiryDate) formData.append('expiryDate', expiryDate);
      if (description) formData.append('description', description.trim());
      if (tags) formData.append('tags', tags);

      const res = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      showToast('Document uploaded successfully!', 'success');
      if (refreshStorage) refreshStorage();
      navigate(`/documents/${res.data.data._id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] dark:text-white">
          Upload Document
        </h1>
        <p className="text-xs text-[#666666] dark:text-[#A5A5A5] mt-0.5">
          Add your important documents and keep them safe in your vault
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag and Drop Zone matching Requirement 14 */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition duration-200 ${
            dragActive
              ? 'border-[#111111] bg-[#F5F5F5] dark:border-white dark:bg-[#181818]'
              : selectedFile
              ? 'border-[#3A3A3A] bg-[#F5F5F5]/60 dark:bg-[#151515]'
              : 'border-[#CFCFCF] dark:border-[#333333] bg-white dark:bg-[#111111] hover:border-[#111111] dark:hover:border-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center mx-auto shadow-md border border-[#3A3A3A]">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#111111] dark:text-white">
                  Tap to upload <span className="text-[#666666] dark:text-[#A5A5A5] font-normal">or drag and drop</span>
                </h4>
                <p className="text-xs text-[#777777] dark:text-[#707070] mt-1">
                  Supported formats: PDF, JPG, PNG, WEBP (Max 10 MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-white dark:bg-[#181818] rounded-2xl border border-[#E2E2E2] dark:border-[#292929] shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center font-bold text-xs shrink-0">
                  {selectedFile.type.includes('pdf') ? 'PDF' : 'IMG'}
                </div>
                <div className="text-left min-w-0">
                  <h5 className="font-semibold text-xs text-[#111111] dark:text-white truncate">
                    {selectedFile.name}
                  </h5>
                  <p className="text-[10px] text-[#666666] dark:text-[#A5A5A5]">
                    {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="p-1 text-[#777777] hover:text-rose-500 rounded-lg hover:bg-[#EBEBEB] dark:hover:bg-[#222222]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="p-4 bg-[#F5F5F5] dark:bg-[#151515] border border-[#E2E2E2] dark:border-[#292929] rounded-2xl space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-[#111111] dark:text-white">
              <span>Uploading document...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#EBEBEB] dark:bg-[#181818] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#111111] dark:bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata Fields Card */}
        <div className="bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] p-6 rounded-3xl shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                Document Name *
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g. 12th Marksheet, Passport"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                Issue Date (Optional)
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short description or notes..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E5E5E5] mb-1.5">
              Tags (Comma separated, e.g. college, degree, 2026)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="college, marksheet, semester"
              className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F5] dark:bg-[#151515] text-[#111111] dark:text-white border border-[#E2E2E2] dark:border-[#292929] rounded-xl focus:outline-none focus:border-[#111111] dark:focus:border-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-xs font-semibold text-[#666666] dark:text-[#A5A5A5] hover:bg-[#EBEBEB] dark:hover:bg-[#171717] rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] disabled:opacity-50 font-bold py-3 px-8 rounded-xl text-xs shadow-md transition transform hover:-translate-y-0.5"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
}
