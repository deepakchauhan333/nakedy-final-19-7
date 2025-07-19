'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { Brain, Search, Plus, BarChart3, Eye, EyeOff, Menu, Settings, Folder } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Brain },
  { name: 'Categories', href: '/categories', icon: Folder },
  { name: 'Submit Tool', href: '/submit', icon: Plus },
  { name: 'Admin', href: '/admindeepak', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { showNSFW, toggleNSFW, isVerified } = useAgeVerification();

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className="w-4 h-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">
              NakedifyAI.com
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <NavItems />
            </div>
            
            {/* NSFW Toggle */}
            <div className="flex items-center gap-3 px-4 py-2 glass-card">
              <span className="text-sm font-medium text-zinc-300">
                {showNSFW ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </span>
              <Switch
                checked={showNSFW}
                onCheckedChange={toggleNSFW}
                className="data-[state=checked]:bg-red-600"
              />
              <span className="text-sm text-zinc-400">
                {showNSFW ? 'NSFW' : 'Safe'}
              </span>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 glass-card rounded-full">
              <Switch
                checked={showNSFW}
                onCheckedChange={toggleNSFW}
                className="data-[state=checked]:bg-red-600 scale-75"
              />
              <span className="text-xs text-zinc-400">
                {showNSFW ? 'NSFW' : 'Safe'}
              </span>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-card border-white/10">
                <div className="flex flex-col gap-2 mt-8">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}