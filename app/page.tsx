'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ThemeToggle from '@/app/components/ThemeToggle';

// Dynamically import components with no SSR to avoid hydration issues
const LandingPage = dynamic(() => import('@/app/components/LandingPage'), { ssr: false });
const Dashboard = dynamic(() => import('@/app/components/Dashboard'), { ssr: false });

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if we're coming back from dashboard (for demo purposes)
    const hasSeenLanding = sessionStorage.getItem('hasSeenLanding');
    if (hasSeenLanding) {
      setShowDashboard(true);
    }
  }, []);

  const handleGetStarted = () => {
    sessionStorage.setItem('hasSeenLanding', 'true');
    setShowDashboard(true);
  };

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {!showDashboard && <LandingPage onGetStarted={handleGetStarted} />}
      {showDashboard && <Dashboard />}
      
      {/* Theme Toggle (only visible on landing page) */}
      {!showDashboard && (
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle unhideText={true} injectClass='hidden' endMarginBool={false}/>
        </div>
      )}
    </div>
  );
}
