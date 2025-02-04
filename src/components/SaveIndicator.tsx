import React, { useEffect, useState } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface SaveIndicatorProps {
  status: 'saving' | 'saved' | 'error';
  message?: string;
}

export function SaveIndicator({ status, message }: SaveIndicatorProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (status === 'saved') {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
    setVisible(true);
  }, [status]);

  if (!visible) return null;

  return (
    <div
      className={`
        flex items-center gap-2 text-sm
        ${status === 'saving' ? 'text-white/70' : ''}
        ${status === 'saved' ? 'text-[#4CAF50]' : ''}
        ${status === 'error' ? 'text-red-400' : ''}
      `}
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {status === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === 'saved' && <Check className="w-4 h-4" />}
      {status === 'error' && <AlertCircle className="w-4 h-4" />}
      <span>
        {status === 'saving' && 'Saving...'}
        {status === 'saved' && 'Saved'}
        {status === 'error' && (message || 'Error saving')}
      </span>
    </div>
  );
}