
"use client";

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorDisplayProps {
  title: string;
  message: string;
  retryLink?: string;
  retryText?: string;
}

export function ErrorDisplay({ title, message, retryLink, retryText = "Try Again" }: ErrorDisplayProps) {
  return (
    <div className="container mx-auto py-12 text-center animate-fadeIn">
      <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2 text-destructive">{title}</h2>
      <p className="text-muted-foreground mb-6 whitespace-pre-line">{message}</p>
      {retryLink && (
        <Button asChild>
          <Link href={retryLink}>{retryText}</Link>
        </Button>
      )}
    </div>
  );
}
