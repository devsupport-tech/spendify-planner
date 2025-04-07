
import React from 'react';
import { ClickableDashboard } from '@/components/ClickableDashboard';

const Dashboard = () => {
  const handleCardClick = (tabName: string) => {
    console.log(`Navigate to ${tabName}`);
    // Navigation logic would go here in a real application
  };

  return (
    <div className="container mx-auto py-6">
      <ClickableDashboard onCardClick={handleCardClick} />
    </div>
  );
};

export default Dashboard;
