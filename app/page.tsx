"use client"

import React, { useEffect, useState } from 'react';
import { useTopicStore } from '@/lib/store/topicStore'; // Assuming @ is configured for src/ or lib/
import { useOutlineStore } from '@/lib/store/outlineStore'; // Adjust path as needed
import { useNewsletterStore } from '@/lib/store/newsletterStore'; // Import the new store
import { MetaSuggestion, GeneratedNewsletterData, ContentSection as NewsletterContentSection, ArticleOutlineSection } from '@/lib/types'; // Import the type
// import { ArticleOutline } from '@/lib/types'; // Types are used implicitly by stores
import JobTrackingDisplay from '@/components/JobTrackingDisplay';
// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Edit3, Send, AlertTriangle, Loader2 } from 'lucide-react'; // For icons
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// NEW: Import DeepDiveDisplay component
import DeepDiveDisplay from '@/components/DeepDiveDisplay';
import UpcomingEventsDisplay from '@/components/UpcomingEventsDisplay';

// Helper component for displaying individual outline sections
const DisplayOutlineSection: React.FC<{ section?: ArticleOutlineSection | null, defaultTitle: string }> = ({ section, defaultTitle }) => {
  if (!section) return <p>{defaultTitle}: Not provided.</p>;
  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold mb-1">{section?.heading || defaultTitle}</h4>
      {section?.content_points && section.content_points.length > 0 ? (
        <ul className="list-disc list-inside pl-4 text-gray-700 space-y-1">
          {section.content_points.map((point: string, index: number) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic">No specific content points provided.</p>
      )}
      {/* Supporting data references could be added here if needed */}
    </div>
  );
};

// NEW: Helper component for displaying the generated newsletter
const DisplayGeneratedNewsletter: React.FC<{ newsletter: GeneratedNewsletterData | null }> = ({ newsletter }) => {
  if (!newsletter) return <p className="text-center text-gray-600">No newsletter content to display.</p>;

  const renderSection = (section: NewsletterContentSection, defaultTitle: string) => (
    <div className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{section.title || defaultTitle}</h3>
      <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') || "<p><em>Content not available.</em></p>" }} />
    </div>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        {/* The newsletter itself doesn't have a main_title, it's derived from the outline. We can show a generic header or pass the outline title. */}
        <CardTitle className="text-2xl font-bold text-blue-700 text-center">Generated Newsletter Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {renderSection(newsletter.section1, "Section 1: Context")}

        {/* ADDED: Display Editor's Note Block */}
        {newsletter.editor_notes && (
          <div className="my-6 p-4 bg-blue-50 border border-blue-200 rounded-md shadow">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Editor&apos;s Note:</h3>
            <div className="prose prose-sm max-w-none text-blue-800" dangerouslySetInnerHTML={{ __html: newsletter.editor_notes.replace(/\n/g, '<br />') }} />
          </div>
        )}

        {renderSection(newsletter.section2, "Section 2: Why it Matters")}
        {renderSection(newsletter.section3, "Section 3: Second-order Effects & Actions")}
        {renderSection(newsletter.section4, "Section 4: Opportunities & Backbase Relevance")}

        <div className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Takeaway</h3>
          <p className="text-gray-700 italic leading-relaxed">{newsletter.key_takeaway || "Not provided."}</p>
        </div>

        {newsletter.source_urls && newsletter.source_urls.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Referenced Sources</h3>
            <ul className="list-disc list-inside pl-4 text-sm text-blue-600 space-y-1">
              {newsletter.source_urls.map((url: string, index: number) => (
                <li key={index}><a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a></li>
              ))}
            </ul>
          </div>
        )}
        {newsletter.llm_generation_error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                <p className="text-sm text-red-700">
                    <AlertTriangle className="inline-block mr-2 h-4 w-4" /> 
                    Note: The LLM reported an error during generation: {newsletter.llm_generation_error}
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function NewsletterGenerator() {
  // Step management from original UI
  const [step, setStep] = useState<"select" | "outline" | "writing">("select");

  // Zustand store integration
  const {
    topics,
    selectedTopicId,
    isLoadingTopics,
    isGeneratingTopics, // For the 'Generate New Topics' button
    errorTopics,
    fetchTopics,
    generateTopics, // Action to trigger new topic generation
    selectTopic, // Replaces original setSelectedTopic local state
  } = useTopicStore();

  const {
    outline,
    isLoadingOutline,
    errorOutline,
    generateOutline, // Action to trigger outline generation for selectedTopicId
    clearOutline, // Assuming clearOutline exists in outlineStore
  } = useOutlineStore();

  // NEW: Newsletter store integration
  const {
    generatedNewsletter,
    isLoadingNewsletter,
    errorNewsletter,
    triggerNewsletterGeneration,
    clearNewsletter,
    // New store items for editor notes and regeneration
    editorNotesInput,
    setEditorNotesInput,
    saveEditorNotes,
    isSavingEditorNotes,
    saveEditorNotesError,
    regenerateAndDisplayNewsletter,
    isRegeneratingNewsletter,
    regenerateNewsletterError,
  } = useNewsletterStore();

  // Fetch topics on initial load
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Effect to move to outline step when outline is loaded for the selected topic
  useEffect(() => {
    if (outline && selectedTopicId && !isLoadingOutline && step !== 'writing') {
      setStep("outline");
      // When outline is loaded, if a newsletter already exists for it, load its editor notes
      if (generatedNewsletter && generatedNewsletter.outline_id === outline.id) {
        setEditorNotesInput(generatedNewsletter.editor_notes || '');
      }
    }
    else if (!selectedTopicId && (step === "outline" || step === "writing")) {
        setStep("select");
        if (clearOutline) clearOutline();
        if (useNewsletterStore.getState().generatedNewsletter) clearNewsletter();
    }
  }, [outline, selectedTopicId, isLoadingOutline, step, clearOutline, clearNewsletter, generatedNewsletter, setEditorNotesInput]);

  const handleTopicSelect = (topicId: number) => {
    const newSelectedId = selectedTopicId === topicId ? null : topicId;
    selectTopic(newSelectedId);
    if (!newSelectedId) { // If deselecting
        setStep("select");
        if (clearOutline) clearOutline();
        if (useNewsletterStore.getState().generatedNewsletter) clearNewsletter();
    }
    // Do not change step here; wait for outline to load if generated or newsletter to load
  };

  const handleGenerateNewTopics = async () => {
    await generateTopics(); // This will set isGeneratingTopics and fetch new topics via store
    // User feedback (e.g., toast notification) can be handled based on isGeneratingTopics and errorTopics from store
  };

  const handleGenerateOutline = async () => {
    if (selectedTopicId) {
      if (useNewsletterStore.getState().generatedNewsletter) clearNewsletter(); // Clears newsletter and editorNotesInput
      const success = await generateOutline(selectedTopicId);
      if (!success) {
        // errorOutline from the store can be displayed in the UI
        console.error("Failed to generate outline:", errorOutline);
      }
    }
  };

  // UPDATED: Handle Newsletter Generation
  const handleSubmitNewsletter = async () => {
    if (outline && outline.id) {
      // No longer returns boolean, directly sets store state
      await triggerNewsletterGeneration(outline.id);
      // Check store state for success/error. If no error and newsletter exists, move to writing.
      // The store action triggerNewsletterGeneration already sets editorNotesInput.
      if (useNewsletterStore.getState().generatedNewsletter && !useNewsletterStore.getState().triggerError) {
        setStep("writing");
      } else {
        console.error("Failed to generate newsletter:", useNewsletterStore.getState().triggerError);
      }
    }
  };

  // Determine the currently selected topic object from the topics list
  const currentSelectedTopic = topics.find(t => t.id === selectedTopicId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">Backbase</div>
            </div>
            {/* Optional: Add a button here to generate new topics if needed outside the main flow */}
            {/* <Button onClick={handleGenerateNewTopics} disabled={isGeneratingTopics} variant="outline">{isGeneratingTopics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Generate New Topics</Button> */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Newsletter Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create compelling financial services newsletters with AI-powered insights. Select a topic, review the
            outline, add your editorial perspective, and generate professional content.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
                <div className={`flex items-center ${(step === "select" && !isLoadingTopics && !isLoadingOutline) ? "text-blue-600" : "text-green-600"}`}>
                  {(step === "select" && !isLoadingTopics && !isLoadingOutline && !generatedNewsletter) ? <FileText className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
              <span className="font-medium">Select Topic</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
                <div className={`flex items-center ${step === "outline" && !isLoadingNewsletter ? "text-blue-600" : (step === "writing" || (step === "outline" && generatedNewsletter)) ? "text-green-600" : "text-gray-400"}`}>
                  {(step === "writing" || (step === "outline" && generatedNewsletter && !isLoadingNewsletter)) ? <CheckCircle className="w-5 h-5 mr-2" /> : <Edit3 className="w-5 h-5 mr-2" />}
              <span className="font-medium">Review Outline</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${step === "writing" ? "text-blue-600" : "text-gray-400"}`}>
                  {isLoadingNewsletter ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : generatedNewsletter ? <CheckCircle className="w-5 h-5 mr-2" /> : <Send className="w-5 h-5 mr-2" />}
              <span className="font-medium">Generate Newsletter</span>
            </div>
          </div>
        </div>

        {/* Step 1: Topic Selection */}
        {step === "select" && (
          <div className="space-y-6">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900">Choose Your Newsletter Topic</h2>
                  <Button onClick={handleGenerateNewTopics} disabled={isGeneratingTopics || isLoadingTopics} variant="outline">
                    {isGeneratingTopics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '✨'}
                    {isGeneratingTopics ? 'Generating...' : 'Generate New Topics'}
                  </Button>
                </div>
                {isLoadingTopics && <div className="text-center py-4"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /> <p>Loading topics...</p></div>}
                {errorTopics && <p className="text-red-600 text-center">Error loading topics: {errorTopics}</p>}
                
                {!isLoadingTopics && topics.length === 0 && !errorTopics && (
                  <p className="text-gray-600 text-center py-4">No topics available. Please generate some new topics.</p>
                )}

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
                  {topics.map((topic: MetaSuggestion) => ( // Use MetaSuggestion type
                <Card
                  key={topic.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${ selectedTopicId === topic.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:shadow-md"} ${topic.is_chosen ? "bg-green-50 border-green-400" : ""}`}
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">{topic.title}</CardTitle>
                          {selectedTopicId === topic.id && (
                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 ml-4" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                        <CardDescription className="text-gray-600 mb-4 leading-relaxed">{topic.snippet || "No snippet available"}</CardDescription>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                          {/* Dynamic data not available for these counts from current backend MetaSuggestion 
                          <span>{topic.source_article_ids?.length || 0} Source Articles</span>
                          <span>{topic.supporting_research_ids?.length || 0} Research Reports</span>
                          <span>{topic.supporting_podcast_ids?.length || 0} Podcast Episodes</span>
                          */} 
                          <span>Created: {new Date(topic.created_at).toLocaleDateString()}</span>
                          {topic.is_chosen && <span className="ml-2 px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-semibold text-xs">Chosen</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

                {selectedTopicId && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleGenerateOutline}
                      disabled={isLoadingOutline} // Use isLoadingOutline from store
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                      {isLoadingOutline ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Outline...</> : "Generate Article Outline"}
                </Button>
                    {errorOutline && <p className="text-red-500 mt-2">Error generating outline: {errorOutline}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Outline Review */}
            {step === "outline" && outline && outline.outline_data && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Generated Outline</h2>
                  <p className="text-gray-600">Review the AI-generated outline. Click below to generate the newsletter.</p>
                  {currentSelectedTopic && <p className="text-md font-semibold text-blue-700 mt-2">Topic: {currentSelectedTopic.title}</p>}
            </div>

            <Card>
              <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">{outline.main_title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Executive Summary</h3>
                      <p className="text-gray-700 leading-relaxed">{outline.initial_snippet}</p>
                </div>

                    <DisplayOutlineSection section={outline.outline_data.context_of_situation} defaultTitle="Context of the Situation" />
                    <DisplayOutlineSection section={outline.outline_data.why_it_matters_banking_initial} defaultTitle="Why it Matters (Initial)" />
                    
                    {outline.outline_data.body_second_order_effects && outline.outline_data.body_second_order_effects.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-1">Body - Second Order Effects</h4>
                        {outline.outline_data.body_second_order_effects.map((section, index) => (
                          <DisplayOutlineSection key={index} section={section} defaultTitle={`Second Order Effect ${index + 1}`} />
                        ))}
                </div>
                    )}

                    <DisplayOutlineSection section={outline.outline_data.why_it_matters_banking_concluding} defaultTitle="Why it Matters (Concluding)" />
                    <DisplayOutlineSection section={outline.outline_data.podcast_connection} defaultTitle="Podcast Connection" />
                    {outline.outline_data.backbase_mention && 
                      <DisplayOutlineSection section={outline.outline_data.backbase_mention} defaultTitle="Backbase Mention" />
                    }
                    <DisplayOutlineSection section={outline.outline_data.key_takeaways} defaultTitle="Key Takeaways" />

                    {outline.outline_data.source_content_summary && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="text-lg font-semibold mb-2 text-gray-600">Source Material Summary:</h4>
                        <ul className="list-disc list-inside pl-4 text-sm text-gray-500 space-y-1">
                          {outline.outline_data.source_content_summary.chosen_suggestion && <li>Meta Suggestion Details: Provided</li>}
                          {outline.outline_data.source_content_summary.source_articles && <li>Source Articles Count: {outline.outline_data.source_content_summary.source_articles.length}</li>}
                          {outline.outline_data.source_content_summary.supporting_research && <li>Supporting Research Count: {outline.outline_data.source_content_summary.supporting_research.length}</li>}
                          {outline.outline_data.source_content_summary.supporting_podcasts && <li>Supporting Podcasts Count: {outline.outline_data.source_content_summary.supporting_podcasts.length}</li>}
                  </ul>
                </div>
                    )}
                    {outline.error_message && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-300 rounded-md">
                            <p className="text-sm text-orange-700">
                                <AlertTriangle className="inline-block mr-2 h-4 w-4" /> 
                                Note from outline generation: {outline.error_message}
                            </p>
                        </div>
                    )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Editor&apos;s Notes</CardTitle>
                <CardDescription>
                  Add any specific instructions, tone adjustments, or additional points you&apos;d like to include in the
                  final newsletter.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="editor-notes" className="text-sm font-medium text-gray-700">
                  Your Editorial Input
                </Label>
                <Textarea
                  id="editor-notes"
                  placeholder="e.g., Emphasize the regulatory implications for European banks, include more specific examples from recent fintech partnerships, adjust tone to be more optimistic about AI adoption..."
                  className="mt-2 min-h-[120px]"
                />
              </CardContent>
            </Card> */}

            <div className="text-center">
              <Button
                onClick={handleSubmitNewsletter}
                    disabled={isLoadingNewsletter || isLoadingOutline}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                    {isLoadingNewsletter ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating Newsletter...</> : "Generate Final Newsletter"}
              </Button>
                  {errorNewsletter && <p className="text-red-500 mt-2">Error generating newsletter: {errorNewsletter}</p>}
                </div>
                <div className="text-center mt-4">
                    <Button variant="outline" onClick={() => { 
                        setStep("select"); 
                        if (clearOutline) clearOutline(); 
                        if (clearNewsletter) clearNewsletter(); 
                    }}>Back to Topic Selection</Button>
            </div>
          </div>
        )}

            {/* Step 3: Newsletter Writing/Review (includes editor notes and regeneration) */}
            {step === "writing" && generatedNewsletter && (
              <Card className="max-w-4xl mx-auto shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-gray-800">Review & Finalize Newsletter</CardTitle>
                  <CardDescription>
                    The newsletter content has been generated. Review the content below. You can add editor&apos;s notes to guide regeneration if needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  <div>
                    <Label htmlFor="editorNotes" className="block text-xl font-semibold text-gray-700 mb-2">
                      Editor&apos;s Notes
                    </Label>
                    <Textarea
                      id="editorNotes"
                      placeholder="Add your notes here to guide the regeneration or for your reference..."
                      value={editorNotesInput}
                      onChange={(e) => setEditorNotesInput(e.target.value)}
                      className="min-h-[120px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      disabled={isSavingEditorNotes || isRegeneratingNewsletter}
                    />
                    {saveEditorNotesError && (
                      <p className="text-sm text-red-600 mt-2">
                        <AlertTriangle className="inline-block mr-1 h-4 w-4" /> Error saving notes: {saveEditorNotesError}
                      </p>
                    )}
                    <div className="mt-4 flex space-x-3">
                      <Button 
                        onClick={() => saveEditorNotes(generatedNewsletter.id)}
                        disabled={isSavingEditorNotes || isRegeneratingNewsletter || editorNotesInput === (generatedNewsletter.editor_notes || '')}
                        size="lg"
                      >
                        {isSavingEditorNotes ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                          <>💾 Save Notes</>
                        )}
                      </Button>
                      <Button 
                        onClick={() => regenerateAndDisplayNewsletter(generatedNewsletter.id)}
                        disabled={isRegeneratingNewsletter || isSavingEditorNotes || !generatedNewsletter.editor_notes}
                        variant="secondary"
                        size="lg"
                      >
                        {isRegeneratingNewsletter ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...</>
                        ) : (
                          <>🔄 Regenerate with Notes</>
                        )}
                      </Button>
                    </div>
                    {regenerateNewsletterError && (
                      <p className="text-sm text-red-600 mt-2">
                        <AlertTriangle className="inline-block mr-1 h-4 w-4" /> Error regenerating: {regenerateNewsletterError}
                      </p>
                    )}
                  </div>

                  {/* Display the Generated Newsletter */}
                  {isLoadingNewsletter ? (
                    <div className="text-center py-10">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                      <p className="mt-3 text-lg text-gray-600">Loading newsletter...</p>
                  </div>
                  ) : errorNewsletter ? (
                    <div className="p-4 bg-red-50 border border-red-300 rounded-md text-red-700">
                      <AlertTriangle className="inline-block mr-2 h-5 w-5" /> 
                      Error loading newsletter: {errorNewsletter}
                    </div>
                  ) : (
                    <DisplayGeneratedNewsletter newsletter={generatedNewsletter} />
                  )}

                  {/* NEW: Display Deep Dive Content */}
                  {selectedTopicId && (
                    <>
                      <DeepDiveDisplay metaSuggestionId={selectedTopicId} />
                      <div className="pt-8">
                        <JobTrackingDisplay />
                        <UpcomingEventsDisplay />
                      </div>
                    </>
                  )}

              </CardContent>
            </Card>
            )}

            {/* Fallback for when step is writing but no newsletter (should ideally not happen if logic is correct) */}
            {step === "writing" && !generatedNewsletter && !isLoadingNewsletter && (
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Newsletter Generation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Please generate an outline first, then trigger newsletter generation.
                            {errorNewsletter && <span className="text-red-500 block mt-2">Error: {errorNewsletter}</span>}
                            {useNewsletterStore.getState().triggerError && <span className="text-red-500 block mt-2">Generation Trigger Error: {useNewsletterStore.getState().triggerError}</span>}
                        </p>
                    </CardContent>
                </Card>
            )}
            </div>
          {/* This column is now empty and will be removed by the edit. */}
          <div className="lg:col-span-1 space-y-8">
          </div>
        </div>
      </main>
    </div>
  )
}
