'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mail, 
  Twitter, 
  Github, 
  Heart, 
  Shield, 
  Users, 
  Sparkles,
  ExternalLink,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'About Our Authors', href: '/authors' }
    ],
    resources: [
      { name: 'Add Your Site', href: '/submit' },
      { name: 'Contact Us', href: '/contact' },
    ],
    legal: [
      { name: 'Disclaimer', href: '/disclaimer' },
      { name: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
      { name: 'Blacklisted Sites', href: '/blacklisted' },
      { name: 'Privacy Policy', href: '/privacy' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-400' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@nakedifyai.com', color: 'hover:text-green-400' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-t border-white/10 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-white/10">
          <div className="glass-card p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h3 className="text-2xl font-bold gradient-text">Stay Updated</h3>
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Get notified about the latest AI tools, exclusive reviews, and industry insights. 
                Join our community of AI enthusiasts!
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Users className="w-4 h-4 mr-2" />
                10,000+ Subscribers
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Star className="w-4 h-4 mr-2" />
                Weekly Updates
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Zap className="w-4 h-4 mr-2" />
                Exclusive Content
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl gradient-text">NakedifyAI.com</span>
                <p className="text-xs text-zinc-400">AI Tools Directory</p>
              </div>
            </Link>
            
            <p className="text-zinc-400 leading-relaxed max-w-md">
              The most comprehensive directory of adult AI tools and services. 
              Discover, compare, and find the perfect AI companion for your needs.
            </p>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                <Heart className="w-3 h-3 mr-1" />
                18+ Only
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Safe & Secure
              </Badge>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 glass-card flex items-center justify-center text-zinc-400 ${social.color} transition-all duration-300 hover:scale-110`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-zinc-400 text-sm">
                © {currentYear} NakedifyAI.com. All rights reserved.
              </p>
              <Badge variant="outline" className="text-zinc-500 border-zinc-700 text-xs">
                Made with <Heart className="w-3 h-3 mx-1 text-red-400" /> for AI enthusiasts
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Updated Daily
              </Badge>
              <Link
                href="/submit"
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-300"
              >
                Submit Your Tool →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}