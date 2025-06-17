import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore'; 
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import supervityLogo from '../assets/supervity-logo.svg';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-signup" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-signup)" />
          </svg>
        </div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm space-y-6 relative z-10 backdrop-blur-sm bg-white/80 border border-white/20">
        <div className="text-center">
          <img src={supervityLogo} alt="Supervity Logo" className="h-12 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Join Supervity</h1>
          <p className="text-slate-600 text-sm">Start your market intelligence journey</p>
        </div>
        
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
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
          />
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
        
        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}; 