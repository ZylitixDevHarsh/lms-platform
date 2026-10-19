import { AppHeader } from '@/components/layout/app-header';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { SiteFooter } from '@/components/layout/site-footer';

interface SiteShellProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showMobileNav?: boolean;
}

export function SiteShell({
  children,
  showFooter = true,
  showMobileNav = true,
}: SiteShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {showFooter && <SiteFooter />}
      {showMobileNav && <MobileNavigation />}
    </div>
  );
}
