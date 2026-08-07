import React from 'react';
import { X } from 'lucide-react';

interface PhotoLightboxProps {
  src: string | null;
  caption: string | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ src, caption, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md transition-all cursor-pointer"
          aria-label="ปิดรูปภาพ"
        >
          <X className="w-6 h-6" />
        </button>

        <img
          src={src}
          alt={caption || 'Enlarged membrane photo'}
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
        />

        {caption && (
          <p className="mt-3 text-sm font-semibold text-slate-200 bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};
