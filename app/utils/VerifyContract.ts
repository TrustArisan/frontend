// app/utils/verifyContract.ts
import { GROUP_SOURCE_CODE } from '@/app/contracts/Group.flattened';

export async function verifyContractOnEtherscan(
  contractAddress: string,
  contractName: string = 'Group'
) {
  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
  const ETHERSCAN_API_V2 = 'https://api.etherscan.io/v2/api';
  const CHAIN_ID = process.env.CHAIN_ID || '11155111';

  // ✅ Just import it
  const params = new URLSearchParams({
    chainid: CHAIN_ID,
    apikey: ETHERSCAN_API_KEY!,
    module: 'contract',
    action: 'verifysourcecode',
    contractaddress: contractAddress,
    sourceCode: GROUP_SOURCE_CODE,
    codeformat: 'solidity-single-file',
    contractname: contractName,
    optimizationUsed: '1',
    runs: '500',
    licenseType: '3',
  });

  try {
    const response = await fetch(ETHERSCAN_API_V2, {
      method: 'POST',
      body: params,
    });

    const data = await response.json();

    if (data.status === '1') {
      console.log('✅ Verification submitted:', data.result);
      return { success: true, guid: data.result };
    } else {
      console.error('❌ Error:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error: any) {
    console.error('❌ API error:', error);
    return { success: false, error: error.message };
  }
}
