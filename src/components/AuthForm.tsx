import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2, AlertCircle, Github, Mail } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup' | 'reset';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { signIn, signUp, resetPassword, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (mode !== 'reset' && !validatePassword(password)) {
      return;
    }
    
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await signUp(email, password);
        // Show success message and redirect to sign in
        navigate('/auth/signin', { 
          state: { message: 'Account created successfully. Please sign in.' }
        });
      } else if (mode === 'reset') {
        await resetPassword(email);
        // Show success message
        navigate('/auth/signin', {
          state: { message: 'Password reset link sent to your email.' }
        });
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error?.code === 'user_already_exists') {
        setValidationError('An account with this email already exists. Please sign in instead.');
      } else if (error?.code === 'weak_password') {
        setValidationError('Please choose a stronger password (minimum 6 characters)');
      }
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {(error || validationError) && (
        <div className="p-3 rounded bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{validationError || error}</span>
        </div>
      )}

      {location.state?.message && (
        <div className="p-3 rounded bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{location.state.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white/70">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="you@example.com"
            required
          />
        </div>

        {mode !== 'reset' && (
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationError) validatePassword(e.target.value);
              }}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {mode === 'signup' && (
              <p className="text-sm text-white/50">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'signin' && 'Sign In'}
          {mode === 'signup' && 'Sign Up'}
          {mode === 'reset' && 'Reset Password'}
        </button>
      </form>

      {mode !== 'reset' && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-white/50">Or continue with</span>
          </div>
        </div>
      )}

      {mode !== 'reset' && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>Google</span>
          </button>
        </div>
      )}

      <div className="text-center space-y-2">
        {mode === 'signin' && (
          <>
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-white hover:text-white/80">
                Sign up
              </a>
            </p>
            <p className="text-sm text-white/70">
              <a href="/auth/reset" className="text-white hover:text-white/80">
                Forgot your password?
              </a>
            </p>
          </>
        )}
        {mode === 'signup' && (
          <p className="text-sm text-white/70">
            Already have an account?{' '}
            <a href="/auth/signin" className="text-white hover:text-white/80">
              Sign in
            </a>
          </p>
        )}
        {mode === 'reset' && (
          <p className="text-sm text-white/70">
            Remember your password?{' '}
            <a href="/auth/signin" className="text-white hover:text-white/80">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}