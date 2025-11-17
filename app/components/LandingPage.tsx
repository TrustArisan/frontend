'use client';

import { motion } from 'framer-motion';

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-screen w-full p-4"
      initial={{ opacity: 1 }}
      exit={{ y: '-100vh' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-cyan-500 to-blue-500/80 bg-clip-text text-transparent">
          TrustArisan
        </h1>
        <motion.button
          onClick={onGetStarted}
          className="mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors shadow-lg border border-[hsl(var(--foreground))]/20 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
