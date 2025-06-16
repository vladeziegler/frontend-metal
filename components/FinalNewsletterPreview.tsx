import React from 'react';
import { useNewsletterStore } from '@/lib/store/newsletterStore';
import { useDeepDiveStore } from '@/lib/store/deepDiveStore';
import { useJobTrackingStore } from '@/lib/store/jobTrackingStore';
import { useEventsStore } from '@/lib/store/eventsStore';

import NewsletterTemplate from './NewsletterTemplate';
import { Button } from './ui/button';
import { X, Loader2 } from 'lucide-react';

interface FinalNewsletterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinalNewsletterPreview: React.FC<FinalNewsletterPreviewProps> = ({ isOpen, onClose }) => {
  // Fetching data from all relevant stores
  const { generatedNewsletter } = useNewsletterStore();
  const { deepDives } = useDeepDiveStore();
  const { entries: jobTrackingEntries } = useJobTrackingStore();
  const { events: upcomingEvents, isLoading: isLoadingEvents } = useEventsStore();
  const { isLoading: isLoadingJobs } = useJobTrackingStore();
  const { isLoading: isLoadingDives } = useDeepDiveStore();

  if (!isOpen) {
    return null;
  }
  
  const isLoading = isLoadingEvents || isLoadingJobs || isLoadingDives;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: '#fff',
        width: '90%',
        maxWidth: '800px',
        height: '90vh',
        overflowY: 'auto',
        borderRadius: '8px',
        position: 'relative',
        padding: '20px',
      }}>
        <Button
          onClick={onClose}
          variant="ghost"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1010,
          }}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>
          Final Newsletter Preview
        </h2>

        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        ) : (
            <NewsletterTemplate
              newsletter={generatedNewsletter}
              deepDives={deepDives}
              jobTrackingEntries={jobTrackingEntries}
              upcomingEvents={upcomingEvents}
            />
        )}
      </div>
    </div>
  );
};

export default FinalNewsletterPreview; 