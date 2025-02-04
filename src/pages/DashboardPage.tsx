import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { CreateMyPage } from '../components/dashboard/CreateMyPage';
import { YourEarnings } from '../components/dashboard/YourEarnings';
import { MyUsers } from '../components/dashboard/MyUsers';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';

type Tab = 'your-page' | 'your-earnings' | 'admin';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('your-page');
  const { signOut } = useAuthStore();
  const { isAdmin } = useProfileStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active tab from location state if provided
    const state = location.state as { activeTab?: Tab };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      // Clear the state to prevent persisting the tab selection
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen text-white film-grain bg-gray-900">
      {/* Primary Gradient Background */}
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
          `,
          backgroundSize: '200% 200%',
          animation: 'breathe 5s ease-in-out infinite',
        }}
      />
      
      {/* Frosted Glass Overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backdropFilter: 'blur(100px) saturate(150%)',
          background: 'rgba(0, 0, 0, 0.75)',
          animation: 'glow 5s ease-in-out infinite',
        }}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img 
            src="https://ccmklpdeyroazfftdugw.supabase.co/storage/v1/object/sign/Website%20images/nesso-plain-logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJXZWJzaXRlIGltYWdlcy9uZXNzby1wbGFpbi1sb2dvLnBuZyIsImlhdCI6MTczNzU5OTAwNywiZXhwIjoxNzY5MTM1MDA3fQ.XDDD9bxMHavXbhlfp1rd5hto8i9Aboa9--uReC0QL0o&t=2025-01-23T02%3A23%3A26.930Z" 
            alt="nesso.link"
            className="h-8 rounded"
          />
          <div className="flex items-center gap-4">
            {isAdmin() && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl transition-colors ${
                  activeTab === 'admin' ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="glass-card-dark p-1 mb-8 grid grid-cols-2 divide-x divide-white/10">
            <button
              onClick={() => setActiveTab('your-page')}
              className={`py-4 transition-colors font-[800] ${
                activeTab === 'your-page'
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}
              style={{ fontFamily: 'Syne' }}
            >
              Your page
            </button>
            <button
              onClick={() => setActiveTab('your-earnings')}
              className={`py-4 transition-colors font-[800] ${
                activeTab === 'your-earnings'
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}
              style={{ fontFamily: 'Syne' }}
            >
              Your Earnings
            </button>
          </div>

          {/* Tab Content */}
          <div className="glass-card-dark p-8">
            {activeTab === 'your-page' && <CreateMyPage />}
            {activeTab === 'your-earnings' && <YourEarnings />}
            {activeTab === 'admin' && isAdmin() && <MyUsers />}
          </div>
        </div>
      </div>
    </div>
  );
}