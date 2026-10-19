import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { auth0 } from '@/lib/auth0';

const baseLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/dashboard', label: 'My Learning' },
];


export async function SiteFooter() {

  const session = await auth0.getSession();
  const authLink = session
    ? { href: '/auth/logout', label: 'Sign Out' }
    : { href: '/auth/login', label: 'Sign In' };

  const footerLinks = [...baseLinks, authLink];

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-semibold text-foreground">
              CMHA Learning
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CMHA Learning. A professional
            development platform. This is a product preview.
          </p>
        </div>
      </div>
    </footer>
  );
}
