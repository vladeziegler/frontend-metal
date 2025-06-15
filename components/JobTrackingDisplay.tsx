'use client';

import React, { useEffect } from 'react';
import { useJobTrackingStore } from '@/lib/store/jobTrackingStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

const JobTrackingDisplay: React.FC = () => {
  const { entries, isLoading, error, fetchJobTrackingEntries } = useJobTrackingStore();

  useEffect(() => {
    fetchJobTrackingEntries(); // Fetch on component mount
  }, [fetchJobTrackingEntries]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        )
    }

    if (entries.length === 0) {
      return <p className="text-base text-muted-foreground">No recent job changes found.</p>;
    }

    return (
      <ul className="space-y-3 list-disc pl-5">
        {entries.map((entry) => (
          <li key={entry.id} className="text-lg">
            <span className="font-bold" style={{ color: '#D94682' }}>{entry.full_name}</span>
            <span> joins {entry.bank_name} as {entry.role_title}.</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="py-8">
        <hr className="my-6 border-gray-200" />
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#D94682' }}>Movers & Shakers</h2>
        {renderContent()}
        <hr className="mt-6 border-gray-200" />
    </div>
  );
};

export default JobTrackingDisplay; 