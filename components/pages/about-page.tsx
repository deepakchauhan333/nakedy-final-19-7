'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Users, 
  Shield, 
  Star, 
  Heart, 
  Zap, 
  Target, 
  Award,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export function AboutPage() {
  const stats = [
    { label: 'AI Tools Listed', value: '500+', icon: Brain, color: 'text-blue-400' },
    { label: 'Monthly Visitors', value: '100K+', icon: Users, color: 'text-green-400' },
    { label: 'Categories', value: '10+', icon: Target, color: 'text-purple-400' },
    { label: 'User Reviews', value: '5K+', icon: Star, color: 'text-yellow-400' }
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We provide honest, unbiased reviews and clear information about every AI tool in our directory.',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Quality',
      description: 'Every tool is carefully vetted and reviewed by our expert team to ensure the highest standards.',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Innovation',
      description: 'We stay at the forefront of AI technology, constantly discovering and featuring cutting-edge tools.',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Community',
      description: 'We foster a supportive community where users can share experiences and discover new possibilities.',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'Started with 50 carefully curated AI tools and a vision to democratize AI discovery.'
    },
    {
      year: '2024',
      title: 'Community Growth',
      description: 'Reached 10,000 monthly users and expanded to over 200 AI tools across multiple categories.'
    },
    {
      year: '2024',
      title: 'Feature Expansion',
      description: 'Launched advanced filtering, user reviews, and personalized recommendations.'
    },
    {
      year: '2025',
      title: 'Global Recognition',
      description: 'Became the leading directory for AI tools with 100K+ monthly visitors worldwide.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            About Our Mission
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
            Democratizing AI
            <br />
            <span className="text-red-400">Discovery</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            We're building the world's most comprehensive directory of AI tools, 
            making cutting-edge technology accessible to everyone.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card border-white/10 text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Mission Section */}
      <section className="glass-card p-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p className="text-lg text-zinc-300 max-w-4xl mx-auto leading-relaxed">
            In an era where artificial intelligence is transforming every aspect of our lives, 
            we believe that everyone should have access to the best AI tools available. 
            Our mission is to bridge the gap between cutting-edge AI technology and everyday users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              What We Do
            </h3>
            <ul className="space-y-3">
              {[
                'Curate and review the latest AI tools',
                'Provide detailed comparisons and insights',
                'Maintain an up-to-date directory of 500+ tools',
                'Foster a community of AI enthusiasts',
                'Offer expert recommendations and guides'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              Our Impact
            </h3>
            <ul className="space-y-3">
              {[
                'Helped 100K+ users discover AI tools',
                'Saved countless hours of research time',
                'Connected users with perfect AI solutions',
                'Supported AI startups and developers',
                'Built the largest AI tools community'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-zinc-300">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Values</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            These core principles guide everything we do and shape our commitment to the AI community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="glass-card border-white/10 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Journey</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            From a simple idea to the world's leading AI tools directory.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-red-500 transform md:-translate-x-1/2" />
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-br from-blue-500 to-red-500 rounded-full transform md:-translate-x-1/2 -translate-y-1/2" />
                
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <Card className="glass-card border-white/10 ml-12 md:ml-0">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
                      </div>
                      <p className="text-zinc-300">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}