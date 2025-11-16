'use client';

import { useWriteContract } from 'wagmi';
import { FACTORY_ABI } from '../utils/TrustArisanABI';
import { FACTORY_ADDRESS } from '../utils/ContractConfig';

export function useCreateGroup() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const createGroup = async (formData: {
    title: string;
    telegramGroupUrl: string;
    coordinatorTelegramUsername: string;
    coordinatorCommissionPercentage: number;
    contributionAmountInWei: string;
    prizePercentage: number;
  }) => {
    writeContract({
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
  };

  return {
    createGroup,
    isPending,
    error,
    transactionHash: data,
  };
}
