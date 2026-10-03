import React from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/paperlessdoc-logo.png';

export default function EmptyState({
  icon: Icon,
  title = 'No documents yet',
  description = 'Upload your first document to keep everything organized in one secure place.',
  actionText = 'Upload Document',
  onAction,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate('/upload');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#292929] rounded-3xl shadow-sm my-4">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F5F5] dark:bg-[#181818] border border-[#E2E2E2] dark:border-[#353535] flex items-center justify-center mb-4 p-2.5">
        {Icon ? (
          <Icon className="w-8 h-8 text-[#111111] dark:text-white stroke-[1.75]" />
        ) : (
          <img
            src={logoImg}
            alt="PaperlessDoc Logo"
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <h3 className="font-bold text-lg text-[#111111] dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#666666] dark:text-[#A5A5A5] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <button
          onClick={handleAction}
          className="bg-[#111111] hover:bg-[#242424] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#0A0A0A] font-medium py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Upload className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
