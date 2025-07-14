import { create } from 'zustand';

// This interface matches the JobTrackingResponse model from the backend
export interface JobTrackingEntry {
  id: string;
  full_name: string;
  location: string | null;
  bank_name: string;
  previous_company: string | null;
  previous_role_title: string | null;
  role_title: string;
  announcement_type: string;
  job_description: string | null;
  background: string | null;
  appointment_date: string | null; // Kept as string for simplicity on the frontend
  previous_roles: string[] | null;
  key_skills: string[] | null;
  news_source_url: string | null;
  created_at: string;
}

interface JobTrackingState {
  entries: JobTrackingEntry[];
  isLoading: boolean;
  error: string | null;
  fetchJobTrackingEntries: (days_old?: number) => Promise<void>;
}

export const useJobTrackingStore = create<JobTrackingState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,
  fetchJobTrackingEntries: async (days_old = 14) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all recent records from backend (no date parameter needed)
      const response = await fetch(`/api/job-tracking`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch job tracking entries');
      }
      const allData: JobTrackingEntry[] = await response.json();
      
      // Filter by appointment_date on the frontend
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days_old);
      
      const filteredData = allData.filter(entry => {
        if (!entry.appointment_date) return false; // Skip entries without appointment_date
        const appointmentDate = new Date(entry.appointment_date);
        return appointmentDate >= cutoffDate;
      });
      
      set({ entries: filteredData, isLoading: false });
    } catch (error) {
      console.error("Error in fetchJobTrackingEntries:", error);
      if (error instanceof Error) {
          set({ error: error.message, isLoading: false });
      } else {
          set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
})); 