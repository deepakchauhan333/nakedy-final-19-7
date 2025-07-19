'use client';

import React, { useState, useEffect } from 'react';
import { AdminLogin } from './admin-login';
import { EnhancedAdminPanel } from './enhanced-admin-panel';
import { Button } from '@/components/ui/button';
import { LogOut, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function FastAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loginTime, setLoginTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authenticated = localStorage.getItem('admin_authenticated') === 'true';
      const email = localStorage.getItem('admin_email') || '';
      const loginTimeStamp = localStorage.getItem('admin_login_time') || '';
      
      if (authenticated && email) {
        // Check if session is still valid (24 hours)
        const loginDate = new Date(loginTimeStamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true);
          setAdminEmail(email);
          setLoginTime(loginDate.toLocaleString());
        } else {
          // Session expired
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    const email = localStorage.getItem('admin_email') || '';
    const loginTimeStamp = localStorage.getItem('admin_login_time') || '';
    setAdminEmail(email);
    setLoginTime(new Date(loginTimeStamp).toLocaleString());
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    setAdminEmail('');
    setLoginTime('');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-zinc-400">NakedifyAI.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{adminEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Since {loginTime}</span>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-700 text-red-400 hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Content */}
      <EnhancedAdminPanel />
    </div>
  );
}