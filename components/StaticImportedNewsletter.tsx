import React from 'react';
import '../app/imported-newsletter.css';
import { GeneratedNewsletterData, ContentSection } from '@/lib/types';
import { AllDeepDivesWithUrlsForMetaSuggestionResponse } from '@/lib/store/deepDiveStore';
import { JobTrackingEntry } from '@/lib/store/jobTrackingStore';
import { UpcomingEvent } from '@/lib/store/eventsStore';

// Static version of ImportedNewsletter for HTML generation
// Uses standard img tags instead of Next.js Image components

// Helper to format dates consistently
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00Z`); // Assuming YYYY-MM-DD from backend
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

interface StaticImportedNewsletterProps {
  newsletter: GeneratedNewsletterData | null;
  deepDivesWithUrls: AllDeepDivesWithUrlsForMetaSuggestionResponse | null;
  jobTrackingEntries: JobTrackingEntry[];
  upcomingEvents: UpcomingEvent[];
}

const StaticImportedNewsletter: React.FC<StaticImportedNewsletterProps> = ({ 
  newsletter,
  deepDivesWithUrls,
  jobTrackingEntries,
  upcomingEvents,
}) => {
  // Always use deepDivesWithUrls - single source of truth
  const activeDives = deepDivesWithUrls;
  
  // Debug logging to understand data structure
  console.log('StaticImportedNewsletter Debug:', {
    hasDeepDivesWithUrls: !!deepDivesWithUrls,
    articleDeepDive: activeDives?.article_deep_dive,
    articleSourceUrl: activeDives?.article_deep_dive ? (activeDives.article_deep_dive as { source_url?: string }).source_url : undefined
  });

  // A helper function to render a section robustly, preventing errors if data is missing
  const renderSection = (section: ContentSection) => {
    if (!section || !section.title || !section.content) return null;
    return (
      <div className="imported-newsletter-content-section">
        <h2 className="imported-newsletter-section-title">{toSentenceCase(section.title)}</h2>
        <div className="imported-newsletter-section-body" dangerouslySetInnerHTML={{ __html: section.content }} />
      </div>
    );
  };

  // Helper function to process editor notes - make first sentence bold, rest italic
  const processEditorNotes = (editorNotes: string) => {
    if (!editorNotes) return '';
    
    // Find the first sentence (ending with . ! or ?)
    const firstSentenceMatch = editorNotes.match(/^[^.!?]*[.!?]/);
    
    if (firstSentenceMatch) {
      const firstSentence = firstSentenceMatch[0];
      const restOfText = editorNotes.substring(firstSentence.length).trim();
      
      if (restOfText) {
        return `<strong>${firstSentence}</strong> ${restOfText}`;
      } else {
        return `<strong>${firstSentence}</strong>`;
      }
    } else {
      // If no sentence ending found, make the whole thing bold
      return `<strong>${editorNotes}</strong>`;
    }
  };

  // Helper function to convert title case to sentence case
  const toSentenceCase = (text: string): string => {
    if (!text) return '';
    
    // First apply basic sentence case
    let result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    
    // Then preserve "AI" in all caps wherever it appears
    result = result.replace(/\bai\b/gi, 'AI');
    
    return result;
  };

  // Helper function to render deep dive title with optional URL (without bold)
  const renderDeepDiveTitle = (title: string, sourceUrl?: string | null) => {
    const sentenceCaseTitle = toSentenceCase(title);
    if (sourceUrl) {
      return `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" style="color: #3366FF;">${sentenceCaseTitle}:</a>`;
    } else {
      return `${sentenceCaseTitle}:`;
    }
  };

  // Helper function to safely get source URL from deep dive item
  const getSourceUrl = (item: { source_url?: string | null } | null | undefined): string | null => {
    return item?.source_url || null;
  };

  // Helper function to render deep dive content safely
  const renderDeepDiveContent = (item: { deep_dive_title?: string; deep_dive_content?: string; source_url?: string | null } | null | undefined): string => {
    if (!item) return '';
    
    const sourceUrl = getSourceUrl(item);
    const titleHtml = renderDeepDiveTitle(item.deep_dive_title || '', sourceUrl);
    const content = item.deep_dive_content || '';
    
    return `${titleHtml} ${content}`;
  };

  return (
    <div className="imported-newsletter-body">
      <div className="imported-newsletter-container">

        <div className="corrected-header-container" style={{position: 'relative', marginBottom: '40px', marginTop: '50px'}}>
          
          {/* Banking Reinvented logo - positioned above and left-aligned to MOMENTUM */}
          <div style={{position: 'absolute', top: '-45px', left: '0'}}>
            <img
              src="https://ik.imagekit.io/h3u86kveh/3xBanking.png?updatedAt=1751637214695"
              alt="Banking Reinvented Logo"
              width="120"
              height="25"
              style={{display: 'block', border: 0, outline: 'none'}}
            />
          </div>
          
          {/* MOMENTUM - full width base element */}
          <h1 className="imported-newsletter-title" style={{
            fontFamily: 'Arial, sans-serif', 
            fontWeight: '900', 
            fontSize: '79px', 
            color: '#000', 
            lineHeight: '1', 
            margin: '0', 
            padding: '0', 
            width: '100%',
            textAlign: 'center'
          }}>
            MOMENTUM
          </h1>
          
          {/* by Backbase - underneath and right-aligned */}
          <div style={{width: '100%', textAlign: 'right', marginTop: '10px'}}>
            <img
              src="https://ik.imagekit.io/h3u86kveh/3xbackbase.png?updatedAt=1751637267279"
              alt="by Backbase"
              width="76"
              height="16"
              style={{display: 'inline-block', border: 0, outline: 'none'}}
            />
          </div>
          
        </div>

        {/* --- EDITOR'S NOTES SECTION --- */}
        {newsletter?.editor_notes && (
          <div className="imported-newsletter-content-section editor-notes-section">
            <h2 className="imported-newsletter-section-title">Editor&apos;s notes</h2>
            <div 
              className="editor-notes-content" 
              dangerouslySetInnerHTML={{ __html: processEditorNotes(newsletter.editor_notes) }} 
            />
          </div>
        )}

        {/* --- DYNAMIC NEWSLETTER SECTIONS (Robust Implementation) --- */}
        {newsletter && (
          <>
            {renderSection(newsletter.section1)}
            {renderSection(newsletter.section2)}
            {renderSection(newsletter.section3)}
            {renderSection(newsletter.section4)}
            
            {newsletter.key_takeaway && (
              <div className="imported-newsletter-content-section">
                  <p className="newsletter-takeaway" dangerouslySetInnerHTML={{ __html: newsletter.key_takeaway }} />
              </div>
            )}
          </>
        )}

        <div className="imported-newsletter-author-section">
            <img 
              src="https://ik.imagekit.io/h3u86kveh/Tim%20Profile.png?updatedAt=1751884232601" 
              alt="Tim Rutten" 
              width="100" 
              height="100" 
              className="imported-newsletter-author-image" 
            />
            <div className="imported-newsletter-author-details">
                <strong>Tim Rutten</strong><br/>
                Chief Marketing Officer, Backbase<br/>
                <a href="https://www.linkedin.com/in/timrutten" target="_blank" rel="noopener noreferrer" className="editor-link">Editor of the Executive Briefing Newsletter</a>
            </div>
        </div>
        <p className="subscribe-paragraph">
          Ps. Did you get this email forwarded? Subscribe <a href="https://www.linkedin.com/in/timrutten" target="_blank" rel="noopener noreferrer">here</a>
        </p>


        <div className="imported-newsletter-slide-section">
            <h2 className="imported-newsletter-section-highlight">Slide of the week</h2>
            <img 
              src="https://ik.imagekit.io/h3u86kveh/Slideoftheweek.png?updatedAt=1750756399393&f=jpg" 
              alt="Slide of the week" 
              width="516" 
              height="288" 
              className="slide-image" 
            />
        </div>

        {/* --- DYNAMIC DEEP DIVE SECTION (Robust Implementation) --- */}
        {(activeDives?.article_deep_dive || activeDives?.research_deep_dive || activeDives?.podcast_deep_dive) && (
            <div className="imported-newsletter-content-section deep-dive-section">
                <h2 className="imported-newsletter-section-highlight">This made us think</h2>
                <ol className="imported-newsletter-list deep-dive-list">
                    {activeDives?.article_deep_dive && (
                        <li>
                           <p dangerouslySetInnerHTML={{ __html: renderDeepDiveContent(activeDives.article_deep_dive) }} />
                        </li>
                    )}
                    {activeDives?.research_deep_dive && (
                         <li>
                           <p dangerouslySetInnerHTML={{ __html: renderDeepDiveContent(activeDives.research_deep_dive) }} />
                        </li>
                    )}
                    {activeDives?.podcast_deep_dive && (
                         <li>
                           <p dangerouslySetInnerHTML={{ __html: renderDeepDiveContent(activeDives.podcast_deep_dive) }} />
                        </li>
                    )}
                </ol>
            </div>
        )}

        <div className="imported-newsletter-podcast-section" style={{display: 'flex', alignItems: 'stretch', margin: '50px 0', paddingBottom: '50px', borderBottom: '1px solid #E0E6EB', minHeight: '150px'}}>
            <div className="imported-newsletter-podcast-image-container" style={{width: '150px', minHeight: '150px', background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', color: '#fff', flexShrink: 0, position: 'relative', padding: '20px', overflow: 'hidden'}}>
                <div className="podcast-reimagined-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%', width: '100%'}}>
                    <img 
                      src="https://ik.imagekit.io/h3u86kveh/3xwave.png?updatedAt=1751637359774" 
                      alt="Podcast soundwave" 
                      width="37" 
                      height="17"
                      style={{display: 'block', border: 0}}
                    />
                    <div className="podcast-reimagined-text-container" style={{marginTop: '10px'}}>
                        <span className="podcast-reimagined-title" style={{display: 'block', fontFamily: 'Arial, sans-serif', fontWeight: '600', fontSize: '12px', color: 'white', lineHeight: '1.2'}}>Banking</span>
                        <span className="podcast-reimagined-title" style={{display: 'block', fontFamily: 'Arial, sans-serif', fontWeight: '600', fontSize: '12px', color: 'white', lineHeight: '1.2'}}>Reinvented</span>
                    </div>
                    <span className="podcast-reimagined-subtext" style={{marginTop: '10px', fontSize: '11px', color: '#69FEFF'}}>The Podcast</span>
                </div>
            </div>
            <div className="imported-newsletter-podcast-details" style={{background: '#A5FEFF', padding: '20px 34px', flexGrow: 1, fontSize: '14px', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <strong style={{fontSize: '14px', fontWeight: 'bold'}}>Want to dive deeper?</strong>
                Go listen to our podcast Banking Reinvented
                where we explore the various trends reshaping banks.<br/>
                <a href="http://rss.com/podcasts/banking-reinvented" target="_blank" rel="noopener noreferrer" style={{fontSize: '12px', color: '#000', fontWeight: 'bold', textDecoration: 'none', marginTop: '4px'}}>
                    <strong style={{fontSize: '12px'}}>Listen here</strong>
                    <img 
                      src="https://ik.imagekit.io/h3u86kveh/Play%20icon.png?updatedAt=1751884732636" 
                      alt="Play" 
                      width="16"
                      height="16"
                      style={{verticalAlign: 'middle', marginLeft: '6px', border: 0}}
                    />
                </a>
            </div>
        </div>

        {/* --- DYNAMIC MOVERS & SHAKERS --- */}
        {jobTrackingEntries && jobTrackingEntries.length > 0 && (
            <div className="imported-newsletter-movers-shakers-section">
                <h2 className="imported-newsletter-section-highlight">Movers & Shakers</h2>
                <ul className="imported-newsletter-list movers-shakers-list">
                    {jobTrackingEntries.map(entry => (
                        <li key={entry.id}>
                            {entry.news_source_url ? (
                                <>
                                    <a href={entry.news_source_url} target="_blank" rel="noopener noreferrer" style={{color: '#3366FF'}}>
                                        {entry.full_name}
                                    </a>
                                    &nbsp;joins&nbsp;{entry.bank_name}&nbsp;as&nbsp;{entry.role_title}
                                </>
                            ) : (
                                <>
                                    <strong>{entry.full_name}</strong>
                                    &nbsp;joins&nbsp;{entry.bank_name}&nbsp;as&nbsp;{entry.role_title}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* --- DYNAMIC UPCOMING EVENTS --- */}
        {upcomingEvents && upcomingEvents.length > 0 && (
            <div className="imported-newsletter-events-section">
                <h2 className="imported-newsletter-section-highlight">Upcoming events</h2>
                <ul className="imported-newsletter-list">
                    {upcomingEvents.map(event => (
                        <li key={event.id}>
                            <a href="https://www.backbase.com/events" target="_blank" rel="noopener noreferrer" style={{color: '#3366FF'}}>
                                {event['Event Name']}
                            </a>
                            &nbsp; • &nbsp;{formatDate(event['Event Date'])}, {event.Territory}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <footer className="imported-newsletter-footer" style={{background: '#F3F6F9', padding: '32px 42px', marginTop: '50px', marginLeft: '-5%', marginRight: '-5%'}}>
            <div className="imported-newsletter-footer-content" style={{maxWidth: '600px', margin: '0 auto', fontSize: '12px', color: '#000'}}>
                <p style={{fontSize: '12px', color: '#000', margin: '0 0 24px 0'}}>
                    Want to talk more? <strong>Let&apos;s chat.</strong><br/>
                    All content in this newsletter was edited by Tim Rutten and the rest of the Backbase team. Sent by Backbase, Oosterdoksstraat 114, 1011 DK Amsterdam, The Netherlands
                </p>
                <div className="footer-divider" style={{borderTop: '1px solid #E0E6EB', margin: '24px 0'}}></div>
                <div className="imported-newsletter-footer-bottom" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{fontSize: '12px', color: '#000'}}><strong>© Backbase</strong>   •   All rights reserved</div>
                    <div style={{fontSize: '12px'}}><a href="#" style={{textDecoration: 'underline', color: '#4E4E4E'}}>Unsubscribe</a>&nbsp;  •  &nbsp;<a href="#" style={{textDecoration: 'underline', color: '#4E4E4E'}}>Manage preferences</a></div>
                    <div className="imported-newsletter-footer-socials" style={{textAlign: 'center'}}>
                        <img 
                          src="https://ik.imagekit.io/h3u86kveh/LinkedIn%20icon.png?updatedAt=1751883568994" 
                          alt="LinkedIn" 
                          width="16" 
                          height="16"
                          style={{display: 'inline-block', border: 0, verticalAlign: 'middle', marginRight: '8px'}}
                        />
                        <img 
                          src="https://ik.imagekit.io/h3u86kveh/Facebook%20icon.png?updatedAt=1751883568978" 
                          alt="Facebook" 
                          width="16" 
                          height="16"
                          style={{display: 'inline-block', border: 0, verticalAlign: 'middle', marginRight: '8px'}}
                        />
                        <img 
                          src="https://ik.imagekit.io/h3u86kveh/insta%20icon.png?updatedAt=1751883569027" 
                          alt="Instagram" 
                          width="16" 
                          height="16"
                          style={{display: 'inline-block', border: 0, verticalAlign: 'middle'}}
                        />
                    </div>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default StaticImportedNewsletter; 