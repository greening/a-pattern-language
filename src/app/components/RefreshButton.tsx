'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  className?: string;
}

/**
 * A button that triggers data revalidation
 * Placed next to the Table of Contents to allow manual refreshing
 */
const RefreshButton = ({ className = '' }: RefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      // Call the revalidation API
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh data');
      }
      
      // Force a client-side refresh
      router.refresh();
      
      // Wait a moment before allowing another refresh
      setTimeout(() => {
        setIsRefreshing(false);
      }, 2000);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`text-xs flex items-center ${isRefreshing ? 'opacity-50' : 'hover:opacity-70'} ${className}`}
      title="Refresh pattern data"
      aria-label="Refresh pattern data"
    >
      <svg 
        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      {isRefreshing ? 'Refreshing...' : ''}
    </button>
  );
};

export default RefreshButton;
