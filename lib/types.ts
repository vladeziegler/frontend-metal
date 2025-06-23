// frontend/lib/types.ts

// Base type for simple content sections (e.g., in Newsletters)
export interface ContentSection {
  title: string;
  content: string;
}

// Type for the generated newsletter data, matching the backend's NewsletterResponse
export interface GeneratedNewsletterData {
  id: number; 
  outline_id: number; 
  section1: ContentSection;
  section2: ContentSection;
  section3: ContentSection;
  section4: ContentSection;
  key_takeaway: string;
  source_urls: string[];
  created_at: string; 
  llm_generation_error?: string | null;
  editor_notes?: string | null; // The notes stored in DB, used as input for regen
  editor_note_block?: string | null; // The verbatim block from LLM for display
  meta_suggestion_id: number;
}

// Specific data point structure within an Article Outline Section
export interface ArticleOutlineSectionDataPoint {
  description: string;
  value: string; // Kept as string, can be numeric or textual like '+12% YoY'
  source_url?: string | null; // Made optional to align with backend Python model
}

// Structure for a section within an Article Outline (e.g., context, takeaways)
// This is the authoritative definition for sections within an ArticleOutline.
export interface ArticleOutlineSection {
  heading?: string | null;
  content_points?: string[] | null;
  data_points?: ArticleOutlineSectionDataPoint[] | null;
  supporting_data_references?: string[] | null;
}

// Defines the structure of the 'outline_data' JSONB field from the backend
// This is also what the generate_article_outline.py script produces.
// This is the authoritative definition for ArticleOutline.
export interface ArticleOutline {
  main_title: string;
  initial_snippet: string;
  context_of_situation: ArticleOutlineSection; 
  why_it_matters_banking_initial: ArticleOutlineSection;
  body_second_order_effects: ArticleOutlineSection[];
  why_it_matters_banking_concluding: ArticleOutlineSection;
  podcast_connection: ArticleOutlineSection;
  backbase_mention?: ArticleOutlineSection | null;
  key_takeaways: ArticleOutlineSection;
  source_urls: string[];
  source_content_summary?: { // Define this more strictly based on actual data if possible
    chosen_suggestion?: MetaSuggestion; 
    source_articles?: unknown[];
    supporting_research?: unknown[];
    supporting_podcasts?: unknown[];
  } | null;
  error?: string | null; // Error from the outline generation script itself
}

// Represents the structure of the API response when fetching a full outline record
// (e.g., from /outlines/{id} or /outlines/latest)
// This is the authoritative definition for OutlineAPIResponse.
export interface OutlineAPIResponse {
    id: number; // Outline ID from DB
    meta_suggestion_id?: number | null;
    main_title: string; // This is directly from the outline_data, but also a top-level DB column
    initial_snippet: string; // Also from outline_data and a top-level DB column
    outline_data: ArticleOutline; // The full JSON content, matching the ArticleOutline type
    error_message?: string | null; // Error stored in DB during outline generation
    created_at: string; // ISO date string
}

// Represents a topic suggestion from the backend (meta_article_suggestions table)
export interface MetaSuggestion {
  id: number;
  title: string;
  snippet?: string | null;
  source_article_ids?: number[];
  supporting_research_ids?: number[];
  supporting_podcast_ids?: number[];
  is_chosen: boolean;
  created_at: string; 
  chosen_at?: string | null; 
}

// Type for the data expected by the deep dive generation endpoint
export interface DeepDiveInputData {
  // ... existing code ...
}

// Removed duplicate/conflicting definitions below this line by ensuring the above are authoritative. 