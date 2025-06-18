import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore'; 
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import supervityLogo from '../assets/supervity-logo.svg';

// List of common personal email domains to block
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'aol.com', 'icloud.com', 'me.com', 'mac.com', 'protonmail.com',
  'yandex.com', 'mail.com', 'inbox.com', 'gmx.com', 'zoho.com',
  'tutanota.com', 'fastmail.com', 'hushmail.com', 'rocketmail.com',
  'yahoo.co.uk', 'yahoo.ca', 'yahoo.co.in', 'gmail.co.uk', 'hotmail.co.uk',
  'live.co.uk', 'outlook.co.uk', 'rediffmail.com', 'msn.com'
];

const isBusinessEmail = (email: string): boolean => {
  const domain = email.toLowerCase().split('@')[1];
  return !!domain && !PERSONAL_EMAIL_DOMAINS.includes(domain);
};

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    // Clear email error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    
    // Validate email domain if email contains @
    if (emailValue.includes('@') && emailValue.split('@')[1]) {
      if (!isBusinessEmail(emailValue)) {
        setEmailError('Please use a business email address. Personal email providers are not allowed.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate business email
    if (!isBusinessEmail(email)) {
      setEmailError('Please use a business email address. Personal email providers like Gmail, Yahoo, etc. are not allowed.');
      toast.error('Business email required. Personal email addresses are not permitted.');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }
    
    try {
      await signup(email, password, name);
      toast.success('Account created successfully! Welcome to Supervity.');
      navigate('/'); // Navigate to dashboard on success
    } catch (error) {
      toast.error('Account creation failed. Please check your details and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        
        {/* Dynamic pattern overlay */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diamond" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25,5 L45,25 L25,45 L5,25 Z" fill="none" stroke="#10b981" strokeWidth="1"/>
                <circle cx="25" cy="25" r="1.5" fill="#10b981"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diamond)" />
          </svg>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-purple-500 rounded-full animate-ping animation-delay-2000"></div>
      </div>
      
      {/* Main form with enhanced styling */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6 relative overflow-hidden">
          {/* Card background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-lg"></div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-lg"></div>
          
          <div className="text-center relative">
            <div className="relative inline-block mb-6">
              <img src={supervityLogo} alt="Supervity Logo" className="h-12 w-auto mx-auto relative z-10" />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md transform scale-150"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-800 bg-clip-text text-transparent mb-2">
              Join Supervity
            </h1>
            <p className="text-slate-600 text-sm">Start your market intelligence journey</p>
            <p className="text-xs text-slate-500 mt-2">Business email required</p>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <Input 
                label="Full Name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="relative">
              <Input 
                label="Business Email" 
                type="email" 
                value={email} 
                onChange={handleEmailChange}
                required 
                className={`transition-all duration-300 focus:scale-[1.02] ${emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {emailError && (
                <div className="text-xs text-red-600 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </div>
              )}
              <div className="text-xs text-slate-500 mt-1">
                Use your company email (no Gmail, Yahoo, etc.)
              </div>
            </div>
            <div className="relative">
              <Input 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="relative">
              <Input 
                label="Confirm Password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl" 
            isLoading={isLoading}
            disabled={!!emailError}
          >
            Create Account
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text hover:from-emerald-700 hover:to-blue-700 font-medium transition-all duration-300 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}; 