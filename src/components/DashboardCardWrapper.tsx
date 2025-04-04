
import React from 'react';
import { Card } from '@/components/ui/card';

interface DashboardCardWrapperProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function DashboardCardWrapper({ children, onClick }: DashboardCardWrapperProps) {
  return (
    <div 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
