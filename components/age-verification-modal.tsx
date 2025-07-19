'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Shield } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerify: () => void;
}

export function AgeVerificationModal({ isOpen, onVerify }: AgeVerificationModalProps) {
  const handleVerify = () => {
    onVerify();
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="glass-card border-red-500/20 max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Age Verification Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>You must be 18 years or older to continue</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Shield className="w-4 h-4 text-green-400" />
              <span>This site contains adult content</span>
            </div>
          </div>
          
          <p className="text-sm text-zinc-400 text-center leading-relaxed">
            By clicking "I am 18+", you confirm that you are at least 18 years old and 
            agree to view adult content. This verification is required by law.
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              I am under 18
            </Button>
            <Button
              onClick={handleVerify}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              I am 18+
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}