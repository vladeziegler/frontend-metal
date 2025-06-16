'use client';

import React, { useEffect } from 'react';
import { useEventsStore } from '@/lib/store/eventsStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Calendar } from "lucide-react";

const UpcomingEventsDisplay: React.FC = () => {
  const { events, isLoading, error, fetchUpcomingEvents } = useEventsStore();

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not available';
    // The date from the backend is YYYY-MM-DD.
    // To prevent timezone issues where it might show the previous day,
    // we can parse it as UTC.
    const date = new Date(`${dateString}T00:00:00Z`);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Events</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (events.length === 0) {
      return <p className="text-base text-muted-foreground">No upcoming events in the next 30 days.</p>;
    }

    return (
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="h-6 w-6 mt-1 text-blue-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">{event['Event Name']}</p>
              <div className="text-sm text-gray-500 mt-1 flex items-center space-x-4 flex-wrap">
                <span className="font-medium text-gray-700">{formatDate(event['Event Date'])}</span>
                <span className="text-gray-300">|</span>
                <span>{event.Territory}</span>
                <span className="text-gray-300">|</span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{event.Type}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="py-8">
        <hr className="my-6 border-gray-200" />
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Upcoming Events (Next 30 Days)</h2>
        {renderContent()}
    </div>
  );
};

export default UpcomingEventsDisplay; 