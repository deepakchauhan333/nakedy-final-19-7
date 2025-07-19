'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Send,
  CheckCircle,
  Users,
  Headphones,
  Building,
  Globe
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  type: z.enum(['general', 'support', 'partnership', 'feedback'])
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    }
  });

  const { handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      form.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help with any questions or issues',
      icon: Mail,
      contact: 'dc556316@gmail.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Business Inquiries',
      description: 'Partnership and collaboration opportunities',
      icon: Building,
      contact: 'dc556316@gmail.com',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Live Chat',
      description: 'Real-time support during business hours',
      icon: MessageCircle,
      contact: 'Available 9 AM - 6 PM EST',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I submit my AI tool?',
      answer: 'Use our submission form on the "Add Your Site" page. We review all submissions within 24-48 hours.'
    },
    {
      question: 'Is the directory free to use?',
      answer: 'Yes! Our directory is completely free for users. We may offer premium features for tool developers in the future.'
    },
    {
      question: 'How do you verify AI tools?',
      answer: 'Our team manually reviews each tool for functionality, safety, and quality before listing.'
    },
    {
      question: 'Can I request a tool review?',
      answer: 'Absolutely! Contact us with the tool details and we\'ll prioritize it for review.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <MessageCircle className="w-4 h-4 mr-2" />
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
            Contact Our
            <br />
            <span className="text-red-400">Expert Team</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or want to partner with us? 
            We're here to help and would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <Card key={index} className="glass-card border-white/10 group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-2">{method.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">{method.description}</p>
                <p className="text-sm text-zinc-300 font-medium">{method.contact}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Send className="w-5 h-5" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Your full name"
                    className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="your@email.com"
                    className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Inquiry Type</Label>
                <select
                  {...form.register('type')}
                  className="w-full px-3 py-2 glass-card border-white/10 bg-white/5 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="general">General Question</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Feedback & Suggestions</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Subject *</Label>
                <Input
                  id="subject"
                  {...form.register('subject')}
                  placeholder="Brief description of your inquiry"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                {errors.subject && (
                  <p className="text-sm text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Message *</Label>
                <Textarea
                  id="message"
                  {...form.register('message')}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500 resize-none"
                />
                {errors.message && (
                  <p className="text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ & Info */}
        <div className="space-y-8">
          {/* Response Time */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-green-400" />
                Response Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">General Inquiries</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  24 hours
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Technical Support</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  12 hours
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Partnership Inquiries</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  48 hours
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Emergency Issues</span>
                <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                  2 hours
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Headphones className="w-5 h-5 text-blue-400" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-white text-sm">{faq.question}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
                  {index < faqs.length - 1 && <div className="border-b border-white/10 pt-2" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Office Info */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-red-400" />
                Our Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-zinc-300 font-medium">NSFW AI Tools Directory</p>
                <p className="text-sm text-zinc-400">
                  Remote-first company<br />
                  Serving users worldwide<br />
                  Available 24/7 online
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-300">Global Coverage</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}