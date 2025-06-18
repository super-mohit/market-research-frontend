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
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-lime-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-blue-soft/20 to-transparent rounded-full blur-3xl" />
      </div>
      
      {/* Main form with enhanced styling */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-lime-500"></div>
          
          <div className="text-center relative">
            <img src={supervityLogo} alt="Supervity Logo" className="h-10 w-auto mx-auto mb-6 relative z-10" />
            <h1 className="text-3xl font-bold text-navy-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-dark text-sm">Access your market intelligence platform</p>
          </div>
          
          {error && (
            <div className="text-sm text-coral bg-coral/10 p-3 rounded-lg border border-coral/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="focus:ring-lime-500 focus:border-lime-500"
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="focus:ring-lime-500 focus:border-lime-500"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full text-white" 
            isLoading={isLoading}
          >
            Sign In
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-dark">
              No account?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-lime-600 hover:text-lime-500 transition-colors"
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