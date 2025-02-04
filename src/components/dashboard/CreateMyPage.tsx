import React, { useState, useEffect } from 'react';
import { Check, Lock, ChevronDown } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { ProfileCard } from './profile/ProfileCard';
import { LinksCard } from './profile/LinksCard';
import { ContactCard } from './profile/ContactCard';
import { ExperiencesCard } from './profile/ExperiencesCard';
import { ProductsCard } from './profile/ProductsCard';
import { AdvancedModeModal } from '../AdvancedModeModal';

export function CreateMyPage() {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showAdvancedModeModal, setShowAdvancedModeModal] = useState(false);
  
  const { profile, updateField, initialized } = useProfileStore();

  // Set initial advanced mode state based on profile
  useEffect(() => {
    if (initialized && profile?.has_advanced_access) {
      setIsAdvancedMode(true);
    }
  }, [initialized, profile?.has_advanced_access]);

  const handleAdvancedModeClick = () => {
    if (!profile?.has_advanced_access) {
      setShowAdvancedModeModal(true);
    } else {
      setIsAdvancedMode(!isAdvancedMode);
    }
  };

  const handleUnlockAdvancedMode = async () => {
    try {
      await updateField('has_advanced_access', true);
      setShowAdvancedModeModal(false);
      setIsAdvancedMode(true);
    } catch (error) {
      console.error('Error unlocking advanced mode:', error);
    }
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProfileCard />
      <LinksCard />
      <ContactCard />

      {/* Advanced Mode Header */}
      <button
        onClick={handleAdvancedModeClick}
        className="w-full flex flex-col p-8 glass-card-dark hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Advanced Mode</h2>
            {!profile?.has_advanced_access && <Lock className="w-5 h-5 text-white/70" />}
            <span className="text-white/70">All of you... all in one place.</span>
          </div>
          <div className={`transform transition-transform duration-300 ${isAdvancedMode ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
        {isAdvancedMode && (
          <p className="mt-4 text-white/70 max-w-3xl">
            nesso.link/ makes it easier to do business with you, helping you gain opportunities you deserve. Turn your link-in-bio tool into a Portfolio, Resumé and your personal shop.
          </p>
        )}
      </button>

      {/* Advanced Mode Content */}
      {profile?.has_advanced_access && (
        <div
          className={`space-y-8 transition-all duration-300 ease-in-out overflow-hidden ${
            isAdvancedMode ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ExperiencesCard />
          <ProductsCard />
        </div>
      )}

      {/* Advanced Mode Modal */}
      {showAdvancedModeModal && (
        <AdvancedModeModal
          onClose={() => setShowAdvancedModeModal(false)}
          onUnlock={handleUnlockAdvancedMode}
        />
      )}

      {/* Copy URL Toast */}
      {showCopyToast && (
        <div className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white shadow-lg transition-all">
          <Check className="w-4 h-4 text-green-400" />
          <span>URL copied to clipboard</span>
        </div>
      )}
    </div>
  );
}