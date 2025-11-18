'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePublicClient, useAccount, useBalance } from 'wagmi';
import { Address, isAddress, formatEther } from 'viem';
import { GROUP_ABI } from '@/app/utils/TrustArisanGroupABI';
import Header from '@/app/components/Header';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Users, Percent, Coins, UsersRound, MessageCircleMore, HandCoins, Bitcoin, RotateCcw } from 'lucide-react';
import { Avatar } from '@/app/components/Avatar';
import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();

  // Convert id to Address
  const groupAddress = id && typeof id === 'string' ? (isAddress(id) ? id as Address : undefined) : undefined;
  const { data: balanceData, isLoading: isLoadingBalance, isFetching: isFetchingBalance, refetch: balanceRefetch } = useBalance({
    address: groupAddress,
  })
  
  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reloadData() {
    await fetchGroupDetails();
    await balanceRefetch();
  }

  async function fetchGroupDetails() {
    if (!publicClient || !id) return;
      
    try {
      setIsLoading(true);
      
      // Fetch group details
      const [detail, settings] = await Promise.all([
        publicClient.readContract({
          address: id as Address,
          abi: GROUP_ABI,
          functionName: 'getGroupDetail',
        }),
        publicClient.readContract({
          address: id as Address,
          abi: GROUP_ABI,
          functionName: 'getGroupSettings',
        })
      ]);

      setGroup({
        id,
        ...detail,
        settings: {
          ...settings,
          contributionAmount: Number(settings.contributionAmountInWei),
          coordinatorCommissionPercentage: Number(settings.coordinatorCommissionPercentage),
          prizePercentage: Number(settings.prizePercentage),
          maxCapacity: Number(settings.maxCapacity)
        }
      });
    } catch (e) {
      console.error('Error fetching group details:', e);
      setError('Failed to load group details');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroupDetails();
  }, [publicClient, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive dark:text-destructive-foreground p-4 rounded-lg">
            {error || 'Group not found'}
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
          onClick={() => router.push("/")}
          className="flex pe-8 py-3 items-center rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={18} className='me-4'/>
          Back to groups
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className='flex md:flex-row flex-col items-center place-items-center justify-items-center'>
                <Avatar name={group.title} size='xxl' className='md:me-4 md:mb-0 mb-4'/>
                <div>
                    <h1 className="text-3xl font-bold mb-1 md:text-start text-center">{group.settings.title}</h1>
                    <p className="text-muted-foreground md:text-start text-center">
                        Managed by {group.settings.coordinator.telegramUsername}
                    </p>
                    <p className='text-xs md:text-start text-center'>Group ID: {id}</p>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users size={18} />
                <span className="text-sm font-medium">Members</span>
              </div>
              <p className="text-2xl font-semibold">
                {group.membersCount?.toString() || '0'}
                <span className="text-muted-foreground text-sm ml-1">
                  / {group.settings.maxCapacity?.toString() || '0'}
                </span>
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Coins size={18} />
                <span className="text-sm font-medium">Contribution</span>
              </div>
              <p className="text-2xl font-semibold">
                {group.settings.contributionAmount ? 
                  `${(group.settings.contributionAmount / 1e18)} ETH` : 
                  'N/A'}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Percent size={18} />
                <span className="text-sm font-medium">Coordinator Commission Percentage</span>
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
              {!(isLoadingBalance || isFetchingBalance) ? ((
                <p className="text-2xl font-semibold">
                    {balanceData?.value ? formatEther(balanceData.value) : '0'} ETH
                </p>
                )) : (
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
                This is a TrustArisan group where members contribute {group.settings.contributionAmount / 1e18} ETH per cycle. 
                The coordinator takes a {group.settings.coordinatorCommissionPercentage}% commission, and the prize pool 
                is {group.settings.prizePercentage}% of the total contributions. Commission is subject to 5% platform fee.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-xl border border-border p-6 shadow-sm mt-6"
        >
            <div>
                {/* <h2 className="text-xl font-semibold mb-4">Controls</h2> */}
                <div className="flex space-y-4">
                    <div className='flex grow flex-col md:flex-row md:justify-end gap-4'>
                        {!isConnected && (
                            <Link className='flex flex-initial' href={`/`}>
                                <motion.button
                                    className="flex grow justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    >
                                    <UsersRound className='me-2 font-thin px-0.5'/> Join Group
                                </motion.button>
                            </Link>
                        )}
                        <Link className='flex flex-initial' target='_blank' href={group.settings.telegramGroupUrl} rel='noopener noreferrer'>
                            <motion.button
                                className="flex grow justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                >
                                <MessageCircleMore className='me-2 font-thin px-0.5'/> Join Chat
                            </motion.button>
                        </Link>
                        <motion.button
                            type='button'
                            onClick={reloadData}
                            className="flex flex-initial justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            >
                            <RotateCcw className='me-2 font-thin px-0.5'/> Reload Data
                        </motion.button>
                        <ThemeToggle unhideText={true} injectClass=''/>
                    </div>
                </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
