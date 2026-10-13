import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface LocationModalProps {
  title: string;
  subtitle: string;
  structure: string;
  icon: ReactNode;
  accentColor: string;
  onClose: () => void;
  children: ReactNode;
}

export default function LocationModal({
  title,
  subtitle,
  structure,
  icon,
  accentColor,
  onClose,
  children,
}: LocationModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[85vh] border-2 shadow-2xl flex flex-col overflow-hidden"
        style={{ borderColor: accentColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <div
              className="ml-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {structure}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
