import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BranchIndicator } from './BranchIndicator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NavItem {
  id: string;
  label: string;
  href: string;
  isVisible: boolean;
  order: number;
}

// Default navigation (used when no settings saved)
const DEFAULT_NAV: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', isVisible: true, order: 0 },
  { id: 'memories', label: 'Memories', href: '/memories', isVisible: true, order: 1 },
  { id: 'about', label: 'About', href: '/about', isVisible: true, order: 2 },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  // Fetch navigation settings
  const { data: navSettings } = useQuery({
    queryKey: ['site_settings', 'site_navigation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_value')
        .eq('content_key', 'site_navigation')
        .maybeSingle();
      
      if (error) throw error;
      return data?.content_value ? JSON.parse(data.content_value) : null;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Use saved nav items or defaults
  const navLinks = (navSettings?.navItems || DEFAULT_NAV)
    .filter((item: NavItem) => item.isVisible)
    .sort((a: NavItem, b: NavItem) => a.order - b.order);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo + Branch */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold text-primary">
              Ncs<span className="text-accent">Memories</span>
            </span>
          </Link>
          <div className="hidden sm:block">
            <BranchIndicator />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link: NavItem) => (
            <Link
              key={link.id}
              to={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive(link.href)
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Admin link - only for admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive('/admin')
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              Admin
            </Link>
          )}
          
          {/* Auth buttons */}
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="ml-2">
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container py-4 flex flex-col space-y-1">
            {/* Mobile Branch Indicator */}
            <div className="px-4 py-2 mb-2">
              <BranchIndicator />
            </div>
            {navLinks.map((link: NavItem) => (
              <Link
                key={link.id}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3 text-sm font-medium rounded-md transition-colors',
                  isActive(link.href)
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin link - only for admins */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3 text-sm font-medium rounded-md transition-colors',
                  isActive('/admin')
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                Admin
              </Link>
            )}
            
            {/* Auth buttons */}
            {user ? (
              <Button
                variant="ghost"
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start px-4 py-3 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-primary hover:underline"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
