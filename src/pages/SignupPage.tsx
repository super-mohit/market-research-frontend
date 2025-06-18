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
        setEmailError('Please use a business email address.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate business email
    if (!isBusinessEmail(email)) {
      setEmailError('Please use a business email address.');
      toast.error('Business email required.');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    
    try {
      await signup(email, password, name);
      toast.success('Account created successfully!');
      navigate('/'); // Navigate to dashboard on success
    } catch (error) {
      toast.error('Account creation failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-slate-50">
      {/* Premium background with subtle pattern */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{
            backgroundImage: `radial-gradient(${'#c7c7c7'} 1px, transparent 1px)`,
            backgroundSize: `20px 20px`,
          }}
        />
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-cyan-bright/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-soft/20 to-transparent rounded-full blur-3xl" />
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-lime-500"></div>
          
          <div className="text-center relative">
            <img src={supervityLogo} alt="Supervity Logo" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-navy-900 mb-2">
              Create an Account
            </h1>
            <p className="text-gray-dark text-sm">Business email required to access the platform</p>
          </div>
          
          {error && (
            <div className="text-sm text-coral bg-coral/10 p-3 rounded-lg border border-coral/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input 
              label="Full Name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="focus:ring-lime-500 focus:border-lime-500"
            />
            <Input 
              label="Business Email" 
              type="email" 
              value={email} 
              onChange={handleEmailChange}
              required 
              error={emailError}
              className={`focus:ring-lime-500 focus:border-lime-500 ${emailError ? 'border-coral focus:border-coral focus:ring-coral' : ''}`}
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="focus:ring-lime-500 focus:border-lime-500"
            />
            <Input 
              label="Confirm Password" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className="focus:ring-lime-500 focus:border-lime-500"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full text-white" 
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
                className="font-medium text-lime-600 hover:text-lime-500 transition-colors"
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