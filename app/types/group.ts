// app/types/group.ts
import { Address } from 'viem';

export interface ExternalMember {
  walletAddress: `0x${string}`;
  telegramUsername: string;
  isActiveVoter: boolean;
  latestPeriodParticipation: bigint;
}

export interface GroupSettings {
  title: string;
  telegramGroupUrl: string;
  coordinator: ExternalMember;
  coordinatorCommissionPercentage: bigint;
  contributionAmountInWei: bigint;
  prizePercentage: bigint;
  maxCapacity: bigint;
  capacityUpgradeCount: bigint;
  openJoinEnabled: boolean;
}

export interface GroupDetail {
  groupAddress: `0x${string}`;
  title: string;
  telegramGroupUrl: string;
  membersCount: bigint;
  memberAddresses: readonly `0x${string}`[];
  joinStatus: number;
}

export interface Group {
  id: string;
  title: string;
  coordinator: string; // coordinator's telegram username
  chatLink: string;
  size: number;        // max capacity
  currentSize: number; // current members count
  settings: GroupSettings;
}
