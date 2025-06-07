
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  // Checkout modal states are removed as it's deprecated
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false); // Removed

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // const openCheckoutModal = () => setIsCheckoutModalOpen(true); // Removed
  // const closeCheckoutModal = () => setIsCheckoutModalOpen(false); // Removed

  return (
    <ModalContext.Provider value={{ 
      isAuthModalOpen, openAuthModal, closeAuthModal,
      // isCheckoutModalOpen, openCheckoutModal, closeCheckoutModal // Removed
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
};
