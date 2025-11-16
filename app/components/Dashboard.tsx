'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

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
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            TrustArisan
          </h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Connect Wallet
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Available Groups</h2>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Create Group
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <motion.div
                key={group.id}
                className="rounded-xl border p-6 hover:shadow-lg transition-shadow"
                whileHover={{ y: -4 }}
              >
                <h3 className="text-xl font-semibold mb-2">{group.title}</h3>
                <p className="text-muted-foreground mb-4">
                  Coordinator: {group.coordinator}
                </p>
                <div className="w-full bg-secondary/20 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${(group.currentSize / group.size) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {group.currentSize} of {group.size} members
                </p>
                <a
                  href={group.chatLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm font-medium text-primary hover:underline"
                >
                  Join Chat →
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
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
