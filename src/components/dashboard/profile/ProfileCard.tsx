import React, { useRef, useState } from 'react';
import { Upload, Pencil, Loader2, Copy, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AutosaveInput } from '../../AutosaveInput';
import { useProfileStore } from '../../../store/profileStore';

export function ProfileCard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  const { profile, uploadAvatar } = useProfileStore();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      try {
        setIsUploadingAvatar(true);
        await uploadAvatar(file);
        setAvatarKey(Date.now());
      } catch (error) {
        console.error('Error uploading avatar:', error);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleCopyUrl = async () => {
    if (!profile?.username) return;
    
    const url = `${window.location.origin}/${profile.username}`;
    await navigator.clipboard.writeText(url);
    
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handlePreviewPage = () => {
    if (!profile?.username) return;
    navigate(`/${profile.username}`);
  };

  return (
    <div className="glass-card-dark p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-white/70">Tell us about yourself...</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyUrl}
            disabled={!profile?.username}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4" />
            Copy Page URL
          </button>
          <button
            onClick={handlePreviewPage}
            disabled={!profile?.username}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ExternalLink className="w-4 h-4" />
            Preview Page
          </button>
        </div>
      </div>
      
      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <div 
          className="relative w-24 h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center cursor-pointer group"
          onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
        >
          {profile?.avatar_url ? (
            <>
              <img 
                key={avatarKey}
                src={profile.avatar_url}
                alt={profile.display_name || 'Profile'} 
                className="w-full h-full object-cover transition-opacity group-hover:opacity-50" 
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = `${profile.avatar_url}?t=${Date.now()}`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploadingAvatar ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Pencil className="w-6 h-6 text-white" />
                )}
              </div>
            </>
          ) : (
            isUploadingAvatar ? (
              <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-white/50" />
            )
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploadingAvatar}
          />
        </div>
        <div className="flex-1 space-y-4">
          <AutosaveInput
            value={profile?.display_name || ''}
            field="display_name"
            placeholder="Display Name"
          />
          <AutosaveInput
            value={profile?.headline || ''}
            field="headline"
            placeholder="Job title or headline"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <AutosaveInput
          type="textarea"
          value={profile?.bio || ''}
          field="bio"
          placeholder="Need inspiration? Use this template: 'I am the [type of person] for [target customers] who want to [desired outcome]' and continue to elaborate on the experience of why you do this, how you do it, and what exactly is involved."
          maxLength={777}
          rows={3}
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <h3 className="text-lg font-[800]" style={{ fontFamily: 'Syne' }}>Domain name</h3>
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1">
              <span className="text-white/70">nesso.link/</span>
              <div className="flex-1 flex items-center gap-8">
                <AutosaveInput
                  value={profile?.username || ''}
                  field="username"
                  placeholder="username"
                  className="flex-1"
                />
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/15 transition-colors animate-pulse whitespace-nowrap"
                  >
                    Buy your domain
                  </button>
                  <div className="absolute -bottom-16 right-0 hidden group-hover:block w-48 p-3 bg-black/90 backdrop-blur-lg rounded-lg text-sm text-white/70 whitespace-normal">
                    <p>£6 per month, and you can change it for free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}