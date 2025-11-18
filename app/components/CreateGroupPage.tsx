// app/groups/create/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGroup } from '@/app/hooks/useCreateGroup';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { 
  ChevronLeft,
  Shuffle
} from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';
import Link from 'next/link';

export default function CreateGroupPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createGroup, isPending, error } = useCreateGroup();

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
  const [transactionHash, setTransactionHash] = useState('');
  const [isWei, setIsWei] = useState(true);

  // Toggle between Wei and ETH
  const toggleWeiEth = () => {
    if (formData.contributionAmountInWei) {
      try {
        const currentValue = formData.contributionAmountInWei;
        const newValue = isWei 
          ? (parseFloat(currentValue) / 1e18).toString()
          : (parseFloat(currentValue) * 1e18).toString();
        
        setFormData(prev => ({
          ...prev,
          contributionAmountInWei: newValue
        }));
      } catch (error) {
        console.error('Error toggling between Wei and ETH:', error);
      }
    }
    setIsWei(!isWei);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'contributionAmountInWei') {
      // For contribution amount, we'll store the raw value and handle display separately
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }

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

    if (!formData.contributionAmountInWei) {
      errors.contributionAmountInWei = 'Contribution amount is required';
    } else {
      try {
        const amount = isWei 
          ? formData.contributionAmountInWei 
          : (parseFloat(formData.contributionAmountInWei) * 1e18).toString();
        
        if (BigInt(amount) <= BigInt(0)) {
          errors.contributionAmountInWei = 'Contribution amount must be greater than 0';
        }
      } catch (error) {
        errors.contributionAmountInWei = 'Invalid contribution amount';
      }
    }

    if (formData.prizePercentage <= 0 || formData.prizePercentage > 100) {
      errors.prizePercentage = 'Prize percentage must be between 1-100%';
    }

    if (formData.coordinatorCommissionPercentage + formData.prizePercentage > 100) {
      errors.percentageTooBig = 'Commission + Prize percentage is too big!';
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

    // Convert to Wei if in ETH mode
    let submissionData = { ...formData };
    if (!isWei && submissionData.contributionAmountInWei) {
      submissionData = {
        ...submissionData,
        contributionAmountInWei: (parseFloat(submissionData.contributionAmountInWei) * 1e18).toString()
      };
    }

    try {
      const result = await createGroup(submissionData);
      setTransactionHash(result.txHash);

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
            <div className="grid grid-cols-2 gap-x-4">
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

              {/* Warning Label */}
              <p className='text-slate-400 text-xs mt-1'>Commission + Prize must equal to 100% or less</p>
            </div>

            {/* Contribution Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="contributionAmountInWei" className="block text-sm font-medium text-foreground">
                  Contribution Amount ({isWei ? 'Wei' : 'ETH'}) *
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="contributionAmountInWei"
                  name="contributionAmountInWei"
                  type="number"
                  step={isWei ? '1' : '0.000000000000000001'}
                  value={formData.contributionAmountInWei}
                  onChange={handleInputChange}
                  placeholder={isWei 
                    ? `e.g., 1000000000000000000 ${isWei ? 'Wei' : 'ETH'}` 
                    : `e.g., 1.0 ${isWei ? 'Wei' : 'ETH'}`}
                  className={`w-full px-4 py-2 bg-background border border-[hsl(var(--foreground))]/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition ${
                    validationErrors.contributionAmountInWei ? 'border-destructive' : 'border-input'
                  }`}
                />
                <motion.button
                  type='button'
                  onClick={toggleWeiEth}
                  className="flex ms-3 px-3 py-2 rounded-md bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle className='px-0.5'/>
                </motion.button>
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                1 ETH = 1,000,000,000,000,000,000 Wei
              </p>
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
