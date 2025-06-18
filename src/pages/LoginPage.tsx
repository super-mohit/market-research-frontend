import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore'; 
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import supervityLogo from '../assets/supervity-logo.svg';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back! Successfully logged in.');
      navigate('/'); // Navigate to dashboard on success
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Enhanced background with Supervity brand colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Animated gradient orbs using brand colors */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-blue-soft to-cyan-bright rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-cyan-bright to-blue-soft rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Dynamic pattern overlay using lime green */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagon" width="60" height="60" patternUnits="userSpaceOnUse">
                <polygon points="30,5 50,20 50,40 30,55 10,40 10,20" fill="none" stroke="#85c20b" strokeWidth="1"/>
                <circle cx="30" cy="30" r="2" fill="#85c20b"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon)" />
          </svg>
        </div>
        
        {/* Floating elements using brand colors */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-lime-500 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-soft rounded-full animate-bounce animation-delay-3000"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-bright rounded-full animate-ping animation-delay-2000"></div>
      </div>
      
      {/* Main form with enhanced styling */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8 space-y-6 relative overflow-hidden">
          {/* Card background decoration using brand colors */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-500 via-blue-soft to-cyan-bright"></div>
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-lime-400/15 to-blue-soft/15 rounded-full blur-lg"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-cyan-bright/15 to-lime-500/15 rounded-full blur-lg"></div>
          
          <div className="text-center relative">
            <div className="relative inline-block mb-6">
              <img src={supervityLogo} alt="Supervity Logo" className="h-12 w-auto mx-auto relative z-10" />
              <div className="absolute inset-0 bg-lime-500/15 rounded-full blur-md transform scale-150"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-navy-900 via-lime-600 to-blue-soft bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-dark text-sm">Access your market intelligence platform</p>
          </div>
          
          {error && (
            <div className="text-sm text-coral bg-coral/10 p-3 rounded-lg border border-coral/20 backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <Input 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="transition-all duration-300 focus:scale-[1.02] focus:ring-lime-500 focus:border-lime-500"
              />
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
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl" 
            isLoading={isLoading}
          >
            Sign In
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-dark">
              No account?{' '}
              <Link 
                to="/signup" 
                className="text-transparent bg-gradient-to-r from-lime-600 to-blue-soft bg-clip-text hover:from-lime-700 hover:to-blue-600 font-medium transition-all duration-300 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}; 