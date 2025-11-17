'use client';

import { useReadContract } from 'wagmi';
import { FACTORY_ABI } from '@/app/utils/TrustArisanFactoryABI';
import { FACTORY_ADDRESS } from '../utils/ContractConfig';

export function useGroupAddresses() {
  const { data, isLoading, error } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getGroupAddresses',
  });

  return {
    addresses: data || [],
    isLoading,
    error: error?.message || null,
  };
}
