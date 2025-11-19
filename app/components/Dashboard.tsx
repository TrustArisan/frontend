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
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import { useGroupsList } from '@/app/hooks/useGroupList';
import { Avatar } from '@/app/components/Avatar';

export default function Dashboard() {
  const { groups: groupsList, count, isLoading: isLoadingGroupsList, error: errorGroupsList, refetch } = useGroupsList();

  async function updateGroupsLists() {
    await refetch();
  }

  return (
    <motion.div 
      className="min-h-screen w-full bg-background"
      initial={{ y: '100vh' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Title & Actions */}
        <div className="flex flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Available Groups</h1>
            <p className="text-[#648196] text-lg">Total: <span className="font-semibold text-[#4f7a97]">{count}</span> groups</p>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={updateGroupsLists}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#5584a0] hover:bg-[#4f7a97] text-white font-medium transition-all shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw size={18} />
              <span className="hidden md:inline">Reload</span>
            </motion.button>
            
            <Link className='flex items-center' href="/creategroup">
              <motion.button
                className="flex items-center gap-2 h-full px-4 rounded-full bg-[#eeb446] hover:bg-[#daa23d] text-white font-medium transition-all shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CirclePlus size={18} />
                <span className="hidden md:inline">Create Group</span>
              </motion.button>
            </Link>

            <ThemeToggle unhideText={true} injectClass='hidden md:inline' endMarginBool={false}/>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingGroupsList ? (
          <Loading />
        ) : (
          <div>
            {/* Error State */}
            {errorGroupsList && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                <p className="font-medium">Error: {errorGroupsList}</p>
              </div>
            )}

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsList.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-background rounded-2xl border-2 border-[#4f7a97]/10 hover:border-[#4f7a97]/30 p-6 hover:shadow-xl transition-all duration-300"
                >
                  {/* Group Header */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar name={group.title} size="xxl" className="mb-4 ring-4 ring-[#eeb446]/20" />
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">{group.title}</h3>
                    
                    <p className="text-sm text-[#648196] mb-2">
                      Coordinator: <span className="font-medium text-[#4f7a97]">{group.coordinator}</span>
                    </p>
                    
                    <div className="w-full bg-[#4f7a97]/5 rounded-lg px-3 py-2 mt-2">
                      <p className="text-xs text-[#648196] truncate">
                        Chat: <span className="text-[#4f7a97] font-medium">{group.chatLink}</span>
                      </p>
                    </div>
                  </div>

                  {/* Members Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#648196]">Members</span>
                      <span className="text-sm font-bold text-[#4f7a97]">
                        {group.currentSize}/{group.size}
                      </span>
                    </div>
                    <div className="w-full bg-[#4f7a97]/10 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-linear-to-r from-[#eeb446] to-[#4f7a97] h-full rounded-full transition-all duration-500"
                        style={{ width: `${(group.currentSize / group.size) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/group/${group.id}`} className="flex-1">
                      <motion.button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5584a0] hover:bg-[#4f7a97] text-white font-medium text-sm transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Search size={16} />
                        <span>Check Room</span>
                      </motion.button>
                    </Link>
                    
                    <Link href={group.chatLink} className="flex-1">
                      <motion.button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#eeb446] hover:bg-[#daa23d] text-white font-medium text-sm transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircleMore size={16} />
                        <span>Join Chat</span>
                      </motion.button>
                    </Link>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-[#eeb446]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {groupsList.length === 0 && !errorGroupsList && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4f7a97]/10 mb-6">
                  <Search size={40} className="text-[#4f7a97]" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Groups Yet</h3>
                <p className="text-[#648196] mb-6">Be the first to create a group!</p>
                <Link href="/creategroup">
                  <motion.button
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#eeb446] hover:bg-[#daa23d] text-white font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CirclePlus size={20} />
                    Create First Group
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}