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
      {/* Enhanced background with Supervity brand colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        {/* Animated gradient orbs using brand colors */}
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-cyan-bright to-blue-soft rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-gradient-to-r from-blue-soft to-cyan-bright rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Dynamic pattern overlay using cyan accent */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diamond" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25,5 L45,25 L25,45 L5,25 Z" fill="none" stroke="#31b8e1" strokeWidth="1"/>
                <circle cx="25" cy="25" r="1.5" fill="#31b8e1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diamond)" />
          </svg>
        </div>
        
        {/* Floating elements using brand colors */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-cyan-bright rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-lime-500 rounded-full animate-bounce animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-blue-soft rounded-full animate-ping animation-delay-2000"></div>
      </div>
      
      {/* Main form with enhanced styling */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8 space-y-6 relative overflow-hidden">
          {/* Card background decoration using brand colors */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-bright via-lime-500 to-blue-soft"></div>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-cyan-bright/15 to-lime-400/15 rounded-full blur-lg"></div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-lime-400/15 to-blue-soft/15 rounded-full blur-lg"></div>
          
          <div className="text-center relative">
            <div className="relative inline-block mb-6">
              <img src={supervityLogo} alt="Supervity Logo" className="h-12 w-auto mx-auto relative z-10" />
              <div className="absolute inset-0 bg-cyan-bright/15 rounded-full blur-md transform scale-150"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-navy-900 via-cyan-bright to-lime-600 bg-clip-text text-transparent mb-2">
              Market Intelligence Agent
            </h1>
            <p className="text-gray-dark text-sm">Start your market intelligence journey with Supervity</p>
            <p className="text-xs text-muted-foreground mt-2">Business email required</p>
          </div>
          
          {error && (
            <div className="text-sm text-coral bg-coral/10 p-3 rounded-lg border border-coral/20 backdrop-blur-sm">
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
                className="transition-all duration-300 focus:scale-[1.02] focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div className="relative">
              <Input 
                label="Business Email" 
                type="email" 
                value={email} 
                onChange={handleEmailChange}
                required 
                className={`transition-all duration-300 focus:scale-[1.02] focus:ring-lime-500 focus:border-lime-500 ${emailError ? 'border-coral focus:border-coral focus:ring-coral' : ''}`}
              />
              {emailError && (
                <div className="text-xs text-coral mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
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
                className="transition-all duration-300 focus:scale-[1.02] focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div className="relative">
              <Input 
                label="Confirm Password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="transition-all duration-300 focus:scale-[1.02] focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-bright to-lime-500 hover:from-cyan-600 hover:to-lime-600 text-white transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl" 
            isLoading={isLoading}
            disabled={!!emailError}
          >
            Create Account
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-dark">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-transparent bg-gradient-to-r from-cyan-bright to-lime-600 bg-clip-text hover:from-cyan-600 hover:to-lime-700 font-medium transition-all duration-300 hover:underline"
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