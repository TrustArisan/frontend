'use client';

import { motion } from 'framer-motion';

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-background"
      initial={{ opacity: 1 }}
      exit={{ y: '-100vh' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Logo Section with Image */}
        <motion.div 
          className="mb-6 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.3, 
            type: "spring", 
            stiffness: 150,
            damping: 12
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/trustarisan-logo.png"
              alt="TrustArisan Logo"
              className="w-48 h-auto md:w-60 drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-[#5584a0] dark:text-[#7ba8c7] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          TrustArisan
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          className="text-lg md:text-xl font-medium text-[#648196] dark:text-[#8ba5b8] mb-10 leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Decentralized, Secure, and Transparent
        </motion.p>

        {/* CTA Button - Clean Design with dark mode support */}
        <motion.button
          onClick={onGetStarted}
          className="px-10 py-3.5 rounded-full bg-[#4f7a97] dark:bg-[#5584a0] text-white font-semibold text-base hover:bg-[#5584a0] dark:hover:bg-[#6694b0] transition-all shadow-lg hover:shadow-xl border-2 border-[#4f7a97] dark:border-[#5584a0] hover:border-[#5584a0] dark:hover:border-[#6694b0]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
  );
}