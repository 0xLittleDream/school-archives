import { ReactNode, forwardRef } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  function Layout({ children }, ref) {
    return (
      <div ref={ref} className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }
);
