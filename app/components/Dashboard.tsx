'use client';

import { motion } from 'framer-motion';
import { 
  MessageCircleMore, 
  Search,
  CirclePlus,
  RotateCcw
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { useGroupsList } from '@/app/hooks/useGroupList';
import { Avatar } from '@/app/components/Avatar';

export default function Dashboard() {
  const { groups: groupsList, count, isLoading: isLoadingGroupsList, error: errorGroupsList, refetch } = useGroupsList();

  async function updateGroupsLists() {
    await refetch();
  }

  return (
    <motion.div 
      className="min-h-screen w-full bg-background text-foreground"
      initial={{ y: '100vh' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Available Groups</h2>
          <div className='flex gap-2'>
            <motion.button
                type='button'
                onClick={updateGroupsLists}
                className="flex sm:px-5 px-3 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className='sm:me-2 px-0.5' /> <span className='sm:inline hidden'>Reload</span>
              </motion.button>
            <Link href="/creategroup">
              <motion.button
                className="flex sm:px-5 px-3 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CirclePlus className='sm:me-2 px-0.5'/> <span className='sm:inline hidden'>Create Group</span>
              </motion.button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {isLoadingGroupsList ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <p className='mb-8 text-lg'>Total: {count}</p>
            {errorGroupsList && <div>Error: {errorGroupsList}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsList.map((group) => (
                <motion.div
                  key={group.id}
                  className="rounded-xl border border-[hsl(var(--foreground))]/20 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className='flex md:flex-row flex-col items-center place-items-center justify-items-center mb-4'>
                    <Avatar name={group.title} size='xxl' className='md:me-4 md:mb-0 mb-4'/>
                    <div>
                      <h3 className="flex text-xl font-semibold md:mb-2 md:justify-start justify-center">{group.title}</h3>
                      <p className="flex text-muted-foreground md:justify-start justify-center">
                        Coordinator: {group.coordinator}
                      </p>
                      <div className="flex bg-secondary/20 rounded-full md:justify-start justify-center">
                        <div 
                          className="bg-primary h-full rounded-full truncate" 
                        >Groupchat: {group.chatLink} </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 md:text-start text-center">
                    <span className='underline'>{group.currentSize}</span> of {group.size} members
                  </p>
                  <motion.div className='flex justify-between'>
                    <Link className='flex grow' href={`/group/` + group.id}>
                      <motion.button
                        className="flex grow justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Search className='me-2 font-thin px-0.5'/> Check Group
                      </motion.button>
                    </Link>
                    <Link href={group.chatLink} className='flex grow'>
                      <motion.button
                        className="flex grow justify-center ms-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-colors border border-[hsl(var(--foreground))]/10 hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircleMore className='me-2 font-thin px-0.5'/> Join Chat
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-t-[hsl(var(--foreground))]/10">
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
