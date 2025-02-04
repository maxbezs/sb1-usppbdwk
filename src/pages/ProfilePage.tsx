import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';

type TabType = 'LINKS' | 'EXP' | 'EMPORIUM';

export function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const { profile } = useProfileStore();

  const handleCopyUrl = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <div className="min-h-screen text-white film-grain bg-gray-900">
      {/* Background gradients */}
      <div 
        className="fixed inset-0 -z-20"
        style={{
          background: `
            radial-gradient(
              circle at 30% 20%,
              #b1a1e3 0%,
              rgba(177, 161, 227, 0.3) 10%,
              rgba(177, 161, 227, 0.05) 25%,
              transparent 50%
            ),
            radial-gradient(
              circle at 70% 80%,
              #b1a1e3 0%,
              rgba(177, 161, 227, 0.3) 10%,
              rgba(177, 161, 227, 0.05) 25%,
              transparent 50%
            )
          `
        }}
      />
      
      {/* Frosted Glass Overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backdropFilter: 'blur(100px) saturate(150%)',
          background: 'rgba(0, 0, 0, 0.75)'
        }}
      />

      {/* First Section - Profile Info */}
      <section className="min-h-[80vh] px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - 45% */}
          <div className="lg:col-span-5 space-y-8">
            {/* Back to Dashboard */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            {/* Contact Details */}
            <div className="glass-card-dark p-8 space-y-4">
              <h2 className="text-xl font-semibold">Contact Details</h2>
              {profile?.contacts?.map((contact) => (
                <div key={contact.id} className="flex flex-col gap-1">
                  <span className="text-white/70 text-sm">
                    {contact.type === 'Other' ? contact.customType : contact.type}
                  </span>
                  <span className="text-white">{contact.value}</span>
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="glass-card-dark p-8 space-y-4">
              <h2 className="text-xl font-semibold">Links</h2>
              {profile?.social_links?.map((link) => (
                <div key={link.id} className="flex flex-col gap-1">
                  <span className="text-white/70 text-sm">{link.title}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                  >
                    {link.url}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - 55% */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glass-card-dark p-8 space-y-6">
              {/* Profile Picture & Name */}
              <div className="flex gap-8">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/10">
                  {profile?.avatar_url && (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h1 className="text-3xl font-[800]" style={{ fontFamily: 'Syne' }}>
                    {profile?.display_name}
                  </h1>
                  <h2 className="text-xl text-white/90">{profile?.headline}</h2>
                </div>
              </div>

              {/* Bio */}
              <div className="relative">
                <p className={`text-white/70 transition-all duration-300 ${
                  isBioExpanded ? '' : 'line-clamp-2'
                }`}>
                  {profile?.bio}
                </p>
                {profile?.bio && profile.bio.length > 100 && (
                  <button
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="text-white/50 hover:text-white flex items-center gap-1 mt-2 transition-colors"
                  >
                    {isBioExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Show less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Read more</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Projects */}
      <section className="min-h-fit px-6 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-[800]" style={{ fontFamily: 'Syne' }}>Projects</h2>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 gap-6">
            {profile?.experiences?.filter(exp => exp.type === 'Project').map((project) => (
              <div key={project.id} className="glass-card-dark p-8 space-y-4">
                {project.media_url && (
                  <div className="w-full h-48 rounded-xl overflow-hidden">
                    <img
                      src={project.media_url}
                      alt={project.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold">{project.company}</h3>
                <p className="text-white/90">{project.role}</p>
                <p className="text-white/70">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Third Section - Experiences */}
      <section className="min-h-fit px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-[800]" style={{ fontFamily: 'Syne' }}>Experiences</h2>
          </div>
          <div className="lg:col-span-7">
            <div className="glass-card-dark p-8 space-y-8">
              {profile?.experiences?.filter(exp => exp.type === 'Company').map((experience) => (
                <div key={experience.id} className="space-y-2 pb-8 border-b border-white/10 last:border-0 last:pb-0">
                  <h3 className="text-xl font-semibold">{experience.company}</h3>
                  <p className="text-white/90">{experience.role}</p>
                  <p className="text-white/70">{experience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fourth Section - Qualifications */}
      <section className="min-h-fit px-6 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-[800]" style={{ fontFamily: 'Syne' }}>Qualifications</h2>
          </div>
          <div className="lg:col-span-7">
            <div className="glass-card-dark p-8 space-y-8">
              {profile?.experiences?.filter(exp => exp.type === 'Qualification').map((qualification) => (
                <div key={qualification.id} className="space-y-2 pb-8 border-b border-white/10 last:border-0 last:pb-0">
                  <h3 className="text-xl font-semibold">{qualification.company}</h3>
                  <p className="text-white/90">{qualification.role}</p>
                  <p className="text-white/70">{qualification.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fifth Section - Products & Services */}
      <section className="min-h-fit px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-[800] text-center" style={{ fontFamily: 'Syne' }}>
            Products & Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile?.products?.map((product) => (
              <div key={product.id} className="glass-card-dark p-8 space-y-4">
                {product.image_url && (
                  <div className="w-full h-48 rounded-xl overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-2xl font-bold">{product.price}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/dashboard/product/${product.id}/preview`)}
                    className="flex-1 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                  >
                    More Details
                  </button>
                  <a
                    href={product.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-white text-black rounded-xl hover:bg-white/90 transition-colors text-center"
                  >
                    Purchase
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sixth Section - Contact */}
      <section className="min-h-fit px-6 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-[800]" style={{ fontFamily: 'Syne' }}>Contact</h2>
          </div>
          <div className="lg:col-span-7">
            <div className="glass-card-dark p-8 space-y-6">
              <p className="text-xl text-white/90">
                Looking to work with me or have a question? Feel free to contact me.
              </p>
              <div className="space-y-4">
                {profile?.contacts?.map((contact) => (
                  <div key={contact.id} className="flex flex-col gap-1">
                    <span className="text-white/70 text-sm">
                      {contact.type === 'Other' ? contact.customType : contact.type}
                    </span>
                    <span className="text-white">{contact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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