// app/components/GroupVerifier.tsx
'use client';

import { useWatchContractEvent } from 'wagmi';
import { FACTORY_ADDRESS } from '@/app/utils/ContractConfig';
import { FACTORY_ABI } from '@/app/utils/TrustArisanFactoryABI';
import { memo, useEffect, useRef } from 'react';

// Global flag to ensure only one listener is created
let isGlobalListenerActive = false;

function GroupVerifierComponent() {
  const listenerRef = useRef(false);

  useEffect(() => {
    // Prevent multiple listeners from being created
    if (isGlobalListenerActive) {
      return;
    }
    isGlobalListenerActive = true;
    listenerRef.current = true;

    return () => {
      // Only cleanup if this was the active listener
      if (listenerRef.current) {
        isGlobalListenerActive = false;
      }
    };
  }, []);

  // Only set up the watcher if this is the active instance
  useWatchContractEvent({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    eventName: 'GroupCreated',
    enabled: !isGlobalListenerActive || listenerRef.current,
    onLogs(logs) {
      logs.forEach(async (log: any) => {
        const groupAddress = log.args?.[0]; // groupAddress
        const title = log.args?.[2];

        if (groupAddress) {
          console.log('📝 Verifying group:', groupAddress, 'Title:', title);

          try {
            const response = await fetch('/api/verify-group', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contractAddress: groupAddress,
                contractName: `Group_${title}`, // ✅ Use title
              }),
            });

            const result = await response.json();

            if (result.success) {
              console.log('✅ Verification submitted:', result.guid);
            } else {
              console.error('❌ Failed:', result.error);
            }
          } catch (error) {
            console.error('🚨 Error verifying group:', error);
          }
        }
      });
    },
  });

  return null; // This component doesn't render anything
}

export const GroupVerifier = memo(GroupVerifierComponent);