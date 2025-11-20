// lib/encodeConstructorArgs.ts
import { AbiCoder } from 'ethers';

export function encodeGroupConstructorArgs(params: {
  title: string;
  telegramUrl: string;
  coordinator: string;
  commission: bigint;
  contribution: bigint;
  prize: bigint;
}): string {
    const coder = AbiCoder.defaultAbiCoder();
  return coder.encode(
    [
      'string',    // title
      'string',    // telegramUrl
      'address',   // coordinator
      'uint256',   // commission
      'uint256',   // contribution
      'uint256',   // prize
    ],
    [
      params.title,
      params.telegramUrl,
      params.coordinator,
      params.commission,
      params.contribution,
      params.prize,
    ]
  );
}
