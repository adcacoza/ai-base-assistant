'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { MenuButton } from './MenuButton';
import { ThemeToggle } from '../atoms/ThemeToggle';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

  const toggleMenu = (): void => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full border-b bg-background">
      <nav
        className="container mx-auto flex items-center justify-between py-4"
        aria-label="Main Navigation"
      >
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image src="/assets/logo.svg" alt="Logo" width={32} height={32} />
          AI assistant
        </Link>

        <MenuButton isOpen={menuOpen} toggle={toggleMenu} />

        <ul
          className={`absolute left-0 top-16 w-full flex flex-col gap-2 border-t bg-background py-4 px-4 md:static md:w-auto md:flex-row md:items-center md:gap-4 md:border-none md:p-0 ${
            menuOpen ? 'block' : 'hidden md:flex'
          }`}
        >
          <SignedOut>
            <li>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </li>
          </SignedOut>
        </ul>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              href="/chat"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/rag"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              RAG
            </Link>
          </SignedIn>
          <ThemeToggle />
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton />
              <SignUpButton />
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};
