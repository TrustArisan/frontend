// app/groups/create/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useCreateGroup } from '@/app/hooks/useCreateGroup';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';
import Link from 'next/link';

export default function CreateGroupPage() {
  const { address, isConnected } = useAccount();
  const { createGroup, isPending, error, transactionHash } = useCreateGroup();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    telegramGroupUrl: '',
    coordinatorTelegramUsername: '',
    coordinatorCommissionPercentage: 0,
    contributionAmountInWei: '',
    prizePercentage: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Group title is required';
    }

    if (!formData.telegramGroupUrl.trim()) {
      errors.telegramGroupUrl = 'Telegram group URL is required';
    } else if (!formData.telegramGroupUrl.startsWith('https://t.me/')) {
      errors.telegramGroupUrl = 'Must be a valid Telegram group URL (e.g., https://t.me/groupname)';
    }

    if (!formData.coordinatorTelegramUsername.trim()) {
      errors.coordinatorTelegramUsername = 'Coordinator username is required';
    } else if (!formData.coordinatorTelegramUsername.startsWith('@')) {
      errors.coordinatorTelegramUsername = 'Username must start with @';
    }

    if (formData.coordinatorCommissionPercentage <= 0 || formData.coordinatorCommissionPercentage > 50) {
      errors.coordinatorCommissionPercentage = 'Commission must be between 1-50%';
    }

    if (!formData.contributionAmountInWei || BigInt(formData.contributionAmountInWei) === BigInt(0)) {
      errors.contributionAmountInWei = 'Contribution amount is required';
    }

    if (formData.prizePercentage <= 0 || formData.prizePercentage > 100) {
      errors.prizePercentage = 'Prize percentage must be between 1-100%';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createGroup(formData);
      // Reset form on success
      setFormData({
        title: '',
        telegramGroupUrl: '',
        coordinatorTelegramUsername: '',
        coordinatorCommissionPercentage: 0,
        contributionAmountInWei: '',
        prizePercentage: 0,
      });
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Wallet</h1>
          <p className="text-muted-foreground mb-4">Please connect your wallet to create a group</p>
          <Link href="/">
            <motion.button
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 hover:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </Link>
        </div>
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-[hsl(var(--foreground))]/20 rounded-xl p-8 shadow">
          <Link href="/">
            <motion.button
              className="flex pe-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className='me-3' /> Go Back
            </motion.button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Arisan Group</h1>
          <p className="text-muted-foreground mb-8">Set up a new Arisan group with your custom parameters</p>

          {/* Transaction Hash Display */}
          {transactionHash && (
            <div className="mb-6 p-4 bg-success/10 border border-success/50 rounded-lg">
              <p className="text-success-foreground text-sm">
                <strong>✓ Group created!</strong> Tx: {transactionHash}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
              <p className="text-destructive-foreground text-sm">{error.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Group Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Crypto Enthusiasts Jakarta"
                className={`w-full px-4 py-2 bg-background border border-[hsl(var(--foreground))]/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition ${
                  validationErrors.title ? 'border-destructive' : 'border-input'
                }`}
              />
              {validationErrors.title && (
                <p className="text-destructive text-sm mt-1">{validationErrors.title}</p>
              )}
            </div>

            {/* Telegram Group URL */}
            <div>
              <label htmlFor="telegramGroupUrl" className="block text-sm font-medium text-foreground mb-2">
                Telegram Group URL *
              </label>
              <input
                id="telegramGroupUrl"
                name="telegramGroupUrl"
                type="text"
                value={formData.telegramGroupUrl}
                onChange={handleInputChange}
                placeholder="https://t.me/yourgroupname"
                className={`w-full px-4 py-2 bg-background border border-[hsl(var(--foreground))]/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition ${
                  validationErrors.telegramGroupUrl ? 'border-destructive' : 'border-input'
                }`}
              />
              {validationErrors.telegramGroupUrl && (
                <p className="text-destructive text-sm mt-1">{validationErrors.telegramGroupUrl}</p>
              )}
            </div>

            {/* Coordinator Telegram Username */}
            <div>
              <label htmlFor="coordinatorTelegramUsername" className="block text-sm font-medium text-foreground mb-2">
                Your Telegram Username *
              </label>
              <input
                id="coordinatorTelegramUsername"
                name="coordinatorTelegramUsername"
                type="text"
                value={formData.coordinatorTelegramUsername}
                onChange={handleInputChange}
                placeholder="@yourname"
                className={`w-full px-4 py-2 bg-background border border-[hsl(var(--foreground))]/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition ${
                  validationErrors.coordinatorTelegramUsername ? 'border-destructive' : 'border-input'
                }`}
              />
              {validationErrors.coordinatorTelegramUsername && (
                <p className="text-destructive text-sm mt-1">{validationErrors.coordinatorTelegramUsername}</p>
              )}
            </div>

            {/* Two Column Layout for Percentage Inputs */}
            <div className="grid grid-cols-2 gap-4">
              {/* Coordinator Commission Percentage */}
              <div>
                <label htmlFor="coordinatorCommissionPercentage" className="block text-sm font-medium text-foreground mb-2">
                  Commission % (5-50) *
                </label>
                <div className="flex items-center">
                  <input
                    id="coordinatorCommissionPercentage"
                    name="coordinatorCommissionPercentage"
                    type="number"
                    min="5"
                    max="50"
                    value={formData.coordinatorCommissionPercentage}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-background border border-[hsl(var(--foreground))]/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition ${
                      validationErrors.coordinatorCommissionPercentage ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  <span className="ml-2 text-muted-foreground">%</span>
                </div>
                {validationErrors.coordinatorCommissionPercentage && (
                  <p className="text-destructive text-sm mt-1">{validationErrors.coordinatorCommissionPercentage}</p>
                )}
              </div>

              {/* Prize Percentage */}
              <div>
                <label htmlFor="prizePercentage" className="block text-sm font-medium text-foreground mb-2">
                  Prize % *
                </label>
                <div className="flex items-center">
                  <input
                    id="prizePercentage"
                    name="prizePercentage"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.prizePercentage}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-background border border-[hsl(var(--foreground))]/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition ${
                      validationErrors.prizePercentage ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  <span className="ml-2 text-muted-foreground">%</span>
                </div>
                {validationErrors.prizePercentage && (
                  <p className="text-destructive text-sm mt-1">{validationErrors.prizePercentage}</p>
                )}
              </div>
            </div>

            {/* Contribution Amount */}
            <div>
              <label htmlFor="contributionAmountInWei" className="block text-sm font-medium text-foreground mb-2">
                Contribution Amount (in Wei) *
              </label>
              <div className="flex items-center">
                <input
                  id="contributionAmountInWei"
                  name="contributionAmountInWei"
                  type="text"
                  value={formData.contributionAmountInWei}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000000000000000000 (1 ETH)"
                  className={`w-full px-4 py-2 bg-background border border-[hsl(var(--foreground))]/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition ${
                    validationErrors.contributionAmountInWei ? 'border-destructive' : 'border-input'
                  }`}
                />
                <span className="ml-2 text-slate-400 text-sm whitespace-nowrap">Wei</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">1 ETH = 1000000000000000000 Wei</p>
              {validationErrors.contributionAmountInWei && (
                <p className="text-destructive text-sm mt-1">{validationErrors.contributionAmountInWei}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                  isPending
                    ? 'bg-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-linear-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900 active:scale-95'
                }`}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" />
                      <path d="M4 12a8 8 0 018-8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Creating Group...
                  </span>
                ) : (
                  'Create Group'
                )}
              </button>
            </div>

            <p className="text-slate-500 text-xs text-center">
              All fields marked with * are required
            </p>
          </form>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
