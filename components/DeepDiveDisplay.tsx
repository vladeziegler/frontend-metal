// components/DeepDiveDisplay.tsx
import React, { useEffect } from 'react';
import { useDeepDiveStore } from '@/lib/store/deepDiveStore'; // Adjusted path
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

interface DeepDiveDisplayProps {
  metaSuggestionId: number | null | undefined; // Allow undefined for clarity if not yet available
}

const DeepDiveSection: React.FC<{ title: string; content: string | undefined | null, sectionTitle: string }> = ({ title, content, sectionTitle }) => {
  if (!content) return null;
  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">{sectionTitle}: {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
      </CardContent>
    </Card>
  );
};

const DeepDiveDisplay: React.FC<DeepDiveDisplayProps> = ({ metaSuggestionId }) => {
  const { deepDivesWithUrls, isLoading, error, fetchDeepDivesWithUrls, clearDeepDives } = useDeepDiveStore();

  useEffect(() => {
    if (metaSuggestionId && metaSuggestionId > 0) {
      fetchDeepDivesWithUrls(metaSuggestionId);
    } else {
      clearDeepDives();
    }
    // Clean up on component unmount or when metaSuggestionId changes significantly
    return () => {
      // clearDeepDives(); // Uncomment if you want to clear data each time ID changes or component unmounts
    };
  }, [metaSuggestionId, fetchDeepDivesWithUrls, clearDeepDives]);

  if (!metaSuggestionId || metaSuggestionId <= 0) {
    // Don't render anything if no valid metaSuggestionId is provided
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
        Loading deep dive insights...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600 bg-red-50 border border-red-300 rounded-md">Error fetching deep dive content: {error}</div>;
  }

  if (!deepDivesWithUrls || (!deepDivesWithUrls.article_deep_dive && !deepDivesWithUrls.research_deep_dive && !deepDivesWithUrls.podcast_deep_dive)) {
    return (
      <div className="p-6 text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
        No deep dive content available for this topic yet. It might still be generating if a newsletter was recently created/regenerated.
      </div>
    );
  }

  return (
    <div className="mt-8 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Automated Deep Dive Insights</h2>
      {deepDivesWithUrls.article_deep_dive && (
        <DeepDiveSection 
          sectionTitle="Article Deep Dive"
          title={deepDivesWithUrls.article_deep_dive.deep_dive_title}
          content={deepDivesWithUrls.article_deep_dive.deep_dive_content}
        />
      )}
      {deepDivesWithUrls.research_deep_dive && (
        <DeepDiveSection
          sectionTitle="Research Deep Dive"
          title={deepDivesWithUrls.research_deep_dive.deep_dive_title}
          content={deepDivesWithUrls.research_deep_dive.deep_dive_content}
        />
      )}
      {deepDivesWithUrls.podcast_deep_dive && (
        <DeepDiveSection
          sectionTitle="Podcast Deep Dive"
          title={deepDivesWithUrls.podcast_deep_dive.deep_dive_title}
          content={deepDivesWithUrls.podcast_deep_dive.deep_dive_content}
        />
      )}
    </div>
  );
};

export default DeepDiveDisplay; 