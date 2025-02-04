import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { PaymentCalendar } from '../components/PaymentCalendar';
import { AnimatedText } from '../components/AnimatedText';
import { useAuthStore } from '../store/authStore';

function HomePage() {
  const [username, setUsername] = useState('');
  const [subscribers, setSubscribers] = useState(10);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const profiles = [
    {
      name: 'Sarah Chen',
      role: 'Digital Creator',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    {
      name: 'Alex Rivera',
      role: 'Tech Founder',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    {
      name: 'Maria Silva',
      role: 'Content Creator',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    },
    {
      name: 'James Wilson',
      role: 'Designer',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    {
      name: 'Emma Thompson',
      role: 'Influencer',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    {
      name: 'David Park',
      role: 'Entrepreneur',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    {
      name: 'Lisa Johnson',
      role: 'Artist',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    },
    {
      name: 'Michael Brown',
      role: 'Developer',
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    },
  ];

  const handleEarningsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/dashboard', { state: { activeTab: 'your-earnings' } });
  };

  const UsernameInput = ({ className = '' }: { className?: string }) => (
    <div
      className={`glass-card-dark px-4 rounded-2xl flex items-center gap-2 ${className}`}
    >
      <span className="text-white/70">nesso.link/</span>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="yourname"
        className="shining-input bg-transparent border-none outline-none flex-1 text-white placeholder-white/50 py-4 rounded"
      />
      <button
        onClick={() => navigate(user ? '/dashboard' : '/auth/signup')}
        className="px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
      >
        {user ? 'GO TO DASHBOARD' : 'CLAIM IT'}
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen text-white film-grain bg-gray-900">
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
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(177, 161, 227, 0.1) 0%,
              rgba(177, 161, 227, 0.05) 15%,
              transparent 40%
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

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed w-full z-50 px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <img
              src="https://ccmklpdeyroazfftdugw.supabase.co/storage/v1/object/sign/Website%20images/nesso-plain-logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJXZWJzaXRlIGltYWdlcy9uZXNzby1wbGFpbi1sb2dvLnBuZyIsImlhdCI6MTczNzU5OTAwNywiZXhwIjoxNzY5MTM1MDA3fQ.XDDD9bxMHavXbhlfp1rd5hto8i9Aboa9--uReC0QL0o&t=2025-01-23T02%3A23%3A26.930Z"
              alt="nesso.link"
              className="h-8 rounded"
            />
            <div className="flex gap-8 items-center">
              <a
                href="/dashboard"
                className="text-white/90 hover:text-white transition"
              >
                DASHBOARD
              </a>
              <a
                href="#"
                onClick={handleEarningsClick}
                className="text-white/90 hover:text-white transition"
              >
                EARNINGS
              </a>
              {!user && (
                <button
                  onClick={() => navigate('/auth/signin')}
                  className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition"
                >
                  SIGN IN / SIGN UP
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center h-[600px] space-y-8">
              <h1
                className="text-4xl md:text-5xl font-[800] text-white max-w-md"
                style={{ fontFamily: 'Syne' }}
              >
                Hey wonderful...
              </h1>
              <div className="space-y-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-4 group">
                    <div className="step-number w-12 h-12 rounded-full bg-black/40 backdrop-blur-lg flex items-center justify-center text-xl font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110">
                      {step}
                    </div>
                    <span className="text-xl font-semibold text-white/90">
                      {step === 1 && 'Sign up'}
                      {step === 2 && 'Get your friends to sign up'}
                      {step === 3 && 'Earn money'}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-2xl text-white/90">
                with a link-in-bio tool that pays you when your followers
                sign-up
              </p>

              <UsernameInput />
            </div>

            <div className="relative overflow-hidden h-[600px] glass-card-dark">
              <div className="animate-scroll grid grid-cols-2 gap-4 p-4">
                {profiles.map((profile, i) => (
                  <div key={i} className="glass-card-dark p-4">
                    <img
                      src={`${profile.img}?w=400&h=400&fit=crop`}
                      alt={profile.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-white">{profile.name}</h3>
                    <p className="text-sm text-white/70">{profile.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Commission Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Earn 40% commission every month
              </h2>
              <h3 className="text-2xl text-white/90">
                on all your nesso.link/users
              </h3>
              <p className="max-w-2xl mx-auto text-white/70">
                You no longer need a paid community to earn money from your
                following. Simply showcase the personal or professional benefits
                of the NESSO link-in-bio tool you use and point them to sign up
                with your link.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6 glass-card-dark p-8">
              <input
                type="range"
                min="10"
                max="10000"
                value={subscribers}
                onChange={(e) => setSubscribers(parseInt(e.target.value))}
                className="w-full accent-white/20"
              />
              <div className="flex justify-between text-xl text-white">
                <span>{subscribers} subscribers</span>
                <span>£{subscribers * 2} per month</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Futureproof yourself and earn
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card-dark p-8">
                <Bell className="w-12 h-12 mb-6 text-white" />
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Live updates on new subscribers
                </h3>
                <p className="text-white/70">
                  See who made their NESSO profile from your unique link
                </p>
              </div>

              <div className="glass-card-dark p-8 md:row-span-2">
                <img
                  src="https://ccmklpdeyroazfftdugw.supabase.co/storage/v1/object/sign/Website%20images/Screenshot%202025-01-22%20at%203.39.35%20PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJXZWJzaXRlIGltYWdlcy9TY3JlZW5zaG90IDIwMjUtMDEtMjIgYXQgMy4zOS4zNSBQTS5wbmciLCJpYXQiOjE3Mzc1NzAwMzYsImV4cCI6MTc2OTEwNjAzNn0.9qVpgoGvkveJIHZ3_AdTwjKnxu-AqcdO9nsJPdN1crU&t=2025-01-22T18%3A20%3A36.112Z"
                  alt="Social media links interface"
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Get more than a link-in-bio tool...
                </h3>
                <p className="text-white/70">
                  NESSO unifies your personal and professional self by
                  connecting your skills, interests and experiences, with what
                  the products and services you have to offer.
                </p>
              </div>

              <div className="glass-card-dark p-8 md:row-span-2">
                <img
                  src="https://ccmklpdeyroazfftdugw.supabase.co/storage/v1/object/sign/Website%20images/Screenshot%202025-01-22%20at%209.31.23%20PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJXZWJzaXRlIGltYWdlcy9TY3JlZW5zaG90IDIwMjUtMDEtMjIgYXQgOS4zMS4yMyBQTS5wbmciLCJpYXQiOjE3Mzc1ODE1MjUsImV4cCI6MTc2OTExNzUyNX0.Ns5xDVIs8-ASHr7h_ZGY3sP2OmA-NNrGudLjmPbFUiY&t=2025-01-22T21%3A32%3A04.721Z"
                  alt="Resume interface"
                  className="w-full h-58 object-cover rounded-lg mb-6"
                />
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Your new Resumé, made for social media
                </h3>
                <p className="text-white/70">
                  Boost your domain authority by showcasing your work
                  experiences, qualifications and past projects in a whole new
                  way.
                </p>
              </div>

              <div className="glass-card-dark p-8">
                <div className="flex flex-col">
                  <PaymentCalendar />
                  <h3 className="text-2xl font-semibold mb-4 mt-6 text-white">
                    Payments Handled For You
                  </h3>
                  <p className="text-white/70">
                    Track your earnings and upcoming payments with our
                    interactive calendar. Set reminders and never miss a
                    payment!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Heading Section */}
        <section className="min-h-screen flex items-center px-6 bg-black/40 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-4xl mx-auto py-32 space-y-12">
            <AnimatedText
              text="You're only 7 minutes away from monetising your followers with nesso.link/"
              className="text-4xl md:text-6xl font-bold text-center"
            />
            <UsernameInput className="max-w-xl mx-auto" />
            <p className="text-center text-white/50 italic text-sm">
              Message us on{' '}
              <a
                href="https://www.instagram.com/raminvision"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                Instagram
              </a>{' '}
              or{' '}
              <a
                href="https://wa.link/d0oyj2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                Whatsapp
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
