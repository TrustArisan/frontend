'use client';

import { useState } from 'react';
import { parseEther } from 'ethers';
import { encodeGroupConstructorArgs } from '@/app/utils/encodeConstructorArgsVerify';
import groupVerificationTemplate from '@/app/api/verify-group/group-verify.json';
import { AbiCoder } from 'ethers';
import { body } from 'motion/react-client';

interface GroupVerificationStatusProps {
  groupAddress: string;
  title: string;
  telegramUrl: string;
  coordinator: string;
  commission: string | number;
  contribution: string | number;
  prize: string | number;
}

export function GroupVerificationStatus({
  groupAddress,
  title,
  telegramUrl,
  coordinator,
  commission,
  contribution,
  prize,
}: GroupVerificationStatusProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [showButton, setShowButton] = useState(true);

  // Check verification status (called once on demand, not auto)
  const checkVerificationStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: groupAddress }),
      });

      const result = await response.json();
      return result.isVerified;
    } catch (error) {
      console.error('Error checking verification:', error);
      return false;
    }
  };

  // Verify contract
  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationStatus('⏳ Submitting verification to Etherscan...');

    try {
      const commissionBigInt = BigInt(commission);
      const contributionBigInt = parseEther(contribution.toString());
      const prizeBigInt = BigInt(prize);

      const constructorArgs = encodeGroupConstructorArgs({
        title,
        telegramUrl,
        coordinator,
        commission: commissionBigInt,
        contribution: contributionBigInt,
        prize: prizeBigInt,
      });

      const response = await fetch('/api/verify-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupAddress,
          constructorArgs,
          standardJsonInput: JSON.stringify(groupVerificationTemplate),
        }),
      });

      const result = await response.json();

      if (result.result === "Contract source code already verified") {
        setVerificationStatus('✅ Contract is already verified!');
        setIsVerified(true);
        setShowButton(false);
      }

      if (result.status === '1') {
        setVerificationStatus(
          `✅ Verification submitted! GUID: ${result.result}\n⏳ Checking status...`
        );

        // Wait 3 seconds then check
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check verification status
        const verified = await checkVerificationStatus();

        if (verified) {
          setVerificationStatus('✅ Contract verified successfully!');
          setIsVerified(true);
          setShowButton(false);
        } else {
          setVerificationStatus(
            '⏳ Verification submitted to Etherscan.\nThis usually takes 1-5 minutes. You can check back later.'
          );
        }
      } else {
        setVerificationStatus(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setVerificationStatus(`❌ Error: ${String(error)}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Only show button if not verified and user has access to details
  if (!showButton || isVerified === true) {
    return null;
  }

  return (
    <div className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-semibold text-yellow-900">Contract Not Verified</p>
          <p className="text-sm text-yellow-800">
            This contract hasn't been verified on Etherscan yet
          </p>
        </div>
      </div>

      {verificationStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800 whitespace-pre-line">
            {verificationStatus}
          </p>
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={isVerifying}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isVerifying ? 'Verifying...' : 'Verify Contract'}
      </button>

      <p className="text-xs text-yellow-700">
        💡 Click "Verify Contract" to submit for verification on Etherscan. This will make the source code public and readable.
      </p>
    </div>
  );
}
