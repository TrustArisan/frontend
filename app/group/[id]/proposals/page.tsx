"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  usePublicClient,
  useAccount,
  useWriteContract,
} from "wagmi";
import { Address, isAddress } from "viem";
import { GROUP_ABI } from "@/app/utils/TrustArisanGroupABI";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Vote,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
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
  newMemberProposalValue?: {
    memberAddress: string;
    telegramUsername: string;
  };
}

export default function ProposalsPage() {
  const { id } = useParams();
  const router = useRouter();
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [hasVoted, setHasVoted] = useState<Record<number, boolean>>({});
  const [activeVotersCount, setActiveVotersCount] = useState(0);
  
  const {
    writeContractAsync,
    isPending,
  } = useWriteContract();

  const groupAddress =
    id && typeof id === "string" && isAddress(id) ? (id as Address) : undefined;

  async function fetchProposals() {
    if (!publicClient || !groupAddress) return;

    try {
      setIsLoading(true);

      // Get incomplete proposals count
      const proposalsCount = await publicClient.readContract({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: "getIncompleteProposalsCount",
      });

      const count = Number(proposalsCount);
      
      if (count === 0) {
        setProposals([]);
        setIsLoading(false);
        return;
      }

      // Fetch all incomplete proposals
      const proposalPromises = [];
      for (let i = 0; i < count; i++) {
        proposalPromises.push(
          publicClient.readContract({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "getIncompleteProposalByIndex",
            args: [BigInt(i)],
          })
        );
      }

      const proposalsData = await Promise.all(proposalPromises);
      
      // Filter only NEW_MEMBER proposals
      const memberProposals = proposalsData
        .map((p: any) => ({
          index: Number(p.index),
          category: p.category,
          proposedAt: p.proposedAt,
          proposer: p.proposer,
          completedAt: p.completedAt,
          isApproved: p.isApproved,
          approversCount: p.approversCount,
          newMemberProposalValue: p.newMemberProposalValue,
        }))
        .filter((p) => p.category === ProposalCategory.NEW_MEMBER);

      setProposals(memberProposals);

      // Check voting status for each proposal if user is connected
      if (address) {
        const votingStatus: Record<number, boolean> = {};
        for (const proposal of memberProposals) {
          const voted = await publicClient.readContract({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "hasVotedOnProposal",
            args: [BigInt(proposal.index), address],
          });
          votingStatus[proposal.index] = Boolean(voted);
        }
        setHasVoted(votingStatus);
      }

      // Get active voters count
      const votersCount = await publicClient.readContract({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: "getActiveVotersCount",
      });
      setActiveVotersCount(Number(votersCount));

    } catch (e) {
      console.error("Error fetching proposals:", e);
      setError("Failed to load proposals");
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
    } catch (error) {
      console.error("Error checking membership:", error);
      setIsMember(false);
    }
  }

  async function handleApprove(proposalIndex: number) {
    if (!groupAddress) return;

    try {
      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: "approveNewMemberProposal",
        args: [BigInt(proposalIndex)],
      });

      console.log("Approve transaction sent:", txHash);
      
      // Wait for confirmation and reload
      setTimeout(async () => {
        await fetchProposals();
      }, 2000);
    } catch (error: any) {
      console.error("Error approving proposal:", error);
      alert(`Failed to approve: ${error.message || "Unknown error"}`);
    }
  }

  async function handleReject(proposalIndex: number) {
    if (!groupAddress) return;

    try {
      const txHash = await writeContractAsync({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: "rejectNewMemberProposal",
        args: [BigInt(proposalIndex)],
      });

      console.log("Reject transaction sent:", txHash);
      
      // Wait for confirmation and reload
      setTimeout(async () => {
        await fetchProposals();
      }, 2000);
    } catch (error: any) {
      console.error("Error rejecting proposal:", error);
      alert(`Failed to reject: ${error.message || "Unknown error"}`);
    }
  }

  useEffect(() => {
    fetchProposals();
  }, [publicClient, groupAddress]);

  useEffect(() => {
    if (isConnected && address) {
      checkMembership();
    }
  }, [isConnected, address, publicClient, groupAddress]);

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
          <div className="bg-destructive/10 border border-destructive/30 text-destructive dark:text-destructive-foreground p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Calculate required votes (majority = more than 50%)
  const requiredVotes = Math.floor(activeVotersCount / 2) + 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.button
          onClick={() => router.push(`/group/${id}`)}
          className="flex pe-8 py-3 items-center rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors mb-6"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={18} className="me-4" />
          Back to Group
        </motion.button>

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
              <h1 className="text-2xl font-bold">Join Requests</h1>
              <p className="text-sm text-muted-foreground">
                Vote on pending membership proposals
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock size={18} />
                <span className="text-sm font-medium">Pending Proposals</span>
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
              <p>Only group members can vote on join requests.</p>
            </div>
          </motion.div>
        )}

        {proposals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-[#4f7a97]/10 p-12 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Pending Requests</h2>
            <p className="text-muted-foreground">
              There are currently no join requests waiting for approval.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, index) => {
              const votesNeeded = requiredVotes - Number(proposal.approversCount);
              const progressPercentage = (Number(proposal.approversCount) / requiredVotes) * 100;
              const userHasVoted = hasVoted[proposal.index];

              return (
                <motion.div
                  key={proposal.index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card rounded-xl border border-[#4f7a97]/10 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {proposal.newMemberProposalValue?.telegramUsername}
                        </h3>
                        {userHasVoted && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium">
                            You voted
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Address: {proposal.newMemberProposalValue?.memberAddress}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Proposed by: {proposal.proposer.telegramUsername} • {" "}
                        {new Date(Number(proposal.proposedAt) * 1000).toLocaleDateString()}
                      </p>
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
                          ? 'Ready to approve!' 
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
                        onClick={() => handleApprove(proposal.index)}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ThumbsUp size={18} />
                        Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleReject(proposal.index)}
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