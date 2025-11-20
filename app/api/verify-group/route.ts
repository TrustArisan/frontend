// app/api/verify-group/route.ts
import { NextRequest, NextResponse } from 'next/server';
import groupVerificationTemplate from '@/app/api/verify-group/group-verify.json';
import { SEPOLIA_CHAIN_ID } from '@/app/utils/ContractConfig';

interface VerifyGroupRequest {
  groupAddress: string;
  constructorArgs: string; // ABI-encoded args
}

export async function POST(req: NextRequest) {
  const { groupAddress, constructorArgs }: VerifyGroupRequest = await req.json();
  const cleanConstructorArgs = constructorArgs.startsWith('0x') 
    ? constructorArgs.slice(2) 
    : constructorArgs;

  // Use the template JSON (same for all groups)
  const params = new URLSearchParams({
    apikey: process.env.ETHERSCAN_API_KEY!,
    module: 'contract',
    action: 'verifysourcecode',
    contractaddress: groupAddress,
    sourceCode: JSON.stringify(groupVerificationTemplate),
    codeformat: 'solidity-standard-json-input',
    contractname: 'src/Group.sol:Group',
    compilerversion: 'v0.8.30+commit.73712a01',
    optimizationUsed: '1',
    runs: '500',
    constructorArguments: cleanConstructorArgs,
    licenseType: "3"
  });

  const response = await fetch(`https://api.etherscan.io/v2/api?chainid=${SEPOLIA_CHAIN_ID}`, {
    method: 'POST',
    body: params,
  });

  const data = await response.json();
  return NextResponse.json(data);
}
