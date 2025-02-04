import React, { useState, useRef } from 'react';
import { ChevronDown, Trash2, AlertCircle, Upload, Loader2, Youtube, Video } from 'lucide-react';
import { useProfileStore } from '../../../store/profileStore';
import { AutosaveInput } from '../../AutosaveInput';
import { CardHeader } from './CardHeader';

type ExperienceType = 'Company' | 'Project' | 'Qualification';
type MediaType = 'image' | 'youtube' | 'vimeo';

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  type: ExperienceType;
  media_type?: MediaType;
  media_url?: string;
}

const MAX_EXPERIENCES = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ExperiencesCard() {
  const { profile, updateExperiences, uploadProductImage } = useProfileStore();
  const [experienceError, setExperienceError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddExperience = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    if ((profile?.experiences?.length || 0) >= MAX_EXPERIENCES) {
      setExperienceError(`You can only add up to ${MAX_EXPERIENCES} experiences`);
      setTimeout(() => setExperienceError(null), 3000);
      return;
    }

    const newExperiences = [
      {
        id: crypto.randomUUID(),
        company: '',
        role: '',
        description: '',
        type: 'Company' as const,
        order: (profile?.experiences?.length || 0)
      },
      ...(profile?.experiences || [])
    ];
    updateExperiences(newExperiences);
  };

  const handleRemoveExperience = (id: string) => {
    const newExperiences = (profile?.experiences || []).filter(exp => exp.id !== id);
    updateExperiences(newExperiences);
    setExperienceError(null);
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: any) => {
    const newExperiences = (profile?.experiences || []).map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateExperiences(newExperiences);
  };

  const handleImageUpload = async (experienceId: string, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setExperienceError('Image size should be less than 5MB');
      setTimeout(() => setExperienceError(null), 3000);
      return;
    }

    try {
      setUploadingImage(experienceId);
      const imageUrl = await uploadProductImage(file);
      
      const newExperiences = (profile?.experiences || []).map(exp =>
        exp.id === experienceId ? { 
          ...exp, 
          media_type: 'image' as const,
          media_url: imageUrl 
        } : exp
      );
      
      await updateExperiences(newExperiences);
    } catch (error) {
      console.error('Error uploading experience image:', error);
      setExperienceError('Failed to upload image');
      setTimeout(() => setExperienceError(null), 3000);
    } finally {
      setUploadingImage(null);
    }
  };

  const validateVideoUrl = (url: string, type: 'youtube' | 'vimeo'): boolean => {
    if (type === 'youtube') {
      return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
    } else {
      return /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/.test(url);
    }
  };

  return (
    <div className="glass-card-dark">
      <CardHeader
        title="Experiences"
        subtitle="Share your professional journey and achievements"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onAdd={handleAddExperience}
      />

      {isExpanded && (
        <div className="px-8 pb-8 space-y-6">
          {experienceError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{experienceError}</span>
            </div>
          )}

          <div className="space-y-4">
            {profile?.experiences?.map((exp) => (
              <div key={exp.id} className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <select
                        value={exp.type || 'Company'}
                        onChange={(e) => handleExperienceChange(exp.id, 'type', e.target.value as ExperienceType)}
                        className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white appearance-none cursor-pointer"
                      >
                        <option value="Company" className="bg-gray-900">Company</option>
                        <option value="Project" className="bg-gray-900">Project</option>
                        <option value="Qualification" className="bg-gray-900">Qualification</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    </div>
                    <AutosaveInput
                      value={exp.company}
                      field={`experiences.${exp.id}.company`}
                      placeholder={exp.type === 'Company' ? 'Company Name' : 
                                exp.type === 'Project' ? 'Project Name' : 
                                'Institution Name'}
                    />
                  </div>
                  <div className="space-y-4">
                    <AutosaveInput
                      value={exp.role}
                      field={`experiences.${exp.id}.role`}
                      placeholder={exp.type === 'Company' ? 'Your Role' : 
                                exp.type === 'Project' ? 'Your Contribution' : 
                                'Qualification'}
                    />
                  </div>
                </div>

                <div>
                  <AutosaveInput
                    type="textarea"
                    value={exp.description}
                    field={`experiences.${exp.id}.description`}
                    placeholder={exp.type === 'Qualification' 
                      ? "Tell us about your qualification; the modules and the main skills you learnt"
                      : "Describe your role, achievements, and impact (max 300 characters)"}
                    maxLength={300}
                    rows={3}
                  />
                </div>

                {/* Media Section for Projects */}
                {exp.type === 'Project' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <select
                        value={exp.media_type || ''}
                        onChange={(e) => handleExperienceChange(exp.id, 'media_type', e.target.value || undefined)}
                        className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-900">Select media type</option>
                        <option value="image" className="bg-gray-900">Image</option>
                        <option value="youtube" className="bg-gray-900">YouTube Video</option>
                        <option value="vimeo" className="bg-gray-900">Vimeo Video</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    </div>

                    {exp.media_type === 'image' && (
                      <div 
                        className="relative w-full h-40 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {exp.media_url ? (
                          <>
                            <img 
                              src={exp.media_url}
                              alt={exp.company} 
                              className="w-full h-full object-cover transition-opacity group-hover:opacity-50" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {uploadingImage === exp.id ? (
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                              ) : (
                                <Upload className="w-6 h-6 text-white" />
                              )}
                            </div>
                          </>
                        ) : (
                          uploadingImage === exp.id ? (
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
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(exp.id, file);
                            }
                          }}
                          disabled={uploadingImage === exp.id}
                        />
                      </div>
                    )}

                    {(exp.media_type === 'youtube' || exp.media_type === 'vimeo') && (
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <AutosaveInput
                            value={exp.media_url || ''}
                            field={`experiences.${exp.id}.media_url`}
                            placeholder={`Enter ${exp.media_type === 'youtube' ? 'YouTube' : 'Vimeo'} URL`}
                          />
                          {exp.media_type === 'youtube' ? (
                            <Youtube className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                          ) : (
                            <Video className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white/70 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}