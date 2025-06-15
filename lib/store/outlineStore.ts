import { create } from 'zustand';
import { OutlineAPIResponse } from '@/lib/types'; // Assuming types are correctly defined

// Ensure this matches your actual FASTAPI_BASE_URL for Project_Metal
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8080'; 

interface OutlineStoreState {
  outline: OutlineAPIResponse | null;
  isLoadingOutline: boolean;
  errorOutline: string | null;
  generateOutline: (topicId: number) => Promise<boolean>;
  clearOutline: () => void; // New action
  // You might also want a direct fetchOutline if needed elsewhere
  // fetchOutline: (outlineId: number) => Promise<boolean>; 
}

export const useOutlineStore = create<OutlineStoreState>((set) => ({
  outline: null,
  isLoadingOutline: false,
  errorOutline: null,

  generateOutline: async (topicId: number) => {
    set({ isLoadingOutline: true, errorOutline: null, outline: null });
    try {
      console.log(`OutlineStore: Triggering outline generation for topic ID: ${topicId}`);
      if (!topicId || typeof topicId !== 'number' || topicId <= 0) {
        console.error('OutlineStore: Invalid topicId provided:', topicId);
        set({ isLoadingOutline: false, errorOutline: 'Invalid Topic ID for outline generation.' });
        return false;
      }

      // Step 1: Trigger outline generation and get its ID
      const generateResponse = await fetch(`${FASTAPI_BASE_URL}/pipelines/generate-article-outline/${topicId}`, {
        method: 'POST',
      });

      if (!generateResponse.ok) {
        let errorMsg = `Failed to trigger outline generation. Status: ${generateResponse.status}`;
        try {
            const errorData = await generateResponse.json();
            errorMsg = errorData.detail || errorMsg;
        } catch { errorMsg = generateResponse.statusText || errorMsg; }
        console.error('OutlineStore: API error (triggering generation):', errorMsg);
        set({ isLoadingOutline: false, errorOutline: errorMsg });
        return false;
      }

      const generationResult = await generateResponse.json();
      const newOutlineId = generationResult.id;

      if (!newOutlineId) {
        console.error('OutlineStore: Outline generation did not return a new outline ID.', generationResult);
        set({ isLoadingOutline: false, errorOutline: 'Outline generation failed to provide an ID.' });
        return false;
      }
      console.log(`OutlineStore: Outline triggered successfully, new outline ID: ${newOutlineId}. Now fetching full outline.`);

      // Step 2: Fetch the full outline data using the new ID
      const fetchResponse = await fetch(`${FASTAPI_BASE_URL}/outlines/${newOutlineId}`);
      
      if (!fetchResponse.ok) {
        let errorMsg = `Failed to fetch generated outline. Status: ${fetchResponse.status}`;
        try {
            const errorData = await fetchResponse.json();
            errorMsg = errorData.detail || errorMsg;
        } catch { errorMsg = fetchResponse.statusText || errorMsg; }
        console.error('OutlineStore: API error (fetching outline):', errorMsg);
        // Keep isLoadingOutline true because generation was triggered, but fetching failed. User might retry fetching.
        set({ errorOutline: errorMsg, isLoadingOutline: false }); // Set loading false as the sequence failed
        return false;
      }

      const fullOutlineData: OutlineAPIResponse = await fetchResponse.json();
      set({ outline: fullOutlineData, isLoadingOutline: false, errorOutline: null });
      console.log('OutlineStore: Full outline fetched and stored:', fullOutlineData);
      return true;

    } catch (error) {
      console.error('OutlineStore: Network or unexpected error:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred.';
      set({ isLoadingOutline: false, errorOutline: errorMsg });
      return false;
    }
  },

  clearOutline: () => {
    set({ outline: null, isLoadingOutline: false, errorOutline: null });
    console.log('OutlineStore: Outline cleared.');
  },
})); 