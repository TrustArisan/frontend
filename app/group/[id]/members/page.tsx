'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { Address, isAddress } from 'viem';
import { GROUP_ABI } from '@/app/utils/TrustArisanGroupABI';
import Header from '@/app/components/Header';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Users, Shield, User, Wallet, CheckCircle, XCircle } from 'lucide-react';
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
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
            <p className="font-medium">{error}</p>
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
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5584a0] text-white font-bold text-lg hover:bg-[#4f7a97] transition-colors shadow-sm mb-6"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-[#648196]/20 hover:shadow-xl transition-all duration-300 p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#5584a0]/10 rounded-lg">
              <Users size={28} className="text-[#5584a0]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#4f7a97]">Group Members</h1>
              <p className="text-[#5c6c74] text-sm mt-1">View all members in this group</p>
            </div>
            <span className="ml-auto bg-[#5584a0]/10 text-[#5584a0] px-4 py-2 rounded-full text-sm font-semibold">
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#648196]/20">
                  <th className="text-left py-4 px-4 font-semibold text-[#4f7a97]">Role</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#4f7a97]">Telegram Username</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#4f7a97]">Wallet Address</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#4f7a97]">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#4f7a97]">Latest Participation</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <motion.tr
                    key={member.walletAddress}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-[#648196]/10 hover:bg-[#5584a0]/5 transition-colors ${
                      member.walletAddress.toLowerCase() === address?.toLowerCase() ? 'bg-[#eeb446]/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {member.role === 'coordinator' ? (
                          <>
                            <div className="p-1.5 bg-[#eeb446]/10 rounded-lg">
                              <Shield size={18} className="text-[#eeb446]" />
                            </div>
                            <span className="text-sm font-semibold text-[#eeb446]">Coordinator</span>
                          </>
                        ) : (
                          <>
                            <div className="p-1.5 bg-[#5584a0]/10 rounded-lg">
                              <User size={18} className="text-[#5584a0]" />
                            </div>
                            <span className="text-sm font-medium text-[#5c6c74]">Member</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-[#4f7a97]">
                        {member.telegramUsername || 'Not set'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Wallet size={14} className="text-[#5c6c74]" />
                        <code className="text-xs bg-[#5584a0]/5 text-[#5c6c74] px-3 py-1.5 rounded-lg font-mono">
                          {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}
                        </code>
                        {member.walletAddress.toLowerCase() === address?.toLowerCase() && (
                          <span className="text-xs bg-[#eeb446]/10 text-[#eeb446] px-2 py-1 rounded-full font-medium">You</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {member.isActiveVoter ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-medium text-green-600">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <XCircle size={16} className="text-[#5c6c74]" />
                          <span className="text-sm font-medium text-[#5c6c74]">Inactive</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#5c6c74]">
                        {member.latestPeriodParticipation.toString() === '0' 
                          ? 'Never participated' 
                          : `Period ${member.latestPeriodParticipation.toString()}`
                        }
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {members.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5584a0]/10 mb-4">
                  <Users size={40} className="text-[#5584a0]" />
                </div>
                <h3 className="text-xl font-bold text-[#4f7a97] mb-2">No Members Found</h3>
                <p className="text-[#5c6c74]">This group doesn't have any members yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}