import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { PreviewUser } from '@/types';

interface UserAvatarProps {
  user: PreviewUser;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-xl',
};

export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  return (
    <Avatar
      className={cn(
        sizes[size],
        'border border-border bg-primary-soft',
        className
      )}
    >
      <AvatarImage src={undefined} alt={user.name} />
      <AvatarFallback className="bg-primary-soft font-semibold text-primary">
        {user.initials}
      </AvatarFallback>
    </Avatar>
  );
}
