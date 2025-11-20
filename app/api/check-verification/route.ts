import { SEPOLIA_CHAIN_ID } from '@/app/utils/ContractConfig';
import { NextRequest, NextResponse } from 'next/server';

interface CheckVerificationRequest {
  address: string,
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckVerificationRequest = await req.json();

    const response = await fetch(`https://api.etherscan.io/v2/api?apikey=${process.env.ETHERSCAN_API_KEY!}&chainid=${SEPOLIA_CHAIN_ID}&module=contract&action=getabi&address=${body.address}`, {
      method: 'GET',
    });

    const data = await response.json();

    // If status is 1 and we get an ABI, contract is verified
    const isVerified = data.status === '1' && data.result && data.result !== 'Contract source code not verified';

    return NextResponse.json({
      isVerified,
      status: data.status,
      message: data.message,
    });
  } catch (error) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { error: 'Check failed', details: String(error) },
      { status: 500 }
    );
  }
}
