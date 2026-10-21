import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { AppProviders } from '@/components/providers/app-providers';
import { getProfile } from '@/lib/get-profile';
import { loadLearningState } from '@/lib/learning/load-learning-state';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CMHA Learning — Professional Development Platform',
    template: '%s · CMHA Learning',
  },
  description:
    'Discover learning opportunities, build new skills, and track your professional development in one place.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const initial = await loadLearningState(profile);
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans">
        <AppProviders initial={initial}>{children}</AppProviders>
      </body>
    </html>
  );
}
