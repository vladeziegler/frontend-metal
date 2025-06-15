import { create } from 'zustand';
import { GeneratedNewsletterData } from '@/lib/types'; // Adjust path as needed

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';

interface NewsletterState {
  generatedNewsletter: GeneratedNewsletterData | null;
  isLoadingNewsletter: boolean;
  errorNewsletter: string | null;
  isTriggeringGeneration: boolean; // For the initial generation
  triggerError: string | null;     // For the initial generation

  // New state for editor notes and regeneration
  editorNotesInput: string;
  isSavingEditorNotes: boolean;
  saveEditorNotesError: string | null;
  isRegeneratingNewsletter: boolean;
  regenerateNewsletterError: string | null;
}

interface NewsletterActions {
  triggerNewsletterGeneration: (outlineId: number) => Promise<void>;
  fetchGeneratedNewsletterByOutlineId: (outlineId: number) => Promise<void>;
  clearNewsletter: () => void;

  // New actions
  setEditorNotesInput: (notes: string) => void;
  saveEditorNotes: (newsletterId: number) => Promise<void>;
  regenerateAndDisplayNewsletter: (newsletterId: number) => Promise<void>;
}

export const useNewsletterStore = create<NewsletterState & NewsletterActions>((set, get) => ({
  generatedNewsletter: null,
  isLoadingNewsletter: false,
  errorNewsletter: null,
  isTriggeringGeneration: false,
  triggerError: null,

  // New state initial values
  editorNotesInput: '',
  isSavingEditorNotes: false,
  saveEditorNotesError: null,
  isRegeneratingNewsletter: false,
  regenerateNewsletterError: null,

  triggerNewsletterGeneration: async (outlineId) => {
    set({ isTriggeringGeneration: true, triggerError: null, generatedNewsletter: null, isLoadingNewsletter: true });
    try {
      // This POSTs to the FastAPI backend which generates and stores the newsletter
      const response = await fetch(`${FASTAPI_BASE_URL}/newsletters/generate/${outlineId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || 'Failed to trigger newsletter generation');
      }
      const data: GeneratedNewsletterData = await response.json();
      set({ generatedNewsletter: data, isTriggeringGeneration: false, isLoadingNewsletter: false, editorNotesInput: data.editor_notes || '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ triggerError: message, isTriggeringGeneration: false, isLoadingNewsletter: false });
      console.error("Error triggering newsletter generation:", error);
    }
  },

  fetchGeneratedNewsletterByOutlineId: async (outlineId) => {
    set({ isLoadingNewsletter: true, errorNewsletter: null });
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/generated_newsletters/by_outline/${outlineId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          set({ generatedNewsletter: null, isLoadingNewsletter: false }); // Not an error, just no newsletter yet
          return;
        }
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || 'Failed to fetch newsletter');
      }
      const data: GeneratedNewsletterData | null = await response.json(); // API might return null/204 if not found
      set({ generatedNewsletter: data, isLoadingNewsletter: false, editorNotesInput: data?.editor_notes || '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ errorNewsletter: message, isLoadingNewsletter: false });
      console.error("Error fetching generated newsletter:", error);
    }
  },

  clearNewsletter: () => set({ generatedNewsletter: null, errorNewsletter: null, triggerError: null, editorNotesInput: '' }),

  // New action implementations
  setEditorNotesInput: (notes) => set({ editorNotesInput: notes }),

  saveEditorNotes: async (newsletterId) => {
    const state = get();
    set({ isSavingEditorNotes: true, saveEditorNotesError: null });
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/generated_newsletters/${newsletterId}/editor_notes`, { // Fixed: Direct FastAPI call
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ editor_notes: state.editorNotesInput }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || 'Failed to save editor notes');
      }
      const updatedNewsletter: GeneratedNewsletterData = await response.json();
      // Update the main newsletter state with the full updated newsletter from backend
      // Also update editorNotesInput to reflect the successfully saved notes
      set({
        generatedNewsletter: updatedNewsletter,
        isSavingEditorNotes: false,
        editorNotesInput: updatedNewsletter.editor_notes || '',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ saveEditorNotesError: message, isSavingEditorNotes: false });
      console.error("Error saving editor notes:", error);
    }
  },

  regenerateAndDisplayNewsletter: async (newsletterId) => {
    set({ isRegeneratingNewsletter: true, regenerateNewsletterError: null });
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/generated_newsletters/${newsletterId}/regenerate`, { // Fixed: Direct FastAPI call
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || 'Failed to regenerate newsletter');
      }
      const regeneratedNewsletter: GeneratedNewsletterData = await response.json();
      // Update the main newsletter state with the regenerated content
      // editor_notes (input) should remain the same, but editor_note_block will be new/updated
      set({
        generatedNewsletter: regeneratedNewsletter,
        isRegeneratingNewsletter: false,
        // editorNotesInput should ideally remain reflecting the saved notes, 
        // not cleared or changed by regeneration itself.
        // The regeneratedNewsletter.editor_notes will still be the original input notes.
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ regenerateNewsletterError: message, isRegeneratingNewsletter: false });
      console.error("Error regenerating newsletter:", error);
    }
  },
})); 