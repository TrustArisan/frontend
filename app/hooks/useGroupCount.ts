'use client';

import { useReadContract } from 'wagmi';
import { FACTORY_ABI } from '@/app/utils/TrustArisanFactoryABI';
import { FACTORY_ADDRESS } from '../utils/ContractConfig';

export function useGroupsCount() {
  const { data, isLoading, error } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getGroupsCount',
  });

  return {
    count: data ? Number(data) : 0,
    isLoading,
    error: error?.message || null,
  };
}