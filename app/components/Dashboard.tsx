'use client';

import { motion } from 'framer-motion';
import { 
  useState, 
  useEffect 
} from 'react';
import { 
  MessageCircleMore, 
  UsersRound
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useGroupsCount } from '../hooks/useGroupCount';
import { useGroupAddresses } from '../hooks/useGroupAddresses';
import { useCreateGroup } from '../hooks/useCreateGroup';
import { parseEther } from 'ethers';

interface Group {
  id: string;
  title: string;
  coordinator: string;
  chatLink: string;
  size: number;
  currentSize: number;
}

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { count, isLoading:isLoadingGroup, error } = useGroupsCount();
  const { addresses, isLoading:isLoadingAddresses } = useGroupAddresses();

  useEffect(() => {
    // Simulate API/contract call
    const fetchGroups = async () => {
      try {
        // TODO: Replace with actual contract call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data for now
        const mockGroups: Group[] = [
          {
            id: '1',
            title: 'Neighborhood Arisan',
            coordinator: '@johndoe',
            chatLink: 'https://t.me/neighborhood_arisan',
            size: 10,
            currentSize: 5,
          },
          {
            id: '2',
            title: 'Office Arisan',
            coordinator: '@janedoe',
            chatLink: 'https://t.me/office_arisan',
            size: 15,
            currentSize: 15,
          },
        ];
        setGroups(mockGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <motion.div 
      className="min-h-screen w-full bg-background text-foreground"
      initial={{ y: '100vh' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <header className="border-b border-b-[hsl(var(--foreground))]/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-500 to-blue-500/80 bg-clip-text text-transparent">
            TrustArisan
          </h1>
          <div className="flex items-center gap-3 space-x-4">
            <ConnectButton 
              showBalance={{
                smallScreen: false, 
                largeScreen: true
              }} 
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full"
              }} 
              chainStatus={{
                smallScreen: "icon",
                largeScreen: "full"
              }}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Available Groups</h2>
          <motion.button
            className="px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Group
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <p className='mb-8 text-lg'>Total: {count}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* <p>{addresses}</p> */}
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  className="rounded-xl border border-[hsl(var(--foreground))]/20 p-6 hover:shadow-lg transition-shadow"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{group.title}</h3>
                  <p className="text-muted-foreground">
                    Coordinator: {group.coordinator}
                  </p>
                  <div className="w-full bg-secondary/20 rounded-full mb-4">
                    <div 
                      className="bg-primary h-full rounded-full truncate" 
                    >Groupchat: {group.chatLink} </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className='underline'>{group.currentSize}</span> of {group.size} members
                  </p>
                  <motion.div
                    className='flex justify-between'
                  >
                    <motion.button
                      className="flex grow px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 hover:shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UsersRound className='me-2 font-thin px-0.5'/> Join Group
                    </motion.button>
                    <motion.button
                      className="flex grow ms-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 hover:shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircleMore className='me-2 font-thin px-0.5'/> Join Chat
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-t-[hsl(var(--foreground))]/10 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()}{' '}
            <Link 
              href="https://github.com/TrustArisan" 
              target="_blank"
              className="text-primary hover:underline"
            >
              TrustArisan
            </Link>
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
