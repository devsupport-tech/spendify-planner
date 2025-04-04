
import React, { useEffect, useRef } from 'react';
import { FinanceDashboard } from '@/components/FinanceDashboard';

interface ClickableDashboardProps {
  onCardClick: (tabName: string) => void;
}

export function ClickableDashboard({ onCardClick }: ClickableDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find all cards in the dashboard
    const cards = container.querySelectorAll('.finance-dashboard-card');
    
    // Add click event listeners to each card
    cards.forEach((card, index) => {
      // Add class to indicate it's clickable
      card.classList.add('cursor-pointer', 'hover:shadow-md', 'transition-all');
      
      // Determine which tab to navigate to based on card index
      card.addEventListener('click', () => {
        let targetTab = 'dashboard';
        
        // Map card index to tab name
        // This assumes cards are in a specific order in the dashboard
        switch (index) {
          case 0: // Total Expenses card
            targetTab = 'expenses';
            break;
          case 1: // Total Income card
            targetTab = 'payments';
            break;
          case 2: // Budget card
            targetTab = 'budget';
            break;
          case 3: // Projects card
            targetTab = 'projects';
            break;
          case 4: // Analytics card (if exists)
            targetTab = 'analytics';
            break;
          default:
            targetTab = 'dashboard';
        }
        
        onCardClick(targetTab);
      });
    });

    // Cleanup event listeners on unmount
    return () => {
      cards.forEach((card) => {
        card.classList.remove('cursor-pointer', 'hover:shadow-md', 'transition-all');
        card.removeEventListener('click', () => {});
      });
    };
  }, [onCardClick]);

  return (
    <div ref={containerRef}>
      <FinanceDashboard />
    </div>
  );
}
