// app/components/GroupVerifier.tsx
'use client';

import { useWatchContractEvent } from 'wagmi';
import { FACTORY_ADDRESS } from '@/app/utils/ContractConfig';
import { FACTORY_ABI } from '@/app/utils/TrustArisanFactoryABI';

export function GroupVerifier() {
  useWatchContractEvent({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    eventName: 'GroupCreated',
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
            console.error('❌ Error:', error);
          }
        }
      });
    },
  });

  return null;
}