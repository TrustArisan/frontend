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
import { motion } from "framer-motion";
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
  Boxes,
  BadgeCheck,
  Badge,
  List,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Avatar } from "@/app/components/Avatar";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Loading from "@/app/components/Loading";

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
    await fetchGroupDetails(); // Automatically trigger membership check
    await balanceRefetch();
  }

  async function fetchGroupDetails() {
    if (!publicClient || !id) return;

    try {
      setIsLoading(true);

      // Fetch group details
      const [detail, settings, upgradeCost, nextTier] = await Promise.all([
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
      ]);

      setCapacityUpgradeCost(upgradeCost as bigint);
      setNextCapacityTier(Number(nextTier));

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
      // Now check both member and coordinator status
      const [memberStatus] = await Promise.all([
        publicClient.readContract({
          address: groupAddress,
          abi: GROUP_ABI,
          functionName: "isMember",
          args: [address],
        }),
      ]);

      // Since we've ensured group is loaded, we can safely access group.settings
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

  async function handleJoinGroup() {
    if (!groupAddress || !isAddress(groupAddress)) {
      console.error("Invalid group address");
      return;
    }

    // Get telegram username from user (for now, we'll use a placeholder)
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
      });

      console.log(`${functionName} transaction sent:`, txHash);

      // Optionally refetch data after successful join
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
      });

      console.log("Upgrade capacity transaction sent:", txHash);
      setShowUpgradeModal(false);
      
      // Wait a bit for blockchain confirmation then reload
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

  // Check if capacity is near full or full
  const membersCount = Number(group.membersCount || 0);
  const maxCapacity = Number(group.settings.maxCapacity || 0);
  const capacityPercentage = (membersCount / maxCapacity) * 100;
  const isCapacityNearFull = capacityPercentage >= 80;
  const isCapacityFull = membersCount >= maxCapacity;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Upgrade Capacity Modal */}
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowUpgradeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
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

          {/* Add more sections as needed */}
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

          {/* Decorative Element */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-[#eeb446]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border border-[hsl(var(--foreground))]/20 p-6 shadow-sm mt-6"
        >
          <div>
            {/* <h2 className="text-xl font-semibold mb-4">Controls</h2> */}
            <div className="flex space-y-4">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Coordinator Only Group Settings */}
                {/* Open Join Toggle - Coordinator Only */}
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

                    {/* Upgrade Capacity Section - Coordinator Only */}
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
                              <AlertCircle className="w-4 h-4 text-[#eeb446] flex-shrink-0 mt-0.5" />
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
                
                {/* Can only join group when wallet is connected AND not a member */}
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
                {/* View Members */}
                {isMember && (
                  <motion.button
                    onClick={() => router.push(`/group/${id}/members`)}
                    className="flex grow justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <List className="me-2 font-thin px-0.5" /> View Members
                  </motion.button>
                )}
                {/* Redirect to chatroom */}
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
                {/* Refetch data */}
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