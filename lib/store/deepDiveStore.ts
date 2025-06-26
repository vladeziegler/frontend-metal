import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// TypeScript Interfaces mirroring Pydantic models from main_simple.py
// Ensure these match the structure returned by your FastAPI GET /deep_dives/by_meta_suggestion/{id} endpoint

interface DeepDiveBase {
  id: number;
  meta_suggestion_id: number;
  deep_dive_title: string;
  deep_dive_content: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface DeepDiveArticle extends DeepDiveBase {
  original_article_id: number;
}

export interface DeepDiveResearch extends DeepDiveBase {
  original_research_report_id: number;
}

export interface DeepDivePodcast extends DeepDiveBase {
  original_podcast_episode_id: number;
}

export interface AllDeepDivesData {
  meta_suggestion_id: number;
  article_deep_dive: DeepDiveArticle | null;
  research_deep_dive: DeepDiveResearch | null;
  podcast_deep_dive: DeepDivePodcast | null;
}

export interface AllDeepDivesForMetaSuggestionResponse {
  meta_suggestion_id: number;
  article_deep_dive: DeepDiveArticle | null;
  research_deep_dive: DeepDiveResearch | null;
  podcast_deep_dive: DeepDivePodcast | null;
}

// New interfaces for deep dives with URLs
export interface DeepDiveArticleWithUrl extends DeepDiveBase {
  original_article_id: number;
  source_url: string | null;
}

export interface DeepDiveResearchWithUrl extends DeepDiveBase {
  original_research_report_id: number;
  source_url: string | null;
}

export interface DeepDivePodcastWithUrl extends DeepDiveBase {
  original_podcast_episode_id: number;
  source_url: string | null;
}

export interface AllDeepDivesWithUrlsForMetaSuggestionResponse {
  meta_suggestion_id: number;
  article_deep_dive: DeepDiveArticleWithUrl | null;
  research_deep_dive: DeepDiveResearchWithUrl | null;
  podcast_deep_dive: DeepDivePodcastWithUrl | null;
}

export interface DeepDiveState {
  deepDives: AllDeepDivesForMetaSuggestionResponse | null;
  deepDivesWithUrls: AllDeepDivesWithUrlsForMetaSuggestionResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchDeepDives: (metaSuggestionId: number) => Promise<void>;
  fetchDeepDivesWithUrls: (metaSuggestionId: number) => Promise<void>;
  clearDeepDives: () => void;
}

export const useDeepDiveStore = create<DeepDiveState>()(
  devtools(
    (set) => ({
      deepDives: null,
      deepDivesWithUrls: null,
      isLoading: false,
      error: null,

      fetchDeepDives: async (metaSuggestionId: number) => {
        if (!metaSuggestionId) {
          set({ error: 'Meta Suggestion ID is required to fetch deep dives.', isLoading: false });
          return;
        }
        set({ isLoading: true, error: null, deepDives: null });
        try {
          const response = await fetch(`/api/deep-dives/${metaSuggestionId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch deep dives: ${response.statusText}`);
          }
          const data: AllDeepDivesForMetaSuggestionResponse = await response.json();
          set({ deepDives: data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          console.error("Error fetching deep dives:", errorMessage);
          set({ error: errorMessage, isLoading: false, deepDives: null });
        }
      },

      fetchDeepDivesWithUrls: async (metaSuggestionId: number) => {
        if (!metaSuggestionId) {
          set({ error: 'Meta Suggestion ID is required to fetch deep dives with URLs.', isLoading: false });
          return;
        }
        set({ isLoading: true, error: null, deepDivesWithUrls: null });
        try {
          const response = await fetch(`/api/deep-dives/${metaSuggestionId}/with-urls`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch deep dives with URLs: ${response.statusText}`);
          }
          const data: AllDeepDivesWithUrlsForMetaSuggestionResponse = await response.json();
          set({ deepDivesWithUrls: data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          console.error("Error fetching deep dives with URLs:", errorMessage);
          set({ error: errorMessage, isLoading: false, deepDivesWithUrls: null });
        }
      },

      clearDeepDives: () => {
        set({ deepDives: null, deepDivesWithUrls: null, error: null, isLoading: false });
      },
    }),
    { name: 'deepDiveStore' }
  )
); 