"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  usePublicClient,
  useAccount,
  useWriteContract,
} from "wagmi";
import { Address, isAddress, formatEther } from "viem";
import { GROUP_ABI } from "@/app/utils/TrustArisanGroupABI";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle,
  Clock,
  Users,
  Vote,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  UserCog,
  Edit3,
  Link2,
  Percent,
  Coins,
  HandCoins,
  Send,
  Filter,
} from "lucide-react";
import ThemeToggle from "@/app/components/ThemeToggle";
import Loading from "@/app/components/Loading";

// Proposal Category Enum (from smart contract)
enum ProposalCategory {
  NEW_TITLE = 0,
  NEW_TELEGRAM_GROUP_URL = 1,
  NEW_COORDINATOR = 2,
  NEW_COORDINATOR_COMMISSION_PERCENTAGE = 3,
  NEW_CONTRIBUTION_AMOUNT = 4,
  NEW_PRIZE_PERCENTAGE = 5,
  NEW_MEMBER = 6,
  TRANSFER = 7,
}

// Category metadata
const CATEGORY_INFO = {
  [ProposalCategory.NEW_TITLE]: {
    name: "Change Title",
    icon: Edit3,
    color: "blue",
    approveFunction: "approveNewTitleProposal",
    rejectFunction: "rejectStringProposal",
  },
  [ProposalCategory.NEW_TELEGRAM_GROUP_URL]: {
    name: "Change Telegram URL",
    icon: Link2,
    color: "cyan",
    approveFunction: "approveNewTelegramGroupUrlProposal",
    rejectFunction: "rejectStringProposal",
  },
  [ProposalCategory.NEW_COORDINATOR]: {
    name: "Change Coordinator",
    icon: UserCog,
    color: "purple",
    approveFunction: "approveNewCoordinatorProposal",
    rejectFunction: "rejectNewCoordinatorProposal",
  },
  [ProposalCategory.NEW_COORDINATOR_COMMISSION_PERCENTAGE]: {
    name: "Change Commission %",
    icon: Percent,
    color: "orange",
    approveFunction: "approveNewCoordinatorCommissionPercentageProposal",
    rejectFunction: "rejectUintProposal",
  },
  [ProposalCategory.NEW_CONTRIBUTION_AMOUNT]: {
    name: "Change Contribution",
    icon: Coins,
    color: "green",
    approveFunction: "approveContributionAmountProposal",
    rejectFunction: "rejectUintProposal",
  },
  [ProposalCategory.NEW_PRIZE_PERCENTAGE]: {
    name: "Change Prize %",
    icon: HandCoins,
    color: "yellow",
    approveFunction: "approvePrizePercentageProposal",
    rejectFunction: "rejectUintProposal",
  },
  [ProposalCategory.NEW_MEMBER]: {
    name: "New Member",
    icon: Users,
    color: "emerald",
    approveFunction: "approveNewMemberProposal",
    rejectFunction: "rejectNewMemberProposal",
  },
  [ProposalCategory.TRANSFER]: {
    name: "Transfer Funds",
    icon: Send,
    color: "red",
    approveFunction: "approveTransferProposal",
    rejectFunction: "rejectTransferProposal",
  },
};

interface Proposal {
  index: number;
  category: ProposalCategory;
  proposedAt: bigint;
  proposer: {
    walletAddress: string;
    telegramUsername: string;
    isActiveVoter: boolean;
    latestPeriodParticipation: bigint;
  };
  completedAt: bigint;
  isApproved: boolean;
  approversCount: bigint;
  stringProposalValue?: string;
  uintProposalValue?: bigint;
  coordinatorProposalValue?: {
    walletAddress: string;
    telegramUsername: string;
    isActiveVoter: boolean;
    latestPeriodParticipation: bigint;
  };
  newMemberProposalValue?: {
    memberAddress: string;
    telegramUsername: string;
  };
  transferProposalValue?: {
    recipient: string;
    transferAmount: bigint;
  };
}

export default function UniversalProposalsPage() {
  const { id } = useParams();
  const router = useRouter();
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [hasVoted, setHasVoted] = useState<Record<number, boolean>>({});
  const [activeVotersCount, setActiveVotersCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<ProposalCategory | "ALL">("ALL");
  
  const {
    writeContractAsync,
    isPending,
  } = useWriteContract();

  const groupAddress =
    id && typeof id === "string" && isAddress(id) ? (id as Address) : undefined;

  // Get proposal value display
  function getProposalValue(proposal: Proposal): string {
    try {
      switch (proposal.category) {
        case ProposalCategory.NEW_TITLE:
        case ProposalCategory.NEW_TELEGRAM_GROUP_URL:
          return proposal.stringProposalValue || "";
        
        case ProposalCategory.NEW_COORDINATOR:
          return `${proposal.coordinatorProposalValue?.telegramUsername || ""} (${proposal.coordinatorProposalValue?.walletAddress || ""})`;
        
        case ProposalCategory.NEW_COORDINATOR_COMMISSION_PERCENTAGE:
        case ProposalCategory.NEW_PRIZE_PERCENTAGE:
          return `${proposal.uintProposalValue?.toString() || "0"}%`;
        
        case ProposalCategory.NEW_CONTRIBUTION_AMOUNT:
          return `${formatEther(proposal.uintProposalValue || BigInt(0))} ETH`;
        
        case ProposalCategory.NEW_MEMBER:
          return `${proposal.newMemberProposalValue?.telegramUsername || ""} (${proposal.newMemberProposalValue?.memberAddress || ""})`;
        
        case ProposalCategory.TRANSFER:
          return `${formatEther(proposal.transferProposalValue?.transferAmount || BigInt(0))} ETH to ${proposal.transferProposalValue?.recipient || ""}`;
        
        default:
          return "Unknown";
      }
    } catch (e) {
      console.error("Error formatting proposal value:", e);
      return "Error displaying value";
    }
  }

  async function fetchProposals() {
    if (!publicClient || !groupAddress) {
      console.log("Missing publicClient or groupAddress");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching proposals for group:", groupAddress);

      // Strategy: Try to get all proposals by their actual indices
      // First, get total incomplete proposals count
      const incompleteCount = await publicClient.readContract({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: "getIncompleteProposalsCount",
      });

      console.log("Incomplete proposals count:", Number(incompleteCount));

      if (Number(incompleteCount) === 0) {
        console.log("No incomplete proposals");
        setProposals([]);
        setFilteredProposals([]);
        setIsLoading(false);
        return;
      }

      // Method 1: Try fetching by array index (0 to count-1)
      const proposalsData = [];
      let fetchSuccess = false;

      // Try array-based indexing first
      for (let i = 0; i < Number(incompleteCount); i++) {
        try {
          console.log(`Trying to fetch incomplete proposal at array index ${i}...`);
          const proposal = await publicClient.readContract({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "getIncompleteProposalByIndex",
            args: [BigInt(i)],
          });
          proposalsData.push(proposal);
          fetchSuccess = true;
          console.log(`✓ Successfully fetched proposal at array index ${i}`, proposal);
        } catch (err: any) {
          console.log(`✗ Array index ${i} failed:`, err.message);
          break; // If first one fails, try different approach
        }
      }

      // If array-based failed, try proposal-based indexing (check actual proposal indices)
      if (!fetchSuccess || proposalsData.length === 0) {
        console.log("Array indexing failed, trying proposal ID indexing...");
        proposalsData.length = 0; // Clear array
        
        // Try a range of proposal IDs (proposals might have gaps in their IDs)
        // Assuming proposals are created sequentially, we'll try up to ID 100
        let foundCount = 0;
        for (let proposalId = 0; proposalId < 100 && foundCount < Number(incompleteCount); proposalId++) {
          try {
            const proposal = await publicClient.readContract({
              address: groupAddress,
              abi: GROUP_ABI,
              functionName: "getProposalByIndex",
              args: [BigInt(proposalId)],
            });
            
            // Check if proposal is incomplete (completedAt = 0)
            if (proposal.completedAt === BigInt(0)) {
              proposalsData.push(proposal);
              foundCount++;
              console.log(`✓ Found incomplete proposal with ID ${proposalId}`);
            }
          } catch (err) {
            // Proposal ID doesn't exist, continue
            continue;
          }
        }
      }

      if (proposalsData.length === 0) {
        throw new Error("Could not fetch any proposals. The proposals might have been completed or there's an indexing issue.");
      }

      console.log(`Successfully fetched ${proposalsData.length} proposal(s)`);


      console.log("Fetched proposals data:", proposalsData);
      
      const formattedProposals = proposalsData.map((p: any) => ({
        index: Number(p.index),
        category: p.category,
        proposedAt: p.proposedAt,
        proposer: p.proposer,
        completedAt: p.completedAt,
        isApproved: p.isApproved,
        approversCount: p.approversCount,
        stringProposalValue: p.stringProposalValue,
        uintProposalValue: p.uintProposalValue,
        coordinatorProposalValue: p.coordinatorProposalValue,
        newMemberProposalValue: p.newMemberProposalValue,
        transferProposalValue: p.transferProposalValue,
      }));

      setProposals(formattedProposals);
      setFilteredProposals(formattedProposals);

      // Check voting status for current user
      if (address) {
        try {
          const votingStatus: Record<number, boolean> = {};
          for (const proposal of formattedProposals) {
            const voted = await publicClient.readContract({
              address: groupAddress,
              abi: GROUP_ABI,
              functionName: "hasVotedOnProposal",
              args: [BigInt(proposal.index), address],
            });
            votingStatus[proposal.index] = Boolean(voted);
          }
          setHasVoted(votingStatus);
        } catch (e) {
          console.error("Error checking voting status:", e);
          // Continue even if voting status check fails
        }
      }

      // Get active voters count
      try {
        const votersCount = await publicClient.readContract({
          address: groupAddress,
          abi: GROUP_ABI,
          functionName: "getActiveVotersCount",
        });
        setActiveVotersCount(Number(votersCount));
      } catch (e) {
        console.error("Error fetching active voters count:", e);
        setActiveVotersCount(1); // Default to 1 to avoid division by zero
      }

    } catch (e: any) {
      console.error("Error fetching proposals:", e);
      const errorMessage = e?.message || e?.toString() || "Failed to load proposals";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkMembership() {
    if (!publicClient || !address || !groupAddress) {
      setIsMember(false);
      return;
    }

    try {
      const memberStatus = await publicClient.readContract({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: "isMember",
        args: [address],
      });
      setIsMember(Boolean(memberStatus));
      console.log("Membership status:", Boolean(memberStatus));
    } catch (error) {
      console.error("Error checking membership:", error);
      setIsMember(false);
    }
  }

  async function handleVote(proposalIndex: number, category: ProposalCategory, isApprove: boolean) {
    if (!groupAddress) return;

    const categoryInfo = CATEGORY_INFO[category];
    const functionName = isApprove ? categoryInfo.approveFunction : categoryInfo.rejectFunction;

    try {
      await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: functionName as any,
        args: [BigInt(proposalIndex)],
      });

      console.log(`${isApprove ? 'Approve' : 'Reject'} vote submitted`);
      
      // Refresh proposals after voting
      setTimeout(async () => {
        await fetchProposals();
      }, 3000);
    } catch (error: any) {
      console.error(`Error ${isApprove ? 'approving' : 'rejecting'} proposal:`, error);
      alert(`Failed to ${isApprove ? 'approve' : 'reject'}: ${error.message || "Unknown error"}`);
    }
  }

  // Filter proposals
  useEffect(() => {
    if (selectedFilter === "ALL") {
      setFilteredProposals(proposals);
    } else {
      setFilteredProposals(proposals.filter(p => p.category === selectedFilter));
    }
  }, [selectedFilter, proposals]);

  useEffect(() => {
    if (publicClient && groupAddress) {
      fetchProposals();
    }
  }, [publicClient, groupAddress]);

  useEffect(() => {
    if (isConnected && address && publicClient && groupAddress) {
      checkMembership();
    }
  }, [isConnected, address, publicClient, groupAddress]);

  if (!groupAddress) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive dark:text-destructive-foreground p-4 rounded-lg">
            Invalid group address
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Header />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.button
            onClick={() => router.push(`/group/${id}`)}
            className="flex pe-8 py-3 items-center rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors mb-6"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} className="me-4" />
            Back to Group
          </motion.button>

          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Failed to Load Proposals
                </h3>
                <p className="text-sm text-destructive/90 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchProposals();
                  }}
                  className="px-4 py-2 bg-[#5584a0] hover:bg-[#4f7a97] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const requiredVotes = Math.floor(activeVotersCount / 2) + 1;

  // Count proposals by category
  const categoryCounts = proposals.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => router.push(`/group/${id}`)}
            className="flex pe-8 py-3 items-center rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} className="me-4" />
            Back to Group
          </motion.button>

          {isMember && (
            <motion.button
              onClick={() => router.push(`/group/${id}/create-proposal`)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#5584a0] hover:bg-[#4f7a97] text-white font-medium text-md transition-colors shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <Vote size={18} />
              Create Proposal
            </motion.button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border border-[#4f7a97]/10 p-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[#eeb446]/10">
              <Vote className="w-6 h-6 text-[#eeb446]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">All Proposals</h1>
              <p className="text-sm text-muted-foreground">
                Vote on pending group proposals
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock size={18} />
                <span className="text-sm font-medium">Total Pending</span>
              </div>
              <p className="text-2xl font-semibold">{proposals.length}</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users size={18} />
                <span className="text-sm font-medium">Active Voters</span>
              </div>
              <p className="text-2xl font-semibold">{activeVotersCount}</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Required Votes</span>
              </div>
              <p className="text-2xl font-semibold">{requiredVotes}</p>
              <p className="text-xs text-muted-foreground mt-1">
                (Majority: {requiredVotes}/{activeVotersCount})
              </p>
            </div>
          </div>
        </motion.div>

        {!isMember && isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900 dark:text-yellow-300">
              <p className="font-semibold mb-1">You are not a member</p>
              <p>Only group members can vote on proposals.</p>
            </div>
          </motion.div>
        )}

        {/* Filter Section */}
        {proposals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-[#4f7a97]/10 p-4 shadow-sm mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} className="text-muted-foreground" />
              <span className="font-medium">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter("ALL")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === "ALL"
                    ? "bg-[#5584a0] text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All ({proposals.length})
              </button>
              {Object.entries(CATEGORY_INFO).map(([catId, info]) => {
                const count = categoryCounts[Number(catId)] || 0;
                if (count === 0) return null;
                
                const IconComponent = info.icon;
                return (
                  <button
                    key={catId}
                    onClick={() => setSelectedFilter(Number(catId) as ProposalCategory)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedFilter === Number(catId)
                        ? "bg-[#5584a0] text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <IconComponent size={16} />
                    {info.name} ({count})
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {filteredProposals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-[#4f7a97]/10 p-12 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Vote className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Proposals Found</h2>
            <p className="text-muted-foreground">
              {selectedFilter === "ALL" 
                ? "There are currently no pending proposals."
                : `No ${CATEGORY_INFO[selectedFilter].name} proposals at the moment.`
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal, index) => {
              const votesNeeded = requiredVotes - Number(proposal.approversCount);
              const progressPercentage = (Number(proposal.approversCount) / requiredVotes) * 100;
              const userHasVoted = hasVoted[proposal.index];
              const categoryInfo = CATEGORY_INFO[proposal.category];
              const IconComponent = categoryInfo.icon;

              return (
                <motion.div
                  key={proposal.index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-card rounded-xl border border-[#4f7a97]/10 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-${categoryInfo.color}-100 dark:bg-${categoryInfo.color}-950/30`}>
                          <IconComponent className={`w-5 h-5 text-${categoryInfo.color}-600 dark:text-${categoryInfo.color}-400`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            {categoryInfo.name}
                            {userHasVoted && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium">
                                You voted
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Proposed by {proposal.proposer.telegramUsername} • {" "}
                            {new Date(Number(proposal.proposedAt) * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg mt-3">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Proposed Value:</p>
                        <p className="text-sm break-all">{getProposalValue(proposal)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Votes: {Number(proposal.approversCount)} / {requiredVotes}
                      </span>
                      <span className={`font-medium ${
                        votesNeeded <= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-[#4f7a97]'
                      }`}>
                        {votesNeeded <= 0 
                          ? 'Ready to execute!' 
                          : `${votesNeeded} more vote${votesNeeded !== 1 ? 's' : ''} needed`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-[#5584a0] to-[#eeb446] transition-all"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {isMember && !userHasVoted && (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleVote(proposal.index, proposal.category, true)}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ThumbsUp size={18} />
                        Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleVote(proposal.index, proposal.category, false)}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ThumbsDown size={18} />
                        Reject
                      </motion.button>
                    </div>
                  )}

                  {isMember && userHasVoted && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-blue-900 dark:text-blue-300 font-medium">
                        You have already voted on this proposal
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle unhideText={true} />
      </div>
    </div>
  );
}