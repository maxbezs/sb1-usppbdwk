import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface AdvancedModeModalProps {
  onClose: () => void;
  onUnlock: () => void;
}

export function AdvancedModeModal({ onClose, onUnlock }: AdvancedModeModalProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onUnlock();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card-dark p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-center">Advanced Mode Access</h2>
        </div>

        <p className="text-white/70 mb-6">
          This mode is for advanced users only, and requires special permission to access.{' '}
          <a 
            href="wa.link/zggcba" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 underline"
          >
            Message us
          </a>{' '}
          to unlock this section for you by providing you with the password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Go back
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!password.trim()}
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}