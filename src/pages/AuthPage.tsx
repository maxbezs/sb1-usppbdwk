import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { ArrowLeft } from 'lucide-react';

export function AuthPage() {
  const { mode = 'signin' } = useParams<{ mode: 'signin' | 'signup' | 'reset' }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative film-grain bg-gray-900">
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
          `
        }}
      />
      
      {/* Frosted Glass Overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backdropFilter: 'blur(100px) saturate(150%)',
          background: 'rgba(0, 0, 0, 0.75)',
        }}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white">nesso.link</a>
          <h1 className="mt-6 text-3xl font-bold text-white">
            {mode === 'signin' && 'Welcome back'}
            {mode === 'signup' && 'Future-proof yourself'}
            {mode === 'reset' && 'Reset your password'}
          </h1>
          <p className="mt-2 text-white/70">
            {mode === 'signin' && 'Update your profile and check out your earnings'}
            {mode === 'signup' && 'with the most beautiful way to present yourself online'}
            {mode === 'reset' && "We'll send you a link to reset your password"}
          </p>
        </div>

        <div className="glass-card-dark p-8">
          <AuthForm mode={mode} />
        </div>
      </div>
    </div>
  );
}