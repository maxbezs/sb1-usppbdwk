import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  onAdd: () => void;
  showToggle?: boolean;
}

export function CardHeader({ 
  title, 
  subtitle, 
  isExpanded, 
  onToggle, 
  onAdd,
  showToggle = true
}: CardHeaderProps) {
  return (
    <div 
      onClick={showToggle ? onToggle : undefined}
      className={`p-8 flex justify-between items-start ${showToggle ? 'cursor-pointer hover:bg-white/5' : ''} transition-colors rounded-t-xl`}
    >
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {(subtitle && (isExpanded || !showToggle)) && (
          <p className="text-white/70">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {showToggle && (
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-white/70" />
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className={`flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/15 transition-colors ${showToggle && !isExpanded ? 'hidden' : 'opacity-0 animate-fade-in'}`}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}