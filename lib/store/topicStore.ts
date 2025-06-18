import { create } from 'zustand';
import { MetaSuggestion } from '@/lib/types';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8080'; // Changed port to 8000

interface TopicStoreState {
  topics: MetaSuggestion[];
  selectedTopicId: number | null;
  isLoadingTopics: boolean;
  isGeneratingTopics: boolean;
  errorTopics: string | null;

  // New states for choosing a topic
  isChoosingTopic: boolean;
  chooseTopicError: string | null;

  fetchTopics: (limit?: number) => Promise<void>;
  generateTopics: () => Promise<void>;
  selectTopic: (topicId: number | null) => Promise<void>;
}

export const useTopicStore = create<TopicStoreState>((set, get) => ({
  topics: [],
  selectedTopicId: null,
  isLoadingTopics: false,
  isGeneratingTopics: false,
  errorTopics: null,

  isChoosingTopic: false,
  chooseTopicError: null,

  fetchTopics: async (limit: number = 20) => {
    set({ isLoadingTopics: true, errorTopics: null });
    try {
      const url = `${FASTAPI_BASE_URL}/meta_suggestions?limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch topics. Status: ${response.status}`);
      }
      
      const data: MetaSuggestion[] = await response.json();
      set({ topics: data, isLoadingTopics: false });
    } catch (error) {
      console.error('TopicStore: Error fetching topics:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred.';
      set({ errorTopics: errorMsg, isLoadingTopics: false });
    }
  },

  generateTopics: async () => {
    set({ isGeneratingTopics: true, errorTopics: null });
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/pipelines/generate-meta-suggestions`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        let errorMsg = `Failed to trigger topic generation. Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.detail || errorMsg;
        } catch { /* use default errorMsg */ }
        throw new Error(errorMsg);
      }
      await get().fetchTopics(); 
      set({ isGeneratingTopics: false });
      console.log('TopicStore: Topic generation triggered and topics refetched.');
    } catch (error) {
      console.error('TopicStore: Error generating topics:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred.';
      set({ errorTopics: errorMsg, isGeneratingTopics: false });
    }
  },

  selectTopic: async (topicId: number | null) => {
    if (topicId === null) {
      set({ selectedTopicId: null, isChoosingTopic: false, chooseTopicError: null });
      console.log('TopicStore: Topic selection cleared.');
      return;
    }

    // If the same topic is clicked again, it might mean deselection or re-selection.
    // For now, we assume clicking a topic always means intending to choose it if not already chosen.
    // A more sophisticated approach might check if it's already the selected one and chosen.
    
    set({ isChoosingTopic: true, chooseTopicError: null });
    console.log(`TopicStore: Attempting to choose topic ID: ${topicId} via API.`);

    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/meta_suggestions/${topicId}/choose`, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        let errorMsg = `Failed to choose topic ${topicId}. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch { /* use default errorMsg */ }
        throw new Error(errorMsg);
      }

      const chosenTopicData: MetaSuggestion = await response.json();
      console.log(`TopicStore: Topic ID ${topicId} successfully chosen. API Response:`, chosenTopicData);
      
      // Update the local state with the selected ID and refresh the topics list
      // to reflect the `is_chosen` and `chosen_at` status from the server.
      set({ 
        selectedTopicId: topicId, 
        isChoosingTopic: false,
        // Update the specific topic in the topics array or refetch all
        topics: get().topics.map(t => t.id === topicId ? { ...t, is_chosen: true, chosen_at: chosenTopicData.chosen_at } : t)
      });
      // Optionally, you could do a full get().fetchTopics() here if you want to ensure all data is fresh
      // but updating the single item is more efficient.

    } catch (error) {
      console.error(`TopicStore: Error choosing topic ID ${topicId}:`, error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred.';
      set({ chooseTopicError: errorMsg, isChoosingTopic: false, selectedTopicId: null }); // Deselect on error
    }
  },
})); 