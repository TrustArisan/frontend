"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  usePublicClient,
  useAccount,
  useBalance,
  useWriteContract,
} from "wagmi";
import { Address, isAddress, formatEther, parseEther } from "viem";
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
  Wallet
} from "lucide-react";
import { Avatar } from "@/app/components/Avatar";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Loading from "@/app/components/Loading";

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

  const {
    writeContractAsync,
    isPending,
    error: errorWriteContract,
  } = useWriteContract();

  // Convert id to Address
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

  // Fungsi untuk fetch data Draw Winner
  async function fetchDrawWinnerData() {
    if (!publicClient || !groupAddress) return;

    try {
      const [periodData, pCount] = await Promise.all([
        publicClient.readContract({
          address: groupAddress,
          abi: GROUP_ABI,
          functionName: 'getCurrentPeriod',
        }),
        publicClient.readContract({
          address: groupAddress,
          abi: GROUP_ABI,
          functionName: 'getPeriodsCount',
        }),
      ]);

      const [period, ongoing] = periodData as [Period, boolean];

      setCurrentPeriod(period);
      setIsPeriodOngoing(ongoing);
      setPeriodsCount(Number(pCount));

      if (ongoing && period) {
        const winnersAddresses = await publicClient.readContract({
          address: groupAddress,
          abi: GROUP_ABI,
          functionName: 'getCurrentPeriodDueWinners',
        }) as Address[];

        const winnersData = await Promise.all(
          winnersAddresses.map(async (addr) => {
            const member = await publicClient.readContract({
              address: groupAddress,
              abi: GROUP_ABI,
              functionName: 'getMemberByAddress',
              args: [addr],
            }) as Member;
            return member;
          })
        );

        setDueWinners(winnersData);
      }
    } catch (error) {
      console.error('Error fetching draw winner data:', error);
    }
  }

  // Fungsi untuk Start New Period
  async function handleStartNewPeriod() {
    if (!groupAddress || !isAddress(groupAddress)) return;

    try {
      setIsPaying(true);
      
      // startPeriod memerlukan pembayaran contribution amount dari coordinator
      const contributionAmount = group?.settings?.contributionAmountInWei 
        ? BigInt(group.settings.contributionAmountInWei)
        : BigInt(0);

      console.log('Starting new period with contribution:', {
        amountInWei: contributionAmount.toString(),
        amountInETH: formatEther(contributionAmount)
      });

      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'startPeriod',
        value: contributionAmount, // Coordinator harus bayar contribution saat start period
        gas: BigInt(500000), // Tingkatkan gas limit
      });

      console.log('Start new period transaction sent:', txHash);

      setTimeout(async () => {
        await fetchDrawWinnerData();
        await balanceRefetch();
        setIsPaying(false);
        alert('New period started successfully!');
      }, 3000);
    } catch (error: any) {
      console.error('Error starting new period:', error);
      
      // Handle specific error messages
      if (error.message?.includes('IncompleteProposalsRemaining')) {
        alert('Cannot start period: There are incomplete proposals that need to be resolved first.');
      } else if (error.message?.includes('LastPeriodNotEnded')) {
        alert('Cannot start period: The last period has not ended yet.');
      } else if (error.message?.includes('IncorrectContributionAmount')) {
        alert('Transaction failed: Incorrect contribution amount sent.');
      } else if (error.message?.includes('insufficient funds')) {
        alert('Transaction failed: Insufficient funds in your wallet.');
      } else if (error.message?.includes('gas')) {
        alert('Transaction failed: Gas estimation failed. Please try again.');
      } else {
        alert(`Failed to start new period: ${error.message || "Unknown error"}`);
      }
      setIsPaying(false);
    }
  }

  // Fungsi untuk Payment
  async function handlePayment() {
    if (!groupAddress || !isAddress(groupAddress)) return;

    try {
      setIsPaying(true);
      
      // Get current period index - harus ada periode yang sedang berjalan
      if (periodsCount === 0) {
        alert('No active period. Please wait for the coordinator to start a new period.');
        setIsPaying(false);
        return;
      }

      const currentPeriodIndex = periodsCount - 1;
      const contributionAmount = group?.settings?.contributionAmountInWei 
        ? BigInt(group.settings.contributionAmountInWei)
        : BigInt(0);

      console.log('Payment details:', {
        periodIndex: currentPeriodIndex,
        amountInWei: contributionAmount.toString(),
        amountInETH: formatEther(contributionAmount)
      });

      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'contribute',
        args: [BigInt(currentPeriodIndex)],
        value: contributionAmount,
        gas: BigInt(500000), // Tingkatkan gas limit
      });

      console.log('Payment transaction sent:', txHash);

      setTimeout(async () => {
        await balanceRefetch();
        await fetchDrawWinnerData();
        setIsPaying(false);
        setShowPaymentModal(false);
        alert('Payment successful!');
      }, 3000);
    } catch (error: any) {
      console.error('Error making payment:', error);
      
      // Handle specific error messages
      if (error.message?.includes('IncorrectContributionAmount')) {
        alert('Transaction failed: Incorrect contribution amount.');
      } else if (error.message?.includes('PeriodDoesNotExist')) {
        alert('Transaction failed: No active period exists.');
      } else if (error.message?.includes('insufficient funds')) {
        alert('Transaction failed: Insufficient funds in your wallet.');
      } else if (error.message?.includes('gas')) {
        alert('Transaction failed: Gas estimation failed. Please try again.');
      } else {
        alert(`Failed to make payment: ${error.message || "Unknown error"}`);
      }
      setIsPaying(false);
    }
  }

  // Fungsi untuk membuka modal Draw Winner
  async function handleOpenDrawWinner() {
    setShowDrawWinnerModal(true);
    await fetchDrawWinnerData();
  }

  // Fungsi untuk Draw Winner
  async function handleDrawWinner() {
    if (!groupAddress || !isAddress(groupAddress) || !periodsCount) return;

    try {
      setIsDrawing(true);
      
      const currentPeriodIndex = periodsCount - 1;
      
      console.log('Drawing winner for period:', currentPeriodIndex);

      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'drawWinner',
        args: [BigInt(currentPeriodIndex)],
        gas: BigInt(500000), // Tingkatkan gas limit
      });

      console.log('Draw winner transaction sent:', txHash);

      setTimeout(async () => {
        await fetchDrawWinnerData();
        await balanceRefetch();
        
        // Refresh due winners list to show updated winners
        if (dueWinners.length > 0) {
          setLastWinner(dueWinners[0]);
        }
        setIsDrawing(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error drawing winner:', error);
      
      // Handle specific error messages
      if (error.message?.includes('NoDueWinnersRemaining')) {
        alert('No eligible winners remaining for this round.');
      } else if (error.message?.includes('NoPeriodOngoing')) {
        alert('No active period to draw winners from.');
      } else if (error.message?.includes('NotCoordinator')) {
        alert('Only the coordinator can draw winners.');
      } else if (error.message?.includes('gas')) {
        alert('Transaction failed: Gas estimation failed. Please try again.');
      } else {
        alert(`Failed to draw winner: ${error.message || "Unknown error"}`);
      }
      setIsDrawing(false);
    }
  }

  async function handleJoinGroup() {
    if (!groupAddress || !isAddress(groupAddress)) {
      console.error("Invalid group address");
      return;
    }

    const telegramUsername =
      prompt("Please enter your Telegram username:") || "";

    if (!telegramUsername.trim()) {
      alert("Telegram username is required to join the group");
      return;
    }

    try {
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
      await reloadData();
    } catch (error: any) {
      console.error("Error joining group:", error);
      alert(`Failed to join group: ${error.message || "Unknown error"}`);
    }
  }

  async function toggleOpenJoin() {
    if (!groupAddress || !isAddress(groupAddress)) {
      console.error("Invalid group address");
      return;
    }

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
    if (!groupAddress || !isAddress(groupAddress)) {
      console.error("Invalid group address");
      return;
    }

    try {
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
      }, 2000);
    } catch (error: any) {
      console.error("Error upgrading capacity:", error);
      alert(`Failed to upgrade capacity: ${error.message || "Unknown error"}`);
    }
  }

  useEffect(() => {
    fetchGroupDetails();
    balanceRefetch();
  }, [publicClient, id]);

  useEffect(() => {
    if (isConnected && address && group != null) {
      checkMembership();
    }
  }, [isConnected, address, group]);

  // Hitung prize amount
  const prizeAmount = currentPeriod 
    ? (BigInt(currentPeriod.contributionAmountInWei) * BigInt(currentPeriod.prizePercentage)) / BigInt(100)
    : BigInt(0);

  // Default payment amount
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaymentModal(false)}
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
                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#4f7a97] mb-2">
                  {isCoordinator ? "Coordinator Payment" : "Member Payment"}
                </h2>
                <p className="text-[#5c6c74] mb-6">
                  {isCoordinator 
                    ? "As coordinator, you must contribute to start the period" 
                    : "Contribute your share to participate in this period"
                  }
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

                <div className="mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <p className="text-sm text-[#5c6c74] mb-2">You will pay:</p>
                    <p className="text-2xl font-bold text-[#4f7a97]">{defaultPaymentAmount} ETH</p>
                    <p className="text-xs text-[#5c6c74] mt-2">
                      Amount cannot be changed
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 dark:text-blue-300 text-left">
                      {isCoordinator
                        ? "As coordinator, your payment is required to start the period. All members must also contribute to participate."
                        : "Your payment is required to participate in this period. The coordinator must also contribute to start the period."
                      }
                    </p>
                  </div>
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
                    {isPaying ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      'Confirm Payment'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draw Winner Modal */}
      <AnimatePresence>
        {showDrawWinnerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDrawWinnerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Modal */}
              {lastWinner && (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-[#eeb446] to-[#d9a33f] rounded-full flex items-center justify-center mb-4"
                  >
                    <Trophy className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#4f7a97] mb-2">Winner Drawn!</h2>
                  <p className="text-[#5c6c74] mb-6">Congratulations to the winner</p>
                  
                  <div className="bg-[#eeb446]/10 border border-[#eeb446]/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-[#5c6c74] mb-2">Winner</p>
                    <p className="text-xl font-bold text-[#4f7a97] mb-1">{lastWinner.telegramUsername}</p>
                    <p className="text-xs text-[#5c6c74] font-mono">{lastWinner.walletAddress.slice(0, 6)}...{lastWinner.walletAddress.slice(-4)}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setLastWinner(null);
                      setShowDrawWinnerModal(false);
                    }}
                    className="w-full py-3 px-6 bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold rounded-lg transition-colors"
                  >
                    Back to Group
                  </button>
                </div>
              )}

              {/* Draw Winner Interface */}
              {!lastWinner && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-[#eeb446] to-[#d9a33f] rounded-xl">
                        <Trophy size={32} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-[#4f7a97]">Draw Winner</h2>
                        <p className="text-[#5c6c74]">Select a winner for this round</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDrawWinnerModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <XCircle size={24} className="text-[#5c6c74]" />
                    </button>
                  </div>

                  {!isPeriodOngoing ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                        No Active Period
                      </h3>
                      <p className="text-yellow-600 dark:text-yellow-300 mb-6">
                        There is no ongoing period to draw winners from
                      </p>
                      
                      {isCoordinator && (
                        <motion.button
                          onClick={handleStartNewPeriod}
                          disabled={isPaying}
                          className="py-3 px-6 bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isPaying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Starting Period...
                            </>
                          ) : (
                            <>
                              <Play size={20} />
                              Start New Period
                            </>
                          )}
                        </motion.button>
                      )}
                      
                      {!isCoordinator && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Please ask the coordinator to start a new period
                          </p>
                          <motion.button
                            onClick={() => setShowPaymentModal(true)}
                            className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Wallet size={20} />
                            Pay Contribution ({defaultPaymentAmount} ETH)
                          </motion.button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {currentPeriod && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <Users size={18} />
                              <span className="text-sm font-medium">Eligible Winners</span>
                            </div>
                            <p className="text-2xl font-bold">{Number(currentPeriod.dueWinnersCount)}</p>
                          </div>

                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <Coins size={18} />
                              <span className="text-sm font-medium">Prize Amount</span>
                            </div>
                            <p className="text-2xl font-bold">{formatEther(prizeAmount)} ETH</p>
                          </div>

                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <Clock size={18} />
                              <span className="text-sm font-medium">Rounds Completed</span>
                            </div>
                            <p className="text-2xl font-bold">{Number(currentPeriod.roundsCount)}</p>
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#4f7a97] mb-4">Eligible Participants</h3>
                        {dueWinners.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {dueWinners.map((winner, index) => (
                              <motion.div
                                key={winner.walletAddress}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-muted/30 border border-[#4f7a97]/10 rounded-lg p-4 flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-semibold text-[#4f7a97]">{winner.telegramUsername}</p>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {winner.walletAddress.slice(0, 10)}...{winner.walletAddress.slice(-8)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {winner.isActiveVoter && (
                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                                      Active
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/30 rounded-lg">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No eligible participants for this round</p>
                          </div>
                        )}
                      </div>

                      {dueWinners.length > 0 && (
                        <motion.button
                          onClick={handleDrawWinner}
                          disabled={isDrawing || dueWinners.length === 0}
                          className="w-full py-4 px-6 bg-gradient-to-r from-[#eeb446] to-[#d9a33f] hover:from-[#d9a33f] hover:to-[#c9933f] text-white font-bold text-lg rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isDrawing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Drawing Winner...
                            </>
                          ) : (
                            <>
                              <Sparkles size={24} />
                              Draw Winner Now
                            </>
                          )}
                        </motion.button>
                      )}

                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-900 dark:text-blue-300">
                            <p className="font-semibold mb-1">How it works:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              <li>Winner is selected randomly from eligible participants</li>
                              <li>The winner receives {currentPeriod ? Number(currentPeriod.prizePercentage) : 0}% of contributions</li>
                              <li>Transaction will be processed on the blockchain</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Capacity Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-[#2a3a45] rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-[#eeb446]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#eeb446] rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#4f7a97] mb-2">Upgrade Group Capacity</h2>
                <p className="text-[#5c6c74] mb-6">
                  Increase your group's maximum capacity to accommodate more members
                </p>
                
                <div className="bg-[#eeb446]/10 border border-[#eeb446]/30 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5c6c74] font-medium">Current Capacity:</span>
                    <span className="text-lg font-bold text-[#4f7a97]">{maxCapacity} members</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5c6c74] font-medium">Next Tier:</span>
                    <span className="text-lg font-bold text-[#eeb446]">{nextCapacityTier} members</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#eeb446]/20">
                    <span className="text-sm text-[#5c6c74] font-medium">Upgrade Cost:</span>
                    <span className="text-xl font-bold text-[#4f7a97]">
                      {formatEther(capacityUpgradeCost)} ETH
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-300 text-left">
                    The upgrade cost will be sent to the platform wallet. This is a one-time payment for each capacity tier.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgradeCapacity}
                    disabled={isPending}
                    className="flex-1 py-3 px-6 bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" />
                          <path d="M4 12a8 8 0 018-8" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Processing...
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

      <main className="container mx-auto px-4 py-8">
        <motion.button
          onClick={() => router.push("/")}
          className="flex pe-8 py-3 items-center rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={18} className="me-4" />
          Back to groups
        </motion.button>

        {pendingProposalsCount > 0 && isMember && !group.settings.openJoinEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
                <p className="text-xs md:text-start text-center">
                  Group ID: {id}
                </p>
              </div>
            </div>
          </div>

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
              {isCapacityNearFull && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        isCapacityFull 
                          ? 'bg-red-500' 
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {capacityPercentage.toFixed(0)}% capacity used
                  </p>
                </div>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Coins size={18} />
                <span className="text-sm font-medium">Contribution</span>
              </div>
              <p className="text-2xl font-semibold">
                {group.settings.contributionAmount
                  ? `${group.settings.contributionAmount / 1e18} ETH`
                  : "N/A"}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Percent size={18} />
                <span className="text-sm font-medium">
                  Coordinator Commission Percentage
                </span>
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
                  {balanceData?.value ? formatEther(balanceData.value) : "0"}{" "}
                  ETH
                </p>
              ) : (
                <div className="animate-pulse space-y-2">
                  <div className="w-32 h-8 bg-gray-300 rounded"></div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About This Group</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This is a TrustArisan group where members contribute{" "}
                {group.settings.contributionAmount / 1e18} ETH per cycle. The
                coordinator takes a{" "}
                {group.settings.coordinatorCommissionPercentage}% commission,
                and the prize pool is {group.settings.prizePercentage}% of the
                total contributions. Commission is subject to 5% platform fee.
              </p>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-[#eeb446]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border border-[hsl(var(--foreground))]/20 p-6 shadow-sm mt-6"
        >
          <div>
            <div className="flex space-y-4">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isCoordinator && (
                  <>
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                      <div className="bg-muted/50 rounded-xl p-4 border border-[hsl(var(--foreground))]/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2.5 rounded-lg transition-colors ${
                                group.settings.openJoinEnabled
                                  ? "bg-emerald-100"
                                  : "bg-muted"
                              }`}
                            >
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
                            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              group.settings.openJoinEnabled
                                ? "bg-emerald-500 focus:ring-emerald-500"
                                : 'bg-slate-400 focus:ring-slate-400'
                            } ${
                              isPending
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                              animate={{
                                x: group.settings.openJoinEnabled ? 28 : 0,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          </motion.button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[hsl(var(--foreground))]/10">
                          <div
                            className={`text-xs font-medium px-3 py-2 rounded-lg ${
                              group.settings.openJoinEnabled
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                                : "bg-muted text-muted-foreground border border-[hsl(var(--foreground))]/10"
                            }`}
                          >
                            {group.settings.openJoinEnabled ? (
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span>
                                  Group is open - Anyone can join immediately
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                                <span>
                                  Group is closed - Join requests need approval
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                      <div className={`bg-muted/50 rounded-xl p-4 border ${
                        isCapacityNearFull 
                          ? 'border-[#eeb446]/50 bg-[#eeb446]/5' 
                          : 'border-[hsl(var(--foreground))]/10'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2.5 rounded-lg ${
                              isCapacityNearFull 
                                ? 'bg-[#eeb446]/20' 
                                : 'bg-muted'
                            }`}>
                              <TrendingUp className={`w-5 h-5 ${
                                isCapacityNearFull 
                                  ? 'text-[#eeb446]' 
                                  : 'text-muted-foreground'
                              }`} />
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
                                Current: {maxCapacity} members | Next tier: {nextCapacityTier} members
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Upgrade cost: <span className="font-semibold text-[#4f7a97]">
                                  {formatEther(capacityUpgradeCost)} ETH
                                </span>
                              </p>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => setShowUpgradeModal(true)}
                            disabled={isPending}
                            className="px-4 py-2 rounded-lg bg-[#5584a0] hover:bg-[#4f7a97] text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Upgrade
                          </motion.button>
                        </div>

                        {isCapacityNearFull && (
                          <div className="mt-4 pt-4 border-t border-[#eeb446]/20">
                            <div className="flex items-start gap-2 text-xs text-[#5c6c74] bg-[#eeb446]/10 border border-[#eeb446]/20 rounded-lg p-3">
                              <AlertCircle className="w-4 h-4 text-[#eeb446] shrink-0 mt-0.5" />
                              <p>
                                {isCapacityFull 
                                  ? 'Your group has reached maximum capacity. Upgrade now to accept new members.'
                                  : 'Your group is near capacity. Consider upgrading to avoid reaching the limit.'
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {isMember && (
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
                
                <motion.button
                  onClick={handleJoinGroup}
                  className={
                    (isConnected && !isMember
                      ? ""
                      : "text-[hsl(var(--foreground))]/25 bg-gray-600/20 ") +
                    "flex flex-initial justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md "
                  }
                  whileHover={isConnected && !isMember ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isConnected || isMember}
                >
                  <UsersRound className="me-2 font-thin px-0.5" /> Join Group
                </motion.button>
                
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

                    {isCoordinator && (
                      <motion.button
                        onClick={handleOpenDrawWinner}
                        className="flex grow justify-center px-5 py-3 rounded-full bg-gradient-to-r from-[#eeb446] to-[#d9a33f] text-white font-medium text-md hover:from-[#d9a33f] hover:to-[#c9933f] transition-colors border border-[#eeb446]/20 shadow-sm hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trophy className="me-2 font-thin px-0.5" /> Draw Winner
                      </motion.button>
                    )}

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
                    <MessageCircleMore className="me-2 font-thin px-0.5" /> Join
                    Chat
                  </motion.button>
                </Link>
                
                <motion.button
                  type="button"
                  onClick={reloadData}
                  className="flex flex-initial justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="me-2 font-thin px-0.5" /> Reload Data
                </motion.button>
                
                <ThemeToggle unhideText={true} />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}