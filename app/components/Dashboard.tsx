'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  MessageCircleMore, 
  Search,
  CirclePlus,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  async function updateGroupsLists() {
    await refetch();
  }

  // Filter groups based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupsList;
    
    const query = searchQuery.toLowerCase();
    return groupsList.filter(group => 
      group.title.toLowerCase().includes(query)
    );
  }, [groupsList, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Available Groups</h1>
            <p className="text-[#648196] text-lg">
              {searchQuery ? (
                <>
                  Found: <span className="font-semibold text-[#4f7a97]">{filteredGroups.length}</span> of <span className="font-semibold text-[#4f7a97]">{count}</span> groups
                </>
              ) : (
                <>
                  Total: <span className="font-semibold text-[#4f7a97]">{count}</span> groups
                </>
              )}
            </p>
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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-[#5c6c74]" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search groups by name..."
              className="w-full pl-12 pr-12 py-3.5 bg-background border-2 border-[#648196]/20 rounded-xl text-foreground placeholder-[#5c6c74]/60 focus:outline-none focus:ring-2 focus:ring-[#5584a0] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5c6c74] hover:text-[#4f7a97] transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-[#5c6c74] mt-2 ml-1">
              Searching for: <span className="font-medium text-[#4f7a97]">"{searchQuery}"</span>
            </p>
          )}
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
              {currentGroups.map((group, index) => (
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
                        <span>Details</span>
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

            {/* Pagination */}
            {filteredGroups.length > itemsPerPage && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <p className="text-sm text-[#5c6c74]">
                  Showing <span className="font-semibold text-[#4f7a97]">{startIndex + 1}</span> to{' '}
                  <span className="font-semibold text-[#4f7a97]">{Math.min(endIndex, filteredGroups.length)}</span> of{' '}
                  <span className="font-semibold text-[#4f7a97]">{filteredGroups.length}</span> groups
                </p>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <motion.button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === 1
                        ? 'bg-[#5c6c74]/20 text-[#5c6c74]/50 cursor-not-allowed'
                        : 'bg-[#5584a0] text-white hover:bg-[#4f7a97] shadow-sm'
                    }`}
                    whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-[#5584a0] text-white shadow-md'
                            : 'bg-[#5584a0]/10 text-[#4f7a97] hover:bg-[#5584a0]/20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <motion.button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === totalPages
                        ? 'bg-[#5c6c74]/20 text-[#5c6c74]/50 cursor-not-allowed'
                        : 'bg-[#5584a0] text-white hover:bg-[#4f7a97] shadow-sm'
                    }`}
                    whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </div>
            )}

            {/* No Results State */}
            {filteredGroups.length === 0 && searchQuery && !errorGroupsList && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4f7a97]/10 mb-6">
                  <Search size={40} className="text-[#4f7a97]" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Groups Found</h3>
                <p className="text-[#648196] mb-4">
                  No groups match "<span className="font-medium text-[#4f7a97]">{searchQuery}</span>"
                </p>
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5584a0] hover:bg-[#4f7a97] text-white font-medium transition-all"
                >
                  <X size={18} />
                  Clear Search
                </button>
              </div>
            )}

            {/* Empty State */}
            {groupsList.length === 0 && !errorGroupsList && !searchQuery && (
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