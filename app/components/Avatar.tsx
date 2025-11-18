'use client';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

export function Avatar({ 
  name, 
  size = 'md', 
  className = '',
}: AvatarProps) {
  // Extract initials (1-2 letters)
  const getInitials = (fullName: string): string => {
    const nameParts = fullName.trim().split(/\s+/); // Split by spaces
    
    if (nameParts.length === 0) return '?';
    if (nameParts.length === 1) {
      // Single word: take first letter only
      return nameParts[0][0].toUpperCase();
    }
    
    // Multiple words: take first letter of first and second word
    const first = nameParts[0][0];
    const second = nameParts[1][0];
    return (first + second).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    xxl: 'w-20 h-20 text-xl',
  };

  const initials = getInitials(name);

  return (
    <div
      className={`
        flex items-center justify-center rounded-full font-bold border border-[hsl(var(--foreground))]/20
        ${sizeClasses[size]}
        ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  );
}
