'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function ThemeAwareRainbowKitProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle theme changes
  useEffect(() => {
    // Check if dark mode is active by checking document class
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Initial check
    checkDarkMode();

    // Set up mutation observer to watch for theme class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    // Start observing the html element for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    setMounted(true);

    // Clean up observer on unmount
    return () => observer.disconnect();
  }, [theme]); // Re-run when theme changes

  return (
    <RainbowKitProvider
      theme={isDark ? darkTheme() : lightTheme()}
      modalSize="compact"
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const config = getDefaultConfig({
    appName: 'TrustArisan',
    projectId: '5a7739743d8bb6aa03dd0a0143df41eb',
    chains: [sepolia], // other options can be mainnet, polygon, optimism, arbitrum, base
    syncConnectedChain: true,
    ssr: false,
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeAwareRainbowKitProvider>
          {children}
        </ThemeAwareRainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
