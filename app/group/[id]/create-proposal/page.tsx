"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, isAddress, parseEther } from "viem";
import { GROUP_ABI } from "@/app/utils/TrustArisanGroupABI";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Edit3,
  Link2,
  UserCog,
  Percent,
  Coins,
  HandCoins,
  Users,
  Send,
  AlertCircle,
  UserX,
} from "lucide-react";
import ThemeToggle from "@/app/components/ThemeToggle";

enum ProposalType {
  NEW_TITLE = "NEW_TITLE",
  NEW_TELEGRAM_URL = "NEW_TELEGRAM_URL",
  NEW_COORDINATOR = "NEW_COORDINATOR",
  NEW_COMMISSION = "NEW_COMMISSION",
  NEW_CONTRIBUTION = "NEW_CONTRIBUTION",
  NEW_PRIZE = "NEW_PRIZE",
  NEW_MEMBER = "NEW_MEMBER",
  KICK_MEMBER = "KICK_MEMBER",
  TRANSFER = "TRANSFER",
}

const PROPOSAL_OPTIONS = [
  {
    type: ProposalType.NEW_TITLE,
    name: "Change Group Title",
    description: "Propose a new name for the group",
    icon: Edit3,
    color: "blue",
  },
  {
    type: ProposalType.NEW_TELEGRAM_URL,
    name: "Change Telegram URL",
    description: "Update the group's Telegram link",
    icon: Link2,
    color: "cyan",
  },
  {
    type: ProposalType.NEW_COORDINATOR,
    name: "Change Coordinator",
    description: "Propose a new group coordinator",
    icon: UserCog,
    color: "purple",
  },
  {
    type: ProposalType.NEW_COMMISSION,
    name: "Change Commission %",
    description: "Adjust coordinator commission percentage",
    icon: Percent,
    color: "orange",
  },
  {
    type: ProposalType.NEW_CONTRIBUTION,
    name: "Change Contribution Amount",
    description: "Modify the required contribution",
    icon: Coins,
    color: "green",
  },
  {
    type: ProposalType.NEW_PRIZE,
    name: "Change Prize %",
    description: "Adjust the prize pool percentage",
    icon: HandCoins,
    color: "yellow",
  },
  {
    type: ProposalType.NEW_MEMBER,
    name: "Add New Member",
    description: "Propose a new member to join",
    icon: Users,
    color: "emerald",
  },
  {
    type: ProposalType.KICK_MEMBER,
    name: "Kick Member",
    description: "Propose to remove a member from group",
    icon: UserX,
    color: "red",
  },
  {
    type: ProposalType.TRANSFER,
    name: "Transfer Funds",
    description: "Propose transferring group funds",
    icon: Send,
    color: "pink",
  },
];

export default function CreateProposalPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [selectedType, setSelectedType] = useState<ProposalType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const groupAddress =
    id && typeof id === "string" && isAddress(id) ? (id as Address) : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!groupAddress || !selectedType) return;

    try {
      setError(null);

      switch (selectedType) {
        case ProposalType.NEW_TITLE:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeNewTitle",
            args: [formData.newTitle],
          });
          break;

        case ProposalType.NEW_TELEGRAM_URL:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeNewTelegramGroupUrl",
            args: [formData.newUrl],
          });
          break;

        case ProposalType.NEW_COORDINATOR:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeNewCoordinator",
            args: [formData.coordinatorAddress],
          });
          break;

        case ProposalType.NEW_COMMISSION:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeNewCoordinatorCommissionPercentage",
            args: [BigInt(formData.commission)],
          });
          break;

        case ProposalType.NEW_CONTRIBUTION:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeNewContributionAmountInWei",
            args: [parseEther(formData.contribution)],
          });
          break;

        case ProposalType.NEW_PRIZE:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeNewPrizePercentage",
            args: [BigInt(formData.prize)],
          });
          break;

        case ProposalType.NEW_MEMBER:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeNewMember",
            args: [formData.memberAddress, formData.telegramUsername],
          });
          break;

        case ProposalType.KICK_MEMBER:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeKickMember",
            args: [formData.kickMemberAddress],
          });
          break;

        case ProposalType.TRANSFER:
          await writeContractAsync({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: "proposeTransfer",
            args: [formData.recipient, parseEther(formData.amount)],
          });
          break;

        default:
          throw new Error("Invalid proposal type");
      }

      console.log("Proposal created successfully");
      
      setTimeout(() => {
        router.push(`/group/${id}/proposals`);
      }, 2000);

    } catch (err: any) {
      console.error("Error creating proposal:", err);
      setError(err.message || "Failed to create proposal");
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Connect Wallet</h1>
            <p className="text-muted-foreground">
              Please connect your wallet to create a proposal
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedOption = PROPOSAL_OPTIONS.find(opt => opt.type === selectedType);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.button
          onClick={() => selectedType ? setSelectedType(null) : router.push(`/group/${id}`)}
          className="flex pe-8 py-3 items-center rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors mb-6"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={18} className="me-4" />
          {selectedType ? "Back to Selection" : "Back to Group"}
        </motion.button>

        {!selectedType ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Create Proposal</h1>
            <p className="text-muted-foreground mb-8">
              Choose the type of proposal you want to create
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROPOSAL_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                return (
                  <motion.button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className="bg-card rounded-xl border border-[hsl(var(--foreground))]/20 p-6 text-left hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-3 rounded-lg bg-${option.color}-100 dark:bg-${option.color}-950/30 inline-block mb-3`}>
                      <IconComponent className={`w-6 h-6 text-${option.color}-600 dark:text-${option.color}-400`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{option.name}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-[#4f7a97]/10 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              {selectedOption && (
                <>
                  <div className={`p-3 rounded-lg bg-${selectedOption.color}-100 dark:bg-${selectedOption.color}-950/30`}>
                    <selectedOption.icon className={`w-6 h-6 text-${selectedOption.color}-600 dark:text-${selectedOption.color}-400`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedOption.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedOption.description}</p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900 dark:text-red-300">
                  <p className="font-semibold mb-1">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedType === ProposalType.NEW_TITLE && (
                <div>
                  <label className="block text-sm font-medium mb-2">New Title</label>
                  <input
                    type="text"
                    required
                    value={formData.newTitle || ""}
                    onChange={(e) => setFormData({ ...formData, newTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                    placeholder="Enter new group title"
                  />
                </div>
              )}

              {selectedType === ProposalType.NEW_TELEGRAM_URL && (
                <div>
                  <label className="block text-sm font-medium mb-2">New Telegram URL</label>
                  <input
                    type="url"
                    required
                    value={formData.newUrl || ""}
                    onChange={(e) => setFormData({ ...formData, newUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                    placeholder="https://t.me/groupname"
                  />
                </div>
              )}

              {selectedType === ProposalType.NEW_COORDINATOR && (
                <div>
                  <label className="block text-sm font-medium mb-2">New Coordinator Address</label>
                  <input
                    type="text"
                    required
                    value={formData.coordinatorAddress || ""}
                    onChange={(e) => setFormData({ ...formData, coordinatorAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                    placeholder="0x..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The new coordinator must be an existing member
                  </p>
                </div>
              )}

              {selectedType === ProposalType.NEW_COMMISSION && (
                <div>
                  <label className="block text-sm font-medium mb-2">Commission Percentage (5-50%)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="50"
                    value={formData.commission || ""}
                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                    placeholder="10"
                  />
                </div>
              )}

              {selectedType === ProposalType.NEW_CONTRIBUTION && (
                <div>
                  <label className="block text-sm font-medium mb-2">Contribution Amount (ETH)</label>
                  <input
                    type="number"
                    required
                    step="0.000000000000000001"
                    min="0"
                    value={formData.contribution || ""}
                    onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                    placeholder="0.001"
                  />
                </div>
              )}

              {selectedType === ProposalType.NEW_PRIZE && (
                <div>
                  <label className="block text-sm font-medium mb-2">Prize Percentage (1-100%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.prize || ""}
                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                    placeholder="80"
                  />
                </div>
              )}

              {selectedType === ProposalType.NEW_MEMBER && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Member Address</label>
                    <input
                      type="text"
                      required
                      value={formData.memberAddress || ""}
                      onChange={(e) => setFormData({ ...formData, memberAddress: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telegram Username</label>
                    <input
                      type="text"
                      required
                      value={formData.telegramUsername || ""}
                      onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                      placeholder="@username"
                    />
                  </div>
                </>
              )}

              {selectedType === ProposalType.KICK_MEMBER && (
                <div>
                  <label className="block text-sm font-medium mb-2">Member Address to Kick</label>
                  <input
                    type="text"
                    required
                    value={formData.kickMemberAddress || ""}
                    onChange={(e) => setFormData({ ...formData, kickMemberAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                    placeholder="0x..."
                  />
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-900 dark:text-red-300">
                        <strong>Warning:</strong> You cannot kick yourself or the coordinator. This action requires majority approval.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedType === ProposalType.TRANSFER && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Address</label>
                    <input
                      type="text"
                      required
                      value={formData.recipient || ""}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
                    <input
                      type="number"
                      required
                      step="0.000000000000000001"
                      min="0"
                      value={formData.amount || ""}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-[#648196]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5584a0]"
                      placeholder="0.1"
                    />
                  </div>
                </>
              )}

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>Note:</strong> This proposal will require majority approval from active voters before it can be executed.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 rounded-lg bg-[#5584a0] hover:bg-[#4f7a97] text-white font-semibold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating Proposal..." : "Create Proposal"}
              </button>
            </form>
          </motion.div>
        )}
      </main>

      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle unhideText={true} />
      </div>
    </div>
  );
}