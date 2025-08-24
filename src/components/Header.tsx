import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold font-headline">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="text-lg">SolutionCart</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-2 justify-end">
          <Link href="/contact" passHref>
            <Button variant="ghost">Contact Us</Button>
          </Link>
          <Link href="/admin/dashboard" passHref>
            <Button>Admin Panel</Button>
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
