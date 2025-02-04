import React, { useState } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { SaveIndicator } from '../SaveIndicator';

interface ReferredUser {
  display_name: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

export function YourEarnings() {
  const { profile, updateField, saveStates } = useProfileStore();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [referredUsers] = useState<ReferredUser[]>([
    // Mock data - replace with actual API data
    {
      display_name: 'John Doe',
      username: 'johndoe',
      avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
      created_at: '2024-01-23T00:00:00Z'
    }
  ]);

  const referralCode = profile?.username ? `${profile.username}77` : '';
  const monthlyEarnings = referredUsers.length * 3; // £3 per user

  const handleCopyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handlePayPalChange = (value: string) => {
    updateField('paypal_username', value);
  };

  return (
    <div className="space-y-8">
      {/* Referral Code Section */}
      <div className="glass-card-dark p-8">
        <h2 className="text-2xl font-bold mb-4">Your Referral Code</h2>
        <div className="flex items-center gap-4">
          <code className="px-4 py-2 bg-white/10 rounded-lg text-xl">
            {referralCode}
          </code>
          <button
            onClick={handleCopyReferralCode}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="mt-4 text-white/70">
          Whenever users get their nesso.link/ domain and use this discount code, 
          you receive 20% of their subscription fee, forever.
        </p>
        <div className="mt-4 flex gap-4">
          <a
            href="#video"
            className="text-white hover:text-white/80 flex items-center gap-2 transition-colors"
          >
            Watch founder's showcase video <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="#pitch"
            className="text-white hover:text-white/80 flex items-center gap-2 transition-colors"
          >
            Read written pitch <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card-dark p-8">
          <h3 className="text-lg text-white/70 mb-2">Total nesso.link/ users</h3>
          <p className="text-4xl font-bold">{referredUsers.length}</p>
        </div>
        <div className="glass-card-dark p-8">
          <h3 className="text-lg text-white/70 mb-2">Expected earnings on the 16th</h3>
          <p className="text-4xl font-bold">£{monthlyEarnings}</p>
        </div>
      </div>

      {/* PayPal Section */}
      <div className="glass-card-dark p-8">
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="paypal" className="block text-sm text-white/70 mb-2">
              Your PayPal username to send your payouts
            </label>
            <input
              id="paypal"
              type="text"
              value={profile?.paypal_username || ''}
              onChange={(e) => handlePayPalChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
              placeholder="username@example.com"
            />
            {saveStates['paypal_username'] && (
              <div className="absolute right-4 top-1/2 translate-y-1">
                <SaveIndicator 
                  status={saveStates['paypal_username'].status} 
                  message={saveStates['paypal_username'].message} 
                />
              </div>
            )}
          </div>
          <p className="text-sm text-white/50 italic">
            Prefer to be paid another way? Message us and we'll work it out.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card-dark p-8">
        <h2 className="text-2xl font-bold mb-6">Referred Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 font-medium text-white/70">User</th>
                <th className="text-left py-4 font-medium text-white/70">nesso.link URL</th>
                <th className="text-left py-4 font-medium text-white/70">Sign-up Date</th>
                <th className="text-left py-4 font-medium text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {referredUsers.map((user) => (
                <tr key={user.username} className="hover:bg-white/5">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>{user.display_name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <a
                      href={`/${user.username}`}
                      className="text-white hover:text-white/80 transition-colors"
                    >
                      nesso.link/{user.username}
                    </a>
                  </td>
                  <td className="py-4">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <a
                      href={`/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg inline-flex items-center gap-2 transition-colors"
                    >
                      View Profile
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy Toast */}
      {showCopyToast && (
        <div className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white shadow-lg transition-all animate-fade-in">
          <Check className="w-4 h-4 text-green-400" />
          <span>Referral code copied to clipboard</span>
        </div>
      )}
    </div>
  );
}