'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FACTORY_ABI } from '@/app/utils/TrustArisanFactoryABI';
import { FACTORY_ADDRESS } from '../utils/ContractConfig';

export function useCreateGroup() {
  const { writeContractAsync, isPending, error, data } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt();

  const createGroup = async (formData: {
    title: string;
    telegramGroupUrl: string;
    coordinatorTelegramUsername: string;
    coordinatorCommissionPercentage: number;
    contributionAmountInWei: string;
    prizePercentage: number;
  }) => {
    try {
      const txHash = await writeContractAsync({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'createGroup',
        args: [
          formData.title,
          formData.telegramGroupUrl,
          formData.coordinatorTelegramUsername,
          BigInt(formData.coordinatorCommissionPercentage),
          BigInt(formData.contributionAmountInWei),
          BigInt(formData.prizePercentage),
        ],
      });

      console.log('Transaction sent:', txHash);
      return { success: true, txHash };
    } catch (error: any) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  return {
    createGroup,
    isPending: isPending || isWaiting,
    error,
    transactionHash: data,
  };
}
