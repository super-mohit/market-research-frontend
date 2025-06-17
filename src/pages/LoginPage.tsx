import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; 
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // Navigate to dashboard on success
    } catch (error) {
      alert('Login Failed!'); // Replace with toast notifications
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}
        
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
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Login
        </Button>
        <p className="text-center text-sm">
          No account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}; 