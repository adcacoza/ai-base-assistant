'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/button';
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
          MyApp
        </Link>
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        <MenuButton isOpen={menuOpen} toggle={toggleMenu} />

        <ul
          className={`absolute left-0 top-16 w-full flex flex-col gap-2 border-t bg-background py-4 px-4 md:static md:w-auto md:flex-row md:items-center md:gap-4 md:border-none md:p-0 ${
            menuOpen ? 'block' : 'hidden md:flex'
          }`}
        >
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
          <li className="md:hidden">
            <Button variant="secondary" size="sm" className="w-full">
              Log in
            </Button>
          </li>
        </ul>

        <Button variant="secondary" size="sm" className="hidden md:inline-flex">
          Log in
        </Button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="secondary"
            size="sm"
            className="hidden md:inline-flex"
          >
            Log in
          </Button>
        </div>
      </nav>
    </header>
  );
};
