"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  usePublicClient,
  useAccount,
  useBalance,
  useWriteContract,
} from "wagmi";
import { Address, isAddress, formatEther } from "viem";
import { GROUP_ABI } from "@/app/utils/TrustArisanGroupABI";
import Header from "@/app/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Users,
  Percent,
  Coins,
  UsersRound,
  MessageCircleMore,
  HandCoins,
  Bitcoin,
  RotateCcw,
  BadgeCheck,
  Badge,
  List,
  TrendingUp,
  AlertCircle,
  Bell,
  Plus,
  Trophy,
  Sparkles,
  XCircle,
  Clock,
  Play,
  Wallet,
  CheckCircle2,
  UserPlus,
  LogOut,
  Zap,
} from "lucide-react";
import { Avatar } from "@/app/components/Avatar";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Loading from "@/app/components/Loading";
import { GroupVerificationStatus } from "@/app/components/GroupVerificationStatus";

interface Period {
  startedAt: bigint;
  endedAt: bigint;
  remainingPeriodBalanceInWei: bigint;
  contributionAmountInWei: bigint;
  coordinatorCommissionPercentage: bigint;
  prizePercentage: bigint;
  roundsCount: bigint;
  dueWinnersCount: bigint;
}

interface Member {
  walletAddress: Address;
  telegramUsername: string;
  isActiveVoter: boolean;
  latestPeriodParticipation: bigint;
}

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isCoordinator, setIsCoordinator] = useState<boolean>(false);
  const [capacityUpgradeCost, setCapacityUpgradeCost] = useState<bigint>(BigInt(0));
  const [nextCapacityTier, setNextCapacityTier] = useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [pendingProposalsCount, setPendingProposalsCount] = useState<number>(0);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  // State untuk Join Group Modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinRequiresApproval, setJoinRequiresApproval] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  
  // State untuk Draw Winner
  const [showDrawWinnerModal, setShowDrawWinnerModal] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [isPeriodOngoing, setIsPeriodOngoing] = useState(false);
  const [dueWinners, setDueWinners] = useState<Member[]>([]);
  const [lastWinner, setLastWinner] = useState<Member | null>(null);
  const [periodsCount, setPeriodsCount] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // State untuk Payment
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // State untuk Leave Group
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const {
    writeContractAsync,
    isPending,
  } = useWriteContract();

  const groupAddress =
    id && typeof id === "string"
      ? isAddress(id)
        ? (id as Address)
        : undefined
      : undefined;
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    isFetching: isFetchingBalance,
    refetch: balanceRefetch,
  } = useBalance({
    address: groupAddress,
  });

  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reloadData() {
    await fetchGroupDetails();
    await balanceRefetch();
    if (showDrawWinnerModal) {
      await fetchDrawWinnerData();
    }
  }

  async function checkVerificationStatus() {
    try {
      const response = await fetch('/api/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: groupAddress }),
      });

      const result = await response.json();

      if (result.isVerified) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      setIsVerified(false);
    }
  }

  async function fetchGroupDetails() {
    if (!publicClient || !id) return;

    try {
      setIsLoading(true);

      const [detail, settings, upgradeCost, nextTier, proposalsCount] = await Promise.all([
        publicClient.readContract({
          address: id as Address,
          abi: GROUP_ABI,
          functionName: "getGroupDetail",
        }),
        publicClient.readContract({
          address: id as Address,
          abi: GROUP_ABI,
          functionName: "getGroupSettings",
        }),
        publicClient.readContract({
          address: id as Address,
          abi: GROUP_ABI,
          functionName: "capacityUpgradeCost",
        }),
        publicClient.readContract({
          address: id as Address,
          abi: GROUP_ABI,
          functionName: "getNextCapacityTier",
        }),
        publicClient.readContract({
          address: id as Address,
          abi: GROUP_ABI,
          functionName: "getIncompleteProposalsCount",
        }),
      ]);

      setCapacityUpgradeCost(upgradeCost as bigint);
      setNextCapacityTier(Number(nextTier));
      setPendingProposalsCount(Number(proposalsCount));

      setGroup({
        id,
        ...detail,
        settings: {
          ...settings,
          contributionAmount: Number(settings.contributionAmountInWei),
          coordinatorCommissionPercentage: Number(
            settings.coordinatorCommissionPercentage
          ),
          prizePercentage: Number(settings.prizePercentage),
          maxCapacity: Number(settings.maxCapacity),
        },
      });
    } catch (e) {
      console.error("Error fetching group details:", e);
      setError("Failed to load group details");
    } finally {
      setIsLoading(false);
    }
  }

  async function checkMembership() {
    if (!publicClient || !address || !groupAddress) {
      setIsMember(false);
      setIsCoordinator(false);
      return;
    }

    try {
      const [memberStatus] = await Promise.all([
        publicClient.readContract({
          address: groupAddress,
          abi: GROUP_ABI,
          functionName: "isMember",
          args: [address],
        }),
      ]);

      const isUserCoordinator =
        group.settings.coordinator.walletAddress === address;

      setIsMember(Boolean(memberStatus));
      setIsCoordinator(isUserCoordinator);
    } catch (error) {
      console.error("Error checking membership:", error);
      setIsMember(false);
      setIsCoordinator(false);
    }
  }

  async function fetchDrawWinnerData() {
  if (!publicClient || !groupAddress) return;

  try {
    const pCount = await publicClient.readContract({
      address: groupAddress,
      abi: GROUP_ABI,
      functionName: 'getPeriodsCount',
    }) as bigint;

    const periodsNumber = Number(pCount);
    setPeriodsCount(periodsNumber);

    if (periodsNumber === 0) {
      setCurrentPeriod(null);
      setIsPeriodOngoing(false);
      setDueWinners([]);
      return;
    }

    try {
      const periodData = await publicClient.readContract({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'getCurrentPeriod',
      }) as [Period, boolean];

      const [period, ongoing] = periodData;

      setCurrentPeriod(period);
      setIsPeriodOngoing(ongoing);

      // ✨ TAMBAHAN: Debug info
      console.log('=== Period Debug Info ===');
      console.log('Period ongoing:', ongoing);
      console.log('Rounds count:', Number(period.roundsCount));
      console.log('Due winners count:', Number(period.dueWinnersCount));
      console.log('Started at:', new Date(Number(period.startedAt) * 1000).toLocaleString());

      if (ongoing && period && Number(period.dueWinnersCount) > 0) {
        const winnersAddresses = await publicClient.readContract({
          address: groupAddress,
          abi: GROUP_ABI,
          functionName: 'getCurrentPeriodDueWinners',
        }) as Address[];

        console.log('Due winners addresses:', winnersAddresses);

        // ✨ TAMBAHAN: Check contribution status untuk setiap member
        const winnersData = await Promise.all(
          winnersAddresses.map(async (addr) => {
            const member = await publicClient.readContract({
              address: groupAddress,
              abi: GROUP_ABI,
              functionName: 'getMemberByAddress',
              args: [addr],
            }) as Member;
            
            console.log(`Winner ${member.telegramUsername}:`, {
              address: addr,
              isActiveVoter: member.isActiveVoter,
              latestPeriodParticipation: Number(member.latestPeriodParticipation),
              currentPeriodIndex: periodsNumber - 1
            });
            
            return member;
          })
        );

        setDueWinners(winnersData);
      } else {
        setDueWinners([]);
      }
    } catch (periodError: any) {
      if (periodError.message?.includes('NoPeriodOngoing')) {
        console.log('No period ongoing - ready to start new period');
        setCurrentPeriod(null);
        setIsPeriodOngoing(false);
        setDueWinners([]);
      } else {
        throw periodError;
      }
    }
  } catch (error) {
    console.error('Error fetching draw winner data:', error);
  }
}


  async function handleStartNewPeriod() {
    if (!groupAddress || !isAddress(groupAddress)) return;

    try {
      setIsPaying(true);
      
      const contributionAmount = group?.settings?.contributionAmountInWei 
        ? BigInt(group.settings.contributionAmountInWei)
        : BigInt(0);

      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'startPeriod',
        value: contributionAmount,
        gas: BigInt(500000),
      });

      console.log('Start new period transaction sent:', txHash);

      setTimeout(async () => {
        await fetchDrawWinnerData();
        await balanceRefetch();
        await fetchGroupDetails();
        setIsPaying(false);
        alert('New period started successfully!');
      }, 3000);
    } catch (error: any) {
      console.error('Error starting new period:', error);
      
      let errorMessage = "Failed to start new period";
      
      if (error.message?.includes('User rejected')) {
        errorMessage = "You rejected the transaction";
      } else if (error.message?.includes('LastPeriodNotEnded')) {
        errorMessage = "Previous period has not ended yet";
      } else if (error.message?.includes('IncompleteProposalsRemaining')) {
        errorMessage = "Complete all pending proposals first";
      } else if (error.message?.includes('IncorrectContributionAmount')) {
        errorMessage = "Incorrect contribution amount";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setIsPaying(false);
    }
  }

  async function handlePayment() {
    if (!groupAddress || !isAddress(groupAddress)) return;

    try {
      setIsPaying(true);
      
      if (periodsCount === 0) {
        alert('No active period. Please wait for the coordinator to start a new period.');
        setIsPaying(false);
        return;
      }

      const currentPeriodIndex = periodsCount - 1;
      const contributionAmount = group?.settings?.contributionAmountInWei 
        ? BigInt(group.settings.contributionAmountInWei)
        : BigInt(0);

      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'contribute',
        args: [BigInt(currentPeriodIndex)],
        value: contributionAmount,
        gas: BigInt(500000),
      });

      console.log('Payment transaction sent:', txHash);

      setTimeout(async () => {
        await balanceRefetch();
        await fetchDrawWinnerData();
        await fetchGroupDetails();
        setIsPaying(false);
        setShowPaymentModal(false);
        alert('Payment successful!');
      }, 3000);
    } catch (error: any) {
      console.error('Error making payment:', error);
      alert(`Failed to make payment: ${error.message || "Unknown error"}`);
      setIsPaying(false);
    }
  }

  async function handleOpenDrawWinner() {
    await fetchDrawWinnerData();
    setShowDrawWinnerModal(true);
  }

  async function handleDrawWinner() {
    if (!groupAddress || !isAddress(groupAddress)) {
      console.error('Invalid group address');
      return;
    }

    if (!isPeriodOngoing) {
      alert('No active period to draw winner from');
      return;
    }

    if (periodsCount === 0) {
      alert('No periods exist yet');
      return;
    }

    try {
      setIsDrawing(true);
      
      const currentPeriodIndex = periodsCount - 1;

      console.log('=== Drawing Winner ===');
      console.log('Period index:', currentPeriodIndex);
      console.log('Group address:', groupAddress);

      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'drawWinner',
        args: [BigInt(currentPeriodIndex)],
        gas: BigInt(500000),
      });

      console.log('Draw winner transaction sent:', txHash);

      setTimeout(async () => {
        await fetchDrawWinnerData();
        await balanceRefetch();
        await fetchGroupDetails();
        setIsDrawing(false);
        alert('Winner drawn successfully!');
      }, 3000);
    } catch (error: any) {
      console.error('=== Error Drawing Winner ===');
      console.error('Error:', error);
      
      let errorMessage = "Failed to draw winner";
      
      if (error.message?.includes('User rejected')) {
        errorMessage = "You rejected the transaction";
      } else if (error.message?.includes('NoPeriodOngoing')) {
        errorMessage = "No active period to draw winner from";
      } else if (error.message?.includes('NotCoordinator')) {
        errorMessage = "Only coordinator can draw winner";
      } else if (error.message?.includes('NoDueWinnersRemaining')) {
        errorMessage = "No members eligible for draw";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setIsDrawing(false);
    }
  }

  async function handleJoinGroup() {
    if (!groupAddress || !isAddress(groupAddress)) {
      console.error("Invalid group address");
      return;
    }

    setShowJoinModal(true);
    setTelegramUsername("");
    setJoinSuccess(false);
    setJoinRequiresApproval(false);
    setJoinError(null);
  }

  async function submitJoinGroup() {
    if (!groupAddress || !isAddress(groupAddress)) {
      console.error("Invalid group address");
      return;
    }

    if (!telegramUsername.trim()) {
      setJoinError("Please enter your Telegram username");
      return;
    }

    try {
      setIsJoining(true);
      setJoinError(null);

      const functionName = group.settings.openJoinEnabled
        ? "joinGroupNoApproval"
        : "joinGroup";

      const txHash = await writeContractAsync({
        address: groupAddress as Address,
        abi: GROUP_ABI,
        functionName: functionName,
        args: [telegramUsername],
        gas: BigInt(300000),
      });

      console.log(`${functionName} transaction sent:`, txHash);

      setJoinSuccess(true);
      setJoinRequiresApproval(!group.settings.openJoinEnabled);

      setTimeout(async () => {
        await reloadData();
        setIsJoining(false);
      }, 2000);
    } catch (error: any) {
      console.error("Error joining group:", error);
      
      let errorMessage = "Failed to join group";
      
      if (error.message?.includes('User rejected')) {
        errorMessage = "You rejected the transaction";
      } else if (error.message?.includes('MemberAlreadyExists')) {
        errorMessage = "You are already a member of this group";
      } else if (error.message?.includes('GroupCapacityExceeded')) {
        errorMessage = "Group is full. Cannot accept new members";
      } else if (error.message?.includes('AlreadyWaitingForJoinApproval')) {
        errorMessage = "You already have a pending join request";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setJoinError(errorMessage);
      setIsJoining(false);
    }
  }

  async function toggleOpenJoin() {
    if (!groupAddress || !isAddress(groupAddress)) return;

    try {
      const txHash = await writeContractAsync({
        address: groupAddress as Address,
        abi: GROUP_ABI,
        functionName: "toggleOpenJoin",
        args: [!group.settings.openJoinEnabled],
        gas: BigInt(300000),
      });

      console.log("Toggle transaction sent:", txHash);
      await reloadData();
    } catch (error: any) {
      console.error("Error toggling open join:", error);
    }
  }

  async function handleUpgradeCapacity() {
    if (!groupAddress || !isAddress(groupAddress)) return;

    try {
      console.log('=== Upgrading Capacity ===');
      console.log('Group address:', groupAddress);
      console.log('Upgrade cost:', formatEther(capacityUpgradeCost), 'ETH');
      console.log('Current capacity:', group.settings.maxCapacity);
      console.log('Next capacity:', nextCapacityTier);

      const txHash = await writeContractAsync({
        address: groupAddress as Address,
        abi: GROUP_ABI,
        functionName: "upgradeCapacity",
        value: capacityUpgradeCost,
        gas: BigInt(300000),
      });

      console.log("Upgrade capacity transaction sent:", txHash);
      setShowUpgradeModal(false);
      
      setTimeout(async () => {
        await reloadData();
        alert('Capacity upgraded successfully!');
      }, 3000);
    } catch (error: any) {
      console.error("Error upgrading capacity:", error);
      
      let errorMessage = "Failed to upgrade capacity";
      
      if (error.message?.includes('User rejected')) {
        errorMessage = "You rejected the transaction";
      } else if (error.message?.includes('CannotUpgradeAtCurrentMemberCount')) {
        errorMessage = "Cannot upgrade: Group must be at 80% capacity";
      } else if (error.message?.includes('IncorrectCapacityUpgradePayment')) {
        errorMessage = "Incorrect payment amount for upgrade";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  }

  async function handleLeaveGroup() {
    if (!groupAddress || !isAddress(groupAddress)) return;

    try {
      setIsLeaving(true);

      const txHash = await writeContractAsync({
        address: groupAddress as Address,
        abi: GROUP_ABI,
        functionName: "leave",
        gas: BigInt(300000),
      });

      console.log("Leave group transaction sent:", txHash);

      setTimeout(async () => {
        await reloadData();
        setIsLeaving(false);
        setShowLeaveModal(false);
        router.push("/");
      }, 3000);
    } catch (error: any) {
      console.error("Error leaving group:", error);
      
      let errorMessage = "Failed to leave group";
      
      if (error.message?.includes('CoordinatorCannotLeave')) {
        errorMessage = "Coordinator cannot leave the group";
      } else if (error.message?.includes('CannotLeaveWhileParticipating')) {
        errorMessage = "Cannot leave while actively participating in current period";
      } else if (error.message?.includes('User rejected')) {
        errorMessage = "You rejected the transaction";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setIsLeaving(false);
    }
  }

  useEffect(() => {
    fetchGroupDetails();
    balanceRefetch();
    checkVerificationStatus();
  }, [publicClient, id]);

  useEffect(() => {
    if (isConnected && address && group != null) {
      checkMembership();
    }
  }, [isConnected, address, group]);

  useEffect(() => {
    if (group && publicClient && groupAddress) {
      fetchDrawWinnerData();
    }
  }, [group, publicClient, groupAddress]);

  const prizeAmount = currentPeriod 
    ? (BigInt(currentPeriod.contributionAmountInWei) * BigInt(currentPeriod.prizePercentage)) / BigInt(100)
    : BigInt(0);

  const defaultPaymentAmount = group?.settings?.contributionAmountInWei 
    ? (Number(group.settings.contributionAmountInWei) / 1e18).toFixed(6)
    : "0.000000";

  if (isLoading) {
    return (
      <div>
        <Header />
        <Loading />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive dark:text-destructive-foreground p-4 rounded-lg">
            {error || "Group not found"}
          </div>
        </div>
      </div>
    );
  }

  const membersCount = Number(group.membersCount || 0);
  const maxCapacity = Number(group.settings.maxCapacity || 0);
  const capacityPercentage = (membersCount / maxCapacity) * 100;
  const isCapacityNearFull = capacityPercentage >= 80;
  const isCapacityFull = membersCount >= maxCapacity;

  const canStartNewPeriod = isCoordinator && !isPeriodOngoing;
  const canDrawWinner = isCoordinator && isPeriodOngoing && dueWinners.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Join Group Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isJoining && !joinSuccess && setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {joinError ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-red-500 to-red-600"
                  >
                    <XCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#4f7a97] dark:text-white mb-2">Failed to Join</h2>
                  <p className="text-[#5c6c74] dark:text-gray-300 mb-6">{joinError}</p>
                  <button
                    onClick={() => {
                      setJoinError(null);
                      setTelegramUsername("");
                    }}
                    className="w-full py-3 px-6 bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold rounded-lg transition-colors shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              ) : joinSuccess ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                      joinRequiresApproval 
                        ? 'bg-gradient-to-br from-[#5584a0] to-[#4f7a97]' 
                        : 'bg-gradient-to-br from-[#10b981] to-[#059669]'
                    }`}
                  >
                    {joinRequiresApproval ? <Clock className="w-10 h-10 text-white" /> : <CheckCircle2 className="w-10 h-10 text-white" />}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#4f7a97] dark:text-white mb-2">
                    {joinRequiresApproval ? 'Request Sent!' : 'Welcome Aboard!'}
                  </h2>
                  <p className="text-[#5c6c74] dark:text-gray-300 mb-6">
                    {joinRequiresApproval 
                      ? 'Your join request has been submitted successfully.'
                      : 'You have successfully joined the group!'}
                  </p>
                  <button
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinSuccess(false);
                    }}
                    className="w-full py-3 px-6 bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold rounded-lg transition-colors shadow-md"
                  >
                    Got it!
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#5584a0] to-[#4f7a97] rounded-full flex items-center justify-center mb-4">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#4f7a97] dark:text-white mb-2">
                      Join {group.settings.title}
                    </h2>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#4f7a97] dark:text-gray-200 mb-2">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="@username"
                      disabled={isJoining}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1e2a35] border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowJoinModal(false)}
                      disabled={isJoining}
                      className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitJoinGroup}
                      disabled={isJoining || !telegramUsername.trim()}
                      className="flex-1 py-3 px-6 bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
                    >
                      {isJoining ? 'Joining...' : (group.settings.openJoinEnabled ? 'Join Now' : 'Send Request')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isPaying && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#4f7a97] mb-2">
                  {isCoordinator ? "Coordinator Payment" : "Member Payment"}
                </h2>
                <p className="text-[#5c6c74] mb-6">
                  {isCoordinator 
                    ? "As coordinator, you must contribute to start the period" 
                    : "Contribute your share to participate in this period"}
                </p>
                
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#5c6c74] font-medium">Required Amount:</span>
                    <span className="text-lg font-bold text-[#4f7a97]">{defaultPaymentAmount} ETH</span>
                  </div>
                  <p className="text-xs text-[#5c6c74]">
                    This is the fixed contribution amount for this group
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                    disabled={isPaying}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPaying ? 'Processing...' : 'Confirm Payment'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draw Winner Modal - COMPLETE */}
      <AnimatePresence>
        {showDrawWinnerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isDrawing && setShowDrawWinnerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#eeb446] to-[#d9a33f] rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#4f7a97] dark:text-white mb-2">
                  Draw Winner
                </h2>
                <p className="text-[#5c6c74] dark:text-gray-300">
                  {isPeriodOngoing ? 'Period is ongoing - ready to draw!' : 'No active period'}
                </p>
              </div>

              {/* Period Info */}
              {currentPeriod && isPeriodOngoing && (
                <div className="mb-6 bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Prize Amount:</p>
                      <p className="text-lg font-bold text-[#4f7a97]">
                        {formatEther(prizeAmount)} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Winners:</p>
                      <p className="text-lg font-bold text-[#4f7a97]">
                        {dueWinners.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Due Winners List */}
              {dueWinners.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#4f7a97] mb-3">Eligible Winners:</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {dueWinners.map((winner, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-gray-800 border border-[#5584a0]/20 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={winner.telegramUsername} size="md" />
                          <div>
                            <p className="font-medium text-[#4f7a97]">
                              {winner.telegramUsername}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {winner.walletAddress.slice(0, 6)}...{winner.walletAddress.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <Sparkles className="w-5 h-5 text-[#eeb446]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDrawWinnerModal(false)}
                  disabled={isDrawing}
                  className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleDrawWinner}
                  disabled={isDrawing || !canDrawWinner}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-[#eeb446] to-[#d9a33f] hover:from-[#d9a33f] hover:to-[#c9933f] text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDrawing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Drawing...
                    </span>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5 inline mr-2" />
                      Draw Winner Now
                    </>
                  )}
                </button>
              </div>

              {!canDrawWinner && isPeriodOngoing && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 text-center">
                    No eligible winners at this moment
                  </p>
                </div>
              )}

              {!isPeriodOngoing && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                    Start a new period to enable winner drawing
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Capacity Modal - COMPLETE */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isPending && setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#eeb446] rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#4f7a97] dark:text-white mb-2">
                  Upgrade Capacity
                </h2>
                <p className="text-[#5c6c74] dark:text-gray-300 mb-6">
                  Increase your group's maximum capacity
                </p>

                <div className="bg-[#eeb446]/10 border border-[#eeb446]/30 rounded-lg p-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Capacity:</span>
                      <span className="font-bold text-[#4f7a97]">{maxCapacity} members</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">New Capacity:</span>
                      <span className="font-bold text-[#4f7a97]">{nextCapacityTier} members</span>
                    </div>
                    <div className="pt-3 border-t border-[#eeb446]/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Upgrade Cost:</span>
                        <span className="text-lg font-bold text-[#eeb446]">
                          {formatEther(capacityUpgradeCost)} ETH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 dark:text-blue-300 text-left">
                      Upgrading capacity allows you to accept more members into your group. The upgrade is permanent.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    disabled={isPending}
                    className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgradeCapacity}
                    disabled={isPending}
                    className="flex-1 py-3 px-6 bg-[#eeb446] hover:bg-[#d9a33f] text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Upgrading...
                      </span>
                    ) : (
                      'Confirm Upgrade'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Group Modal */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isLeaving && setShowLeaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#4f7a97] dark:text-white mb-2">
                  Leave Group?
                </h2>
                <p className="text-[#5c6c74] dark:text-gray-300 mb-6">
                  Are you sure you want to leave this group?
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    disabled={isLeaving}
                    className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLeaveGroup}
                    disabled={isLeaving}
                    className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
                  >
                    {isLeaving ? 'Leaving...' : 'Leave Group'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center gap-2 mb-4">
          <motion.button
            onClick={() => router.push("/")}
            className="flex pe-8 py-3 items-center rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} className="me-4" />
            Back to groups
          </motion.button>
          <div className="flex grow gap-2 justify-end">
            <motion.button
              type="button"
              onClick={reloadData}
              className="p-2.5 px-4 rounded-full shadow-sm border border-[#5584a0]/20 dark:border-[hsl(var(--foreground))]/20"
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              title="Reload Data"
            >
              <RotateCcw size={20} />
            </motion.button>
            
            <div className="p-0.5 rounded-lg">
              <ThemeToggle unhideText={false} />
            </div>
          </div>
        </div>

        {/* Pending Proposals Banner */}
        {pendingProposalsCount > 0 && isMember && !group.settings.openJoinEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-[#eeb446]/10 border border-[#eeb446]/30 rounded-xl p-4 shadow-sm mb-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-[#eeb446]/20">
                  <Bell className="w-5 h-5 text-[#eeb446]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4f7a97] mb-1">
                    {pendingProposalsCount} Pending Join Request{pendingProposalsCount !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    There {pendingProposalsCount === 1 ? 'is' : 'are'} {pendingProposalsCount} membership proposal{pendingProposalsCount !== 1 ? 's' : ''} waiting for your vote.
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => router.push(`/group/${id}/proposals`)}
                className="self-center px-4 py-2 rounded-lg bg-[#eeb446] hover:bg-[#d9a33f] text-white font-medium text-sm transition-colors shadow-sm whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Proposals
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Group Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group bg-card rounded-xl border border-[#4f7a97]/10 hover:border-[#4f7a97]/30 hover:shadow-xl transition-all duration-300 p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex w-full md:flex-row flex-col items-center place-items-center justify-items-center">
              <Avatar
                name={group.title}
                size="xxl"
                className="md:me-4 md:mb-0 mb-4 ring-4 ring-[#eeb446]/20"
              />
              <div>
                <h1 className="text-3xl font-bold mb-1 md:text-start text-center">
                  {group.settings.title}
                </h1>
                <p className="text-muted-foreground md:text-start text-center">
                  Managed by {group.settings.coordinator.telegramUsername}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users size={18} />
                  <span className="text-sm font-medium">Members</span>
                </div>
                {isCapacityNearFull && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isCapacityFull 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {isCapacityFull ? 'Full' : 'Near Full'}
                  </span>
                )}
              </div>
              <p className="text-2xl font-semibold">
                {membersCount}
                <span className="text-muted-foreground text-sm ml-1">
                  / {maxCapacity}
                </span>
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Coins size={18} />
                <span className="text-sm font-medium">Contribution</span>
              </div>
              <p className="text-2xl font-semibold">
                {defaultPaymentAmount} ETH
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Percent size={18} />
                <span className="text-sm font-medium">Coordinator Commission</span>
              </div>
              <p className="text-2xl font-semibold">
                {group.settings.coordinatorCommissionPercentage}%
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <HandCoins size={18} />
                <span className="text-sm font-medium">Prize Percentage</span>
              </div>
              <p className="text-2xl font-semibold">
                {group.settings.prizePercentage}%
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Bitcoin size={18} />
                <span className="text-sm font-medium">Current Pool</span>
              </div>
              {!(isLoadingBalance || isFetchingBalance) ? (
                <p className="text-2xl font-semibold">
                  {balanceData?.value ? formatEther(balanceData.value) : "0"} ETH
                </p>
              ) : (
                <div className="animate-pulse">
                  <div className="w-32 h-8 bg-gray-300 rounded"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-[hsl(var(--foreground))]/20 p-6 shadow-sm mt-6"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Coordinator controls */}
            {isCoordinator && (
              <>
                {/* Open Join Toggle */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                  <div className="bg-muted/50 rounded-xl p-4 border border-[hsl(var(--foreground))]/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg transition-colors ${
                          group.settings.openJoinEnabled ? "bg-emerald-100" : "bg-muted"
                        }`}>
                          {group.settings.openJoinEnabled ? (
                            <BadgeCheck className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Badge className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">Open Join</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {group.settings.openJoinEnabled
                              ? "Members can join directly"
                              : "Requires approval to join"}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={toggleOpenJoin}
                        disabled={isPending}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                          group.settings.openJoinEnabled ? "bg-emerald-500" : 'bg-slate-400'
                        } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                          animate={{ x: group.settings.openJoinEnabled ? 28 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Start New Period Button */}
                {canStartNewPeriod && (
                  <motion.button
                    onClick={handleStartNewPeriod}
                    disabled={isPaying}
                    className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-center items-center px-5 py-4 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold text-lg transition-colors border border-green-600 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPaying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Starting Period...
                      </>
                    ) : (
                      <>
                        <Play className="mr-3" size={20} />
                        Start New Period ({defaultPaymentAmount} ETH)
                      </>
                    )}
                  </motion.button>
                )}

                {/* Upgrade Capacity Card */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                  <div className={`bg-muted/50 rounded-xl p-4 border ${
                    isCapacityNearFull ? 'border-[#eeb446]/50 bg-[#eeb446]/5' : 'border-[hsl(var(--foreground))]/10'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2.5 rounded-lg ${isCapacityNearFull ? 'bg-[#eeb446]/20' : 'bg-muted'}`}>
                          <TrendingUp className={`w-5 h-5 ${isCapacityNearFull ? 'text-[#eeb446]' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold flex items-center gap-2">
                            Upgrade Capacity
                            {isCapacityNearFull && (
                              <span className="text-xs px-2 py-0.5 bg-[#eeb446]/20 text-[#eeb446] rounded-full font-medium">
                                Recommended
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Current: {maxCapacity} | Next: {nextCapacityTier}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cost: <span className="font-semibold text-[#4f7a97]">
                              {formatEther(capacityUpgradeCost)} ETH
                            </span>
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => setShowUpgradeModal(true)}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg self-center bg-[#5584a0] hover:bg-[#4f7a97] text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Upgrade
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Draw Winner Button */}
                {isPeriodOngoing && (
                  <motion.button
                    onClick={handleOpenDrawWinner}
                    className="flex grow justify-center px-5 py-3 rounded-full bg-gradient-to-r from-[#eeb446] to-[#d9a33f] text-white font-medium text-md hover:from-[#d9a33f] hover:to-[#c9933f] transition-colors border border-[#eeb446]/20 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trophy className="me-2 font-thin px-0.5" /> Draw Winner
                  </motion.button>
                )}
              </>
            )}
            
            {/* Member controls */}
            {isMember && isPeriodOngoing && (
              <motion.button
                onClick={() => setShowPaymentModal(true)}
                className="flex grow justify-center px-5 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium text-md transition-colors border border-green-700 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="me-2 font-thin px-0.5" /> 
                Pay {defaultPaymentAmount} ETH
              </motion.button>
            )}
            
            {/* Join Button */}
            {isConnected && !isMember && (
              <motion.button
                onClick={handleJoinGroup}
                className="flex flex-initial justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UsersRound className="me-2 font-thin px-0.5" /> Join Group
              </motion.button>
            )}
            
            {/* More member buttons */}
            {isMember && (
              <>
                <motion.button
                  onClick={() => router.push(`/group/${id}/members`)}
                  className="flex grow justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="me-2 font-thin px-0.5" /> View Members
                </motion.button>

                {!group.settings.openJoinEnabled && (
                  <motion.button
                    onClick={() => router.push(`/group/${id}/proposals`)}
                    className="relative flex grow justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="me-2 font-thin px-0.5" /> 
                    View Proposals
                    {pendingProposalsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {pendingProposalsCount}
                      </span>
                    )}
                  </motion.button>
                )}

                <motion.button
                  onClick={() => router.push(`/group/${id}/create-proposal`)}
                  className="flex grow justify-center px-5 py-3 rounded-full bg-[#eeb446] hover:bg-[#d9a33f] text-white font-medium text-md transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="me-2 font-thin px-0.5" /> Create Proposal
                </motion.button>
              </>
            )}
            
            {/* Join Chat Button */}
            <Link
              className="flex flex-initial"
              target="_blank"
              href={group.settings.telegramGroupUrl}
              rel="noopener noreferrer"
            >
              <motion.button
                className="flex grow justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircleMore className="me-2 font-thin px-0.5" /> Join Chat
              </motion.button>
            </Link>

            {/* Leave Group Button */}
            {isMember && !isCoordinator && (
              <motion.button
                onClick={() => setShowLeaveModal(true)}
                className="flex flex-initial justify-center items-center px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-md transition-colors border border-red-700 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="me-2" size={18} /> 
                <span>Leave Group</span>
              </motion.button>
            )}
          </div>
        </motion.div>
        
        
      </main>
    </div>
  );
}