import { create } from 'zustand';

// Define the type for a single event based on the backend response model
export interface UpcomingEvent {
  id: number;
  Quarter: string | null;
  Territory: string | null;
  Type: string | null;
  "Event Name": string | null;
  "Event Date": string | null; // Dates from the backend will be strings
}

interface EventsStoreState {
  events: UpcomingEvent[];
  isLoading: boolean;
  error: string | null;
  fetchUpcomingEvents: () => Promise<void>;
}

export const useEventsStore = create<EventsStoreState>((set) => ({
  events: [],
  isLoading: false,
  error: null,
  fetchUpcomingEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/events/upcoming');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch upcoming events');
      }
      const data: UpcomingEvent[] = await response.json();
      set({ events: data, isLoading: false });
    } catch (error) {
      console.error("Error in fetchUpcomingEvents:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, isLoading: false });
    }
  },
})); 