// app/api/verify-group/route.ts
import { verifyContractOnEtherscan } from '@/app/utils/VerifyContract';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { contractAddress, contractName = 'Group' } = await request.json();

    if (!contractAddress) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const result = await verifyContractOnEtherscan(contractAddress, contractName);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
