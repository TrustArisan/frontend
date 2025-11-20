'use client';
import React, { useState, FormEvent } from 'react';
import { useCreateGroup } from '@/app/hooks/useCreateGroup';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { 
  ChevronLeft,
  Shuffle,
  Info
} from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateGroupPage() {
  const { address, isConnected } = useAccount();
  const { createGroup, isPending, error } = useCreateGroup();
  const router = useRouter();

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      setShowSuccessPopup(true);

      console.log('✅ Group created:', result.txHash);

      setFormData({
        title: '',
        telegramGroupUrl: '',
        coordinatorTelegramUsername: '',
        coordinatorCommissionPercentage: 0,
        contributionAmountInWei: '',
        prizePercentage: 0,
      });
    } catch (err: any) {
      console.error('Form submission error:', err);
      setErrorMessage(err?.message || 'Failed to create group. Please try again.');
      setShowErrorPopup(true);
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
              className="px-8 py-3 rounded-full bg-[#5584a0] text-white font-medium text-md hover:bg-[#4f7a97] transition-colors border border-[#4f7a97]/20 hover:shadow-md"
              whileHover={{ x: -4 }}
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
      {/* Success Popup */}
      {showSuccessPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-[#eeb446]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#eeb446] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#4f7a97] mb-2">Group Created Successfully!</h2>
              <p className="text-[#5c6c74] mb-4">Your Arisan group has been created on the blockchain</p>
              
              {transactionHash && (
                <div className="bg-[#eeb446]/10 border border-[#eeb446]/30 rounded-lg p-3 mb-6">
                  <p className="text-xs text-[#5c6c74] mb-1 font-medium">Transaction Hash:</p>
                  <p className="text-xs text-[#4f7a97] font-mono break-all">{transactionHash}</p>
                </div>
              )}
              
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full py-3 px-6 bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold rounded-lg transition-colors shadow-md"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-[#648196]/30 rounded-xl p-8 shadow-lg">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5584a0] text-white font-bold text-lg hover:bg-[#4f7a97] transition-colors shadow-sm mb-6"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h1 className="text-3xl font-bold mb-2 text-[#4f7a97]">Create Arisan Group</h1>
          <p className="text-[#5c6c74] mb-8">Set up a new Arisan group with your custom parameters</p>

          {/* Info Box about Capacity */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-300">
              <p className="font-semibold mb-1">Initial Capacity: 10 Members</p>
              <p>Your group will start with a maximum capacity of 10 members. You can upgrade the capacity later from the group detail page if needed.</p>
            </div>
          </div>

          {/* Transaction Hash Display */}
          {transactionHash && !showSuccessPopup && (
            <div className="mb-6 p-4 bg-[#eeb446]/10 border border-[#eeb446] rounded-lg">
              <p className="text-[#5c6c74] text-sm">
                <strong className="text-[#eeb446]">✓ Group created!</strong> Tx: {transactionHash}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && !showErrorPopup && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm">{error.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#4f7a97] mb-2">
                Group Title <span className='text-red-500'>*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Insert your group title"
                className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder-[#5c6c74]/60 focus:outline-none focus:ring-2 focus:ring-[#5584a0] transition ${
                  validationErrors.title ? 'border-red-400' : 'border-[#648196]/30'
                }`}
              />
              {validationErrors.title && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
              )}
            </div>

            {/* Telegram Group URL */}
            <div>
              <label htmlFor="telegramGroupUrl" className="block text-sm font-medium text-[#4f7a97] mb-2">
                Telegram Group URL <span className='text-red-500'>*</span>
              </label>
              <input
                id="telegramGroupUrl"
                name="telegramGroupUrl"
                type="text"
                value={formData.telegramGroupUrl}
                onChange={handleInputChange}
                placeholder="Insert your Telegram group link"
                className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder-[#5c6c74]/60 focus:outline-none focus:ring-2 focus:ring-[#5584a0] transition ${
                  validationErrors.telegramGroupUrl ? 'border-red-400' : 'border-[#648196]/30'
                }`}
              />
              <p className="text-[#5c6c74]/70 text-xs mt-1">
                Example format: https://t.me/yourgroupname
              </p>
              {validationErrors.telegramGroupUrl && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.telegramGroupUrl}</p>
              )}
            </div>

            {/* Coordinator Telegram Username */}
            <div>
              <label htmlFor="coordinatorTelegramUsername" className="block text-sm font-medium text-[#4f7a97] mb-2">
                Your Telegram Username <span className='text-red-500'>*</span>
              </label>
              <input
                id="coordinatorTelegramUsername"
                name="coordinatorTelegramUsername"
                type="text"
                value={formData.coordinatorTelegramUsername}
                onChange={handleInputChange}
                placeholder="Insert your Telegram username"
                className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder-[#5c6c74]/60 focus:outline-none focus:ring-2 focus:ring-[#5584a0] transition ${
                  validationErrors.coordinatorTelegramUsername ? 'border-red-400' : 'border-[#648196]/30'
                }`}
              />
              <p className="text-[#5c6c74]/70 text-xs mt-1">
                Example format: @yourname
              </p>
              {validationErrors.coordinatorTelegramUsername && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.coordinatorTelegramUsername}</p>
              )}
            </div>

            {/* Two Column Layout for Percentage Inputs */}
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 gap-x-4">
              {/* Coordinator Commission Percentage */}
              <div>
                <label htmlFor="coordinatorCommissionPercentage" className="block text-sm font-medium text-[#4f7a97] mb-2">
                  Commission % (5-50) <span className='text-red-500'>*</span>
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
                    className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder-[#5c6c74]/60 focus:outline-none focus:ring-2 focus:ring-[#5584a0] transition ${
                      validationErrors.coordinatorCommissionPercentage ? 'border-red-400' : 'border-[#648196]/30'
                    }`}
                  />
                  <span className="ml-2 text-[#5c6c74]">%</span>
                </div>
                {validationErrors.coordinatorCommissionPercentage && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.coordinatorCommissionPercentage}</p>
                )}
              </div>

              {/* Prize Percentage */}
              <div>
                <label htmlFor="prizePercentage" className="block text-sm font-medium text-[#4f7a97] mb-2">
                  Prize % <span className='text-red-500'>*</span>
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
                    className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder-[#5c6c74]/60 focus:outline-none focus:ring-2 focus:ring-[#5584a0] transition ${
                      validationErrors.prizePercentage ? 'border-red-400' : 'border-[#648196]/30'
                    }`}
                  />
                  <span className="ml-2 text-[#5c6c74]">%</span>
                </div>
                {validationErrors.prizePercentage && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.prizePercentage}</p>
                )}
              </div>

              {/* Warning Label */}
              <p className='text-[#5c6c74]/80 text-xs mt-1 col-span-2'>Commission + Prize must equal to 100% or less</p>
            </div>

            {/* Contribution Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="contributionAmountInWei" className="block text-sm font-medium text-[#4f7a97]">
                  Contribution Amount ({isWei ? 'Wei' : 'ETH'}) <span className='text-red-500'>*</span>
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
                  placeholder={isWei ? 'Enter amount in Wei' : 'Enter amount in ETH'}
                  className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder-[#5c6c74]/60 focus:outline-none focus:ring-2 focus:ring-[#5584a0] transition ${
                    validationErrors.contributionAmountInWei ? 'border-red-400' : 'border-[#648196]/30'
                  }`}
                />
                <motion.button
                  type='button'
                  onClick={toggleWeiEth}
                  className="flex items-center ml-3 px-3 py-2.5 rounded-md bg-amber-400 dark:bg-amber-700 text-white font-medium text-xs hover:bg-[#d9a33f] transition-colors shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Click to switch currency"
                >
                  <Shuffle size={16}/>
                </motion.button>
              </div>
              <div className="text-[#5c6c74]/70 text-xs mt-1 space-y-0.5">
                <p>Click the <Shuffle size={12} className="inline mb-0.5"/> button to switch between Wei and ETH</p>
                <p>1 ETH = 1,000,000,000,000,000,000 Wei</p>
              </div>
              {validationErrors.contributionAmountInWei && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.contributionAmountInWei}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition shadow-md ${
                  isPending
                    ? 'bg-[#5c6c74] cursor-not-allowed opacity-50'
                    : 'bg-[#5584a0] hover:bg-[#4f7a97] active:scale-95'
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

            <p className="text-[#5c6c74]/80 text-xs text-center">
              All fields marked with <span className='text-red-500'>*</span> are required
            </p>
            <p className="text-[#5c6c74]/80 text-xs text-center -mt-4">
              By submitting, you agree for the Platform to take <span className='underline text-[#eeb446] font-semibold'>5%</span> of the coordinator's commission
            </p>
          </form>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle unhideText={true} injectClass='hidden' endMarginBool={false}/>
      </div>
    </div>
  );
}