import React from 'react';
import { GeneratedNewsletterData, ContentSection } from '@/lib/types';
import { DeepDiveState } from '@/lib/store/deepDiveStore';
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
  deepDives: DeepDiveState['deepDives'];
  jobTrackingEntries: JobTrackingEntry[];
  upcomingEvents: UpcomingEvent[];
}

const StaticImportedNewsletter: React.FC<StaticImportedNewsletterProps> = ({ 
  newsletter,
  deepDives,
  jobTrackingEntries,
  upcomingEvents,
}) => {
  // A helper function to render a section robustly, preventing errors if data is missing
  const renderSection = (section: ContentSection) => {
    if (!section || !section.title || !section.content) return null;
    return (
      <div className="imported-newsletter-content-section">
        <h2 className="imported-newsletter-section-title">{section.title}</h2>
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

  return (
    <div className="imported-newsletter-body">
      <div className="imported-newsletter-container">

        <div className="corrected-header-container">
          <div className="new-logo">
            <img
              src="https://ik.imagekit.io/h3u86kveh/BackbaseLogoSVG.svg?updatedAt=1750756425736"
              alt="Backbase Logo"
              width="25"
              height="25"
              className="backbase-logo-img"
            />
            <div className="new-logo-text">
              <span className="new-logo-text-banking">Banking</span>
              <span className="new-logo-text-reinvented">Reinvented</span>
            </div>
          </div>
          <h1 className="imported-newsletter-title">MOMENTUM</h1>
          <div className="by-backbase-wrapper">
            <span>by </span>
            <img
              src="https://ik.imagekit.io/h3u86kveh/BackBaseLogoSVGTEXT.svg?updatedAt=1750756501656"
              alt="Backbase"
              width="60"
              height="16"
              className="backbase-text-logo"
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
              src="https://ik.imagekit.io/h3u86kveh/TimImageSVG.svg?updatedAt=1750756286589" 
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
        {(deepDives?.article_deep_dive || deepDives?.research_deep_dive || deepDives?.podcast_deep_dive) && (
            <div className="imported-newsletter-content-section deep-dive-section">
                <h2 className="imported-newsletter-section-highlight">This made us think</h2>
                <ol className="imported-newsletter-list deep-dive-list">
                    {deepDives?.article_deep_dive && (
                        <li>
                           <p dangerouslySetInnerHTML={{ __html: `<strong>${deepDives.article_deep_dive.deep_dive_title}:</strong> ${deepDives.article_deep_dive.deep_dive_content}` }} />
                        </li>
                    )}
                    {deepDives?.research_deep_dive && (
                         <li>
                           <p dangerouslySetInnerHTML={{ __html: `<strong>${deepDives.research_deep_dive.deep_dive_title}:</strong> ${deepDives.research_deep_dive.deep_dive_content}` }} />
                        </li>
                    )}
                    {deepDives?.podcast_deep_dive && (
                         <li>
                           <p dangerouslySetInnerHTML={{ __html: `<strong>${deepDives.podcast_deep_dive.deep_dive_title}:</strong> ${deepDives.podcast_deep_dive.deep_dive_content}` }} />
                        </li>
                    )}
                </ol>
            </div>
        )}

        <div className="imported-newsletter-podcast-section">
            <div className="imported-newsletter-podcast-image-container">
                <div className="podcast-reimagined-content">
                    <img 
                      src="https://ik.imagekit.io/h3u86kveh/Waves.svg?updatedAt=1750756342031" 
                      alt="Podcast soundwave" 
                      width="37" 
                      height="17" 
                    />
                    <div className="podcast-reimagined-text-container">
                        <span className="podcast-reimagined-title">Banking</span>
                        <span className="podcast-reimagined-title">Reinvented</span>
                    </div>
                    <span className="podcast-reimagined-subtext">The Podcast</span>
                </div>
            </div>
            <div className="imported-newsletter-podcast-details">
                <strong>Want to dive deeper?</strong>
                Go listen to our podcast Banking Reinvented
                where we explore the various trends reshaping banks.<br/>
                <a href="http://rss.com/podcasts/banking-reinvented" target="_blank" rel="noopener noreferrer">
                    <strong>Listen here</strong>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                    </svg>
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
                            <strong>{entry.full_name}</strong>
                            &nbsp;joins&nbsp;{entry.bank_name}&nbsp;as&nbsp;{entry.role_title}
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
                            <strong>{event['Event Name']}</strong>
                            &nbsp; • &nbsp;{formatDate(event['Event Date'])}, {event.Territory}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <footer className="imported-newsletter-footer">
            <div className="imported-newsletter-footer-content">
                <p>
                    Want to talk more? <strong>Let&apos;s chat.</strong><br/>
                    All content in this newsletter was edited by Tim Rutten and the rest of the Backbase team. Sent by Backbase, Oosterdoksstraat 114, 1011 DK Amsterdam, The Netherlands
                </p>
                <div className="footer-divider"></div>
                <div className="imported-newsletter-footer-bottom">
                    <div><strong>© Backbase</strong>   •   All rights reserved</div>
                    <div><a>Unsubscribe</a>&nbsp;  •  &nbsp;<a>Manage preferences</a></div>
                    <div className="imported-newsletter-footer-socials">
                        <i className="fab fa-linkedin-in"></i>
                        <i className="fab fa-facebook-f"></i>
                        <i className="fab fa-instagram"></i>
                    </div>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default StaticImportedNewsletter; 