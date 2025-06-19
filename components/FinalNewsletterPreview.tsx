import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useNewsletterStore } from '@/lib/store/newsletterStore';
import { useDeepDiveStore } from '@/lib/store/deepDiveStore';
import { useJobTrackingStore } from '@/lib/store/jobTrackingStore';
import { useEventsStore } from '@/lib/store/eventsStore';

import NewsletterTemplate from './NewsletterTemplate';
import { Button } from './ui/button';
import { X, Loader2, Download } from 'lucide-react';

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

  const handleDownload = () => {
    // 1. Get all CSS rules from the document's stylesheets
    const getAppCss = () => {
      const css = [];
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          // Some stylesheets (e.g., from Google Fonts) might be cross-origin
          // and will throw an error if you try to access their rules directly.
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            css.push(Array.from(rules).map(rule => rule.cssText).join('\n'));
          }
        } catch (e) {
          console.warn("Could not read CSS rules from stylesheet:", sheet.href, e);
        }
      }
      return css.join('\n');
    };
    
    // 2. Render the React component to a static HTML string
    const newsletterHtml = ReactDOMServer.renderToStaticMarkup(
      <NewsletterTemplate
        newsletter={generatedNewsletter}
        deepDives={deepDives}
        jobTrackingEntries={jobTrackingEntries}
        upcomingEvents={upcomingEvents}
      />
    );

    const appCss = getAppCss();

    // 3. Construct the final, self-contained HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter Preview</title>
        <style>
          ${appCss}
        </style>
      </head>
      <body>
        ${newsletterHtml}
      </body>
      </html>
    `;

    // 4. Trigger the download using a Blob
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter.html';
    document.body.appendChild(a); // The link needs to be in the document to be clickable
    a.click();
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Clean up
  };

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
        
        <div className="flex justify-between items-center mb-5">
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Final Newsletter Preview
          </h2>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download HTML
          </Button>
        </div>

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