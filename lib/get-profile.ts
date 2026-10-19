import { auth0 } from '@/lib/auth0';

export interface AuthProfile {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  role: string;
  initials: string;
}

export async function getProfile(): Promise<AuthProfile | null> {
  const session = await auth0.getSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const name = user.name || user.nickname || user.email || 'Learner';

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    id: user.sub,
    name,
    email: user.email || '',
    picture: user.picture || null,
    role: 'Learner',
    initials,
  };
}
