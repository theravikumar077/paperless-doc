import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  FileText,
  Calendar,
  Lock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function PublicSharePage() {
  const { token } = useParams();
  const [shareInfo, setShareInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShareInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/share/public/${token}`);
        setShareInfo(res.data.data);
      } catch (err) {
        setErrorMsg(
          err.response?.data?.message || 'Invalid, revoked, or expired share link.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchShareInfo();
  }, [token]);

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="p-3 bg-white/10 rounded-2xl border border-[#353535] shadow-lg">
          <img src={logoImg} alt="PaperlessDoc Logo" className="w-12 h-12 object-contain animate-pulse" />
        </div>
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111111] border border-[#292929] rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-900">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Link Unavailable</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">{errorMsg}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0A0A0A] hover:bg-[#E5E5E5] font-semibold text-xs rounded-xl shadow-md transition"
          >
            Go to PaperlessDoc
          </Link>
        </div>
      </div>
    );
  }

  const doc = shareInfo?.document;
  const isPDF = doc?.fileType?.includes('pdf');
  const isImage = doc?.fileType?.includes('image');
  const streamUrl = `/api/documents/stream/${doc?.fileUrl?.split('/').pop()}?token=${token}`;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans">
      {/* Navbar */}
      <header className="px-6 py-4 border-b border-[#292929] bg-[#0D0D0D]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/10 rounded-xl border border-[#353535]">
              <img src={logoImg} alt="PaperlessDoc Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-lg text-white">PaperlessDoc</span>
          </div>

          <a
            href={`/api/share/public/${token}/download`}
            download
            className="bg-white hover:bg-[#E5E5E5] text-[#0A0A0A] font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Document</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        <div className="bg-[#111111] border border-[#292929] rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Secure Shared Access</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{doc?.name}</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Category: {doc?.category} • Size: {formatBytes(doc?.fileSize)}
            </p>
          </div>

          <a
            href={`/api/share/public/${token}/download`}
            download
            className="bg-white hover:bg-[#E5E5E5] text-[#0A0A0A] font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Original File</span>
          </a>
        </div>

        {/* Viewer */}
        <div className="bg-[#111111] border border-[#292929] rounded-3xl p-4 min-h-[500px] flex items-center justify-center overflow-hidden">
          {isImage ? (
            <img
              src={streamUrl}
              alt={doc?.name}
              className="max-w-full max-h-[600px] object-contain rounded-2xl"
            />
          ) : isPDF ? (
            <iframe
              src={`${streamUrl}#toolbar=0`}
              title={doc?.name}
              className="w-full h-[600px] rounded-2xl border-0 bg-white"
            />
          ) : (
            <div className="text-center p-8 space-y-4">
              <FileText className="w-16 h-16 text-neutral-400 mx-auto" />
              <h3 className="text-white font-bold text-base">{doc?.name}</h3>
              <p className="text-xs text-neutral-400">
                Preview not directly embeddable for this file type. Click download below to view.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-neutral-500 border-t border-[#292929]">
        PaperlessDoc • Secure Encrypted Personal Document Management
      </footer>
    </div>
  );
}
