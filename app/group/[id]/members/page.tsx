'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { Address, isAddress } from 'viem';
import { GROUP_ABI } from '@/app/utils/TrustArisanGroupABI';
import Header from '@/app/components/Header';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Users, Shield, User, Wallet } from 'lucide-react';
import Loading from '@/app/components/Loading';

interface Member {
  walletAddress: Address;
  telegramUsername: string;
  isActiveVoter: boolean;
  latestPeriodParticipation: bigint;
  role: 'coordinator' | 'member';
}

export default function MembersPage() {
  const { id } = useParams();
  const router = useRouter();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const groupAddress = id && typeof id === 'string' ? (isAddress(id) ? id as Address : undefined) : undefined;
  
  const [members, setMembers] = useState<Member[]>([]);
  const [coordinatorAddress, setCoordinatorAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMembers() {
    if (!publicClient || !groupAddress) return;
      
    try {
      setIsLoading(true);
      
      // Fetch group details to get member addresses and coordinator
      const groupDetail = await publicClient.readContract({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'getGroupDetail',
      }) as any;

      const groupSettings = await publicClient.readContract({
        address: groupAddress,
        abi: GROUP_ABI,
        functionName: 'getGroupSettings',
      }) as any;

      const memberAddresses = groupDetail.memberAddresses as Address[];
      const coordinatorAddr = groupSettings.coordinator.walletAddress as Address;
      
      setCoordinatorAddress(coordinatorAddr);

      // Fetch member details for each address
      const memberPromises = memberAddresses.map(async (memberAddr) => {
        try {
          const memberDetail = await publicClient.readContract({
            address: groupAddress,
            abi: GROUP_ABI,
            functionName: 'getMemberByAddress',
            args: [memberAddr]
          }) as any;

          return {
            walletAddress: memberAddr,
            telegramUsername: memberDetail.telegramUsername || 'Unknown',
            isActiveVoter: memberDetail.isActiveVoter,
            latestPeriodParticipation: memberDetail.latestPeriodParticipation,
            role: memberAddr.toLowerCase() === coordinatorAddr.toLowerCase() ? 'coordinator' as const : 'member' as const
          };
        } catch (err) {
          console.error(`Error fetching member ${memberAddr}:`, err);
          return {
            walletAddress: memberAddr,
            telegramUsername: 'Unknown',
            isActiveVoter: false,
            latestPeriodParticipation: BigInt(0),
            role: memberAddr.toLowerCase() === coordinatorAddr.toLowerCase() ? 'coordinator' as const : 'member' as const
          };
        }
      });

      const fetchedMembers = await Promise.all(memberPromises);
      setMembers(fetchedMembers);
      
    } catch (e) {
      console.error('Error fetching members:', e);
      setError('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [publicClient, groupAddress]);

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
          <ChevronLeft size={18} className='me-4'/>
          Back to Group
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border border-[#4f7a97]/10 hover:border-[#4f7a97]/30 hover:shadow-xl transition-all duration-300 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users size={24} className="text-primary" />
            <h1 className="text-2xl font-bold">Group Members</h1>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {members.length} Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Telegram Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Wallet Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Active Voter</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Latest Participation</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr 
                    key={member.walletAddress}
                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                      member.walletAddress.toLowerCase() === address?.toLowerCase() ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {member.role === 'coordinator' ? (
                          <>
                            <Shield size={16} className="text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Coordinator</span>
                          </>
                        ) : (
                          <>
                            <User size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Member</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">
                        {member.telegramUsername || 'Not set'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Wallet size={14} className="text-muted-foreground" />
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {member.walletAddress}
                          {/* {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)} */}
                        </code>
                        {member.walletAddress.toLowerCase() === address?.toLowerCase() && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">(Current)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-sm ${
                        member.isActiveVoter ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`}>
                        {member.isActiveVoter ? '✓ Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {member.latestPeriodParticipation.toString() === '0' 
                          ? 'Never' 
                          : `Period ${member.latestPeriodParticipation.toString()}`
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {members.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No members found in this group.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
