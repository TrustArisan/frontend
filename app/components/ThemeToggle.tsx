'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ 
  className = '',
  unhideText = false,
  injectClass = '',
  endMarginBool = true
}: { 
  className?: string,
  unhideText?: boolean,
  injectClass?: string,
  endMarginBool?: boolean
}) {
  const [mounted, setMounted] = useState(false);
  const { theme = 'light', setTheme } = useTheme();

  // Ensure we're on the client before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.button
          onClick={toggleTheme}
          className="flex px-3 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/20 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? (
                <div className='flex grow justify-center'>
                  <Sun className={"px-0.5 h-6 w-6 text-white-300 " + (endMarginBool ? 'sm:me-2' : '')} /> <span className={(unhideText ? '' : 'sm:inline hidden ') + injectClass}>Light Mode</span>
                </div>
            ) : (
                <div className='flex grow justify-center'>
                  <Moon className={"px-0.5 h-6 w-6 text-muted-foreground " + (endMarginBool ? 'sm:me-2' : '')} /> <span className={(unhideText ? '' : 'sm:inline hidden ') + injectClass}>Dark Mode</span>
                </div>
            )}
    </motion.button>
  );
}