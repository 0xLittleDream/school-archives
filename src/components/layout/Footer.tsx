import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-primary text-primary-foreground">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-bold">
              Ncs<span className="text-accent">Memories</span>
            </p>
            <p className="text-sm text-primary-foreground/70 mt-1">
              Preserving moments. Celebrating journeys.
            </p>
          </div>

          {/* Creator Credit */}
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
            <span>Website created solely by</span>
            <a
              href="https://www.instagram.com/dr3am8r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-primary-foreground hover:text-accent transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @dr3am8r
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} NcsMemories. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
