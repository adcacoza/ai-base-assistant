'use client';

import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background mt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 gap-4 text-sm text-muted-foreground">
        <span>
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
