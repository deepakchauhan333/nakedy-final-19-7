'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AgeVerificationModal } from '@/components/age-verification-modal';

interface AgeVerificationContextType {
  isVerified: boolean;
  verify: () => void;
  showNSFW: boolean;
  toggleNSFW: () => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (!context) {
    throw new Error('useAgeVerification must be used within AgeVerificationProvider');
  }
  return context;
}

export function AgeVerificationProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNSFW, setShowNSFW] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage after component is mounted
    const verified = localStorage.getItem('age-verified') === 'true';
    const nsfwPref = localStorage.getItem('show-nsfw') === 'true';
    
    setIsVerified(verified);
    setShowNSFW(nsfwPref && verified);
    
    if (!verified) {
      // Delay modal to improve initial page load performance
      const timer = setTimeout(() => setShowModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const verify = () => {
    setIsVerified(true);
    setShowModal(false);
    localStorage.setItem('age-verified', 'true');
  };

  const toggleNSFW = () => {
    if (!isVerified) {
      setShowModal(true);
      return;
    }
    
    const newShowNSFW = !showNSFW;
    setShowNSFW(newShowNSFW);
    localStorage.setItem('show-nsfw', newShowNSFW.toString());
  };

  // Prevent hydration mismatch by not rendering modal until mounted
  if (!mounted) {
    return (
      <AgeVerificationContext.Provider value={{ isVerified: false, verify, showNSFW: false, toggleNSFW }}>
        {children}
      </AgeVerificationContext.Provider>
    );
  }

  return (
    <AgeVerificationContext.Provider value={{ isVerified, verify, showNSFW, toggleNSFW }}>
      {children}
      {mounted && <AgeVerificationModal isOpen={showModal} onVerify={verify} />}
    </AgeVerificationContext.Provider>
  );
}