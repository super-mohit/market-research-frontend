import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; 
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
      alert('Passwords do not match!');
      return;
    }
    
    try {
      await signup(email, password, name);
      navigate('/'); // Navigate to dashboard on success
    } catch (error) {
      alert('Signup Failed!'); // Replace with toast notifications
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}
        
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
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign Up
        </Button>
        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}; 