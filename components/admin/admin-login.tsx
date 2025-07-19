'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email: email.trim() });
      
      // Call the verify_admin_credentials function
      const { data, error: rpcError } = await supabase.rpc('verify_admin_credentials', {
        input_email: email.trim(),
        input_password: password
      });

      console.log('RPC Response:', { data, error: rpcError });

      if (rpcError) {
        console.error('Supabase RPC error:', rpcError);
        setError(`Authentication error: ${rpcError.message}`);
        return;
      }

      // Check if the function returned true
      if (data === true) {
        console.log('Authentication successful');
        
        // Store admin session
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_email', email.trim());
        localStorage.setItem('admin_login_time', new Date().toISOString());
        
        toast.success('Welcome to Admin Panel!');
        onLogin();
      } else {
        console.log('Authentication failed - invalid credentials');
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Test database connection
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('ai_tools').select('count').limit(1);
      console.log('Database connection test:', { data, error });
      
      if (error) {
        toast.error('Database connection failed');
      } else {
        toast.success('Database connection successful');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <Card className="glass-card border-white/10 w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
            <p className="text-zinc-400 mt-2">Secure login to admin panel</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-300">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your admin email"
                className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your admin password"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500 pr-10"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Access Admin Panel
                </div>
              )}
            </Button>
          </form>

          {/* Secure Access Info */}
          <div className="mt-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-zinc-400">
                <div className="font-medium mb-1">Secure Access</div>
                <div className="mb-3">This admin panel is protected with secure authentication. Only authorized administrators can access the management features.</div>
                
                {/* Debug button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={testConnection}
                  className="border-zinc-600 text-zinc-400 hover:bg-zinc-700 text-xs"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}