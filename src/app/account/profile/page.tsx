
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getMe } from '@/services/api';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, AlertTriangle, UserCircle, Mail, CalendarDays, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ErrorDisplay } from '@/components/layout/error-display';

export default function ProfilePage() {
  const { isAuthenticated, user: authUser, isLoading: authLoading, logout } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/'); // Redirect to home if not authenticated
      return;
    }

    if (isAuthenticated) {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // getMe should ideally return full user details including avatarUrl and lastLogin
          const data = await getMe(); 
          setProfileData({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            avatarUrl: data.avatarUrl || authUser?.avatarUrl, // Prefer API, fallback to context
            lastLogin: data.lastLogin || authUser?.lastLogin, // Prefer API, fallback to context
          });
        } catch (err: any) {
          console.error("Failed to fetch profile:", err);
          setError(err.message || "Could not load your profile. Please try again later.");
          if (err.message && err.message.includes("401")) {
             setError("Your session may have expired. Please log out and log in again.");
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isAuthenticated, authUser, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-12 text-center animate-fadeIn">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center animate-fadeIn">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">Please log in to view your profile.</p>
        <Button onClick={() => router.push('/')}>Go to Homepage</Button>
      </div>
    );
  }
  
  if (error) {
    return (
       <ErrorDisplay 
        title="Profile Load Error"
        message={error}
        retryLink="/account/profile"
        retryText="Try Again"
      />
    );
  }

  if (!profileData) {
     return <ErrorDisplay title="Profile Not Found" message="We couldn't find your profile data." />;
  }

  const userInitials = profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fadeIn">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <UserCircle className="mr-3 h-8 w-8 text-primary" /> My Profile
        </h1>
      </header>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary p-1">
            <AvatarImage src={profileData.avatarUrl || undefined} alt={profileData.name} />
            <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{profileData.name}</CardTitle>
          <CardDescription>{profileData.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Role:</span>
            <span className="ml-2 font-medium">{profileData.role}</span>
          </div>
          {profileData.lastLogin && (
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Login:</span>
              <span className="ml-2 font-medium">
                {format(new Date(profileData.lastLogin), "MMMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          )}
           <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">User ID:</span>
            <span className="ml-2 font-medium text-xs">{profileData.id}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={logout}>Log Out</Button>
            {/* <Button>Edit Profile</Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
