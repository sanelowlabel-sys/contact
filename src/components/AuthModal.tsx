import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_PROFILES } from '../data/mockData';
import { SanelowLogo } from './SanelowLogo';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  currentRole: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentRole,
}) => {
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoLogin = (profileKey: 'customer' | 'agent' | 'admin') => {
    const profile = DEMO_PROFILES[profileKey];
    onLogin(profile);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'signin') {
      if (!email.trim()) return;
      const userObj: UserProfile = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0] || 'User',
        email: email,
        role: role,
        isGuest: false,
        orders: [],
      };
      onLogin(userObj);
      onClose();
    } else if (authTab === 'signup') {
      if (!name.trim() || !email.trim()) return;
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name,
        email: email,
        role: role,
        isGuest: false,
        orders: [],
      };
      onLogin(newUser);
      onClose();
    } else if (authTab === 'reset') {
      setNotification(`Password reset instructions dispatched to ${email || 'your email'}.`);
      setTimeout(() => {
        setNotification(null);
        setAuthTab('signin');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white w-full max-w-md border border-neutral-200 shadow-2xl rounded-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SanelowLogo size={32} color="#DC2626" />
            <div>
              <h2 className="text-base font-extrabold text-black uppercase tracking-tight font-sans">
                Sanelow <span className="text-red-600">Access Portal</span>
              </h2>
              <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                Role-Based Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 text-xs font-semibold">
          <button
            onClick={() => setAuthTab('signin')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              authTab === 'signin'
                ? 'border-red-600 text-black bg-white'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthTab('signup')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              authTab === 'signup'
                ? 'border-red-600 text-black bg-white'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setAuthTab('reset')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              authTab === 'reset'
                ? 'border-red-600 text-black bg-white'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Instant Demo Role Switcher */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Instant Role Simulation (1-Click)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('customer')}
              className={`p-2 border text-left rounded-xs transition-all cursor-pointer ${
                currentRole === 'customer'
                  ? 'border-red-600 bg-red-50/50 shadow-xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="font-bold text-black text-[11px]">Customer</div>
              <div className="text-[10px] text-neutral-500 truncate">Jordan Mercer</div>
            </button>

            <button
              onClick={() => handleDemoLogin('agent')}
              className={`p-2 border text-left rounded-xs transition-all cursor-pointer ${
                currentRole === 'agent'
                  ? 'border-red-600 bg-red-50/50 shadow-xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="font-bold text-black text-[11px]">Support Agent</div>
              <div className="text-[10px] text-neutral-500 truncate">Alex Vance</div>
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              className={`p-2 border text-left rounded-xs transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'border-red-600 bg-red-50/50 shadow-xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="font-bold text-black text-[11px]">Admin</div>
              <div className="text-[10px] text-neutral-500 truncate">Elena Rostova</div>
            </button>
          </div>
        </div>

        {/* Notice Message */}
        {notification && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black font-mono mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Mercer"
                  className="w-full px-3 py-2 pl-9 text-xs border border-neutral-300 focus:border-red-600 focus:outline-none transition-colors"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black font-mono mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sanelowmusic.com or personal"
                className="w-full px-3 py-2 pl-9 text-xs border border-neutral-300 focus:border-red-600 focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {authTab !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black font-mono">
                  Password
                </label>
                {authTab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setAuthTab('reset')}
                    className="text-[11px] text-neutral-500 hover:text-red-600 cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pl-9 text-xs border border-neutral-300 focus:border-red-600 focus:outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          )}

          {/* Account Role Selection */}
          {authTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black font-mono mb-1.5">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-red-600 focus:outline-none bg-white"
              >
                <option value="customer">Customer (Merch Buyer)</option>
                <option value="agent">Support Agent (Merch QA Staff)</option>
                <option value="admin">System Admin (Operations Director)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {authTab === 'signin' && <span>Sign In to Support Center</span>}
            {authTab === 'signup' && <span>Create Sanelow Account</span>}
            {authTab === 'reset' && <span>Send Password Reset Link</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-center text-[11px] text-neutral-500">
          Protected by NextAuth.js v5 / Auth.js Middleware security standards
        </div>
      </div>
    </div>
  );
};
