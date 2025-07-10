'use client';

import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/atoms/button';

export interface MenuButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, toggle }) => {
  return (
    <Button
      onClick={toggle}
      variant="ghost"
      size="icon"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className="md:hidden"
    >
      {isOpen ? <X /> : <Menu />}
    </Button>
  );
};
