// hooks/useGroupsList.ts
import { useEffect, useState, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import { FACTORY_ABI } from '../utils/TrustArisanFactoryABI';
import { GROUP_ABI } from '../utils/TrustArisanGroupABI';
import { GroupDetail, Group, GroupSettings } from '@/app/types/group';
import { FACTORY_ADDRESS } from '@/app/utils/ContractConfig';

export function useGroupsList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  const fetchGroups = useCallback(async () => {
    if (!publicClient) return;

    try {
      setIsLoading(true);

      // Get addresses
      const addresses = (await publicClient.readContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'getGroupAddresses',
      })) as Address[];

      // Get all details and settings in parallel
      const [details, settings] = await Promise.all([
        // Get group details
        Promise.all(
          addresses.map(addr =>
            publicClient.readContract({
              address: addr,
              abi: GROUP_ABI,
              functionName: 'getGroupDetail',
            })
          )
        ),
        // Get group settings
        Promise.all(
          addresses.map(addr =>
            publicClient.readContract({
              address: addr,
              abi: GROUP_ABI,
              functionName: 'getGroupSettings',
            })
          )
        )
      ]);

      // Transform the data to match our interfaces
      const transformed: Group[] = addresses.map((addr, i) => {
        const detail = details[i] as GroupDetail;
        const setting = settings[i] as GroupSettings;
        
        return {
          id: addr,
          title: setting.title,
          coordinator: setting.coordinator.telegramUsername,
          chatLink: setting.telegramGroupUrl,
          size: Number(setting.maxCapacity),
          currentSize: Number(detail.membersCount),
          settings: setting
        };
      });

      setGroups(transformed);
      return transformed;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchGroups().catch(console.error);
  }, [fetchGroups]);

  // Function to manually update the groups data
  const updateGroups = useCallback((updater: (currentGroups: Group[]) => Group[]) => {
    setGroups(updater);
  }, []);

  return { 
    groups, 
    count: groups.length,
    isLoading, 
    error, 
    refetch: fetchGroups,
    updateGroups
  };
}
