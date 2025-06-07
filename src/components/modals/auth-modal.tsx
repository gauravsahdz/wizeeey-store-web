
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModals } from "@/context/modal-context";
import { useAuth } from "@/context/auth-context";
import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react'; // For loading and error display

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useModals();
  const { login, signup, authError, clearAuthError, isLoading: authContextLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [currentTab, setCurrentTab] = useState("signin");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (authError) {
      setModalError(authError);
    }
  }, [authError]);

  useEffect(() => {
    // Clear errors when modal opens or tab changes
    if (isAuthModalOpen) {
      setModalError(null);
      clearAuthError();
    }
  }, [isAuthModalOpen, currentTab, clearAuthError]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    clearAuthError();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      closeAuthModal();
    } catch (error: any) {
      // error should already be set in authContext, but we can also set modalError
      setModalError(error.message || "Sign in failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    clearAuthError();
    setIsSubmitting(true);
    try {
      await signup({ name, email, password });
      closeAuthModal(); // Close modal on successful signup (and auto-login)
    } catch (error: any) {
      setModalError(error.message || "Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onTabChange = (value: string) => {
    setCurrentTab(value);
    setModalError(null); // Clear error when switching tabs
    clearAuthError();
    // Optionally reset form fields
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => {
      if (!open) {
        closeAuthModal();
        setModalError(null);
        clearAuthError();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to {process.env.NEXT_PUBLIC_APP_NAME || "Thread Canvas"}</DialogTitle>
          <DialogDescription>
            {currentTab === "signin" ? "Sign in to continue." : "Create an account to get started."}
          </DialogDescription>
        </DialogHeader>

        {modalError && (
          <div className="mb-4 p-3 bg-destructive/15 border border-destructive text-destructive text-sm rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{modalError}</span>
          </div>
        )}

        <Tabs defaultValue="signin" value={currentTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || authContextLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="grid gap-4 py-4">
               <div className="grid gap-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input id="signup-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
              </div>
              {/* Add role and avatarUrl fields here if desired by user later */}
              <Button type="submit" className="w-full" disabled={isSubmitting || authContextLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        {/* DialogFooter removed for cleaner look, close is handled by X icon or overlay click */}
      </DialogContent>
    </Dialog>
  );
}
