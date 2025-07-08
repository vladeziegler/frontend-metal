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

        {/* ================= HEADER : Gmail-safe ================= */}
        <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0 40px 0'}}>
          <tbody>
            {/* Banking Reinvented logo row */}
            <tr>
              <td align="left" style={{paddingBottom: '8px'}}>
                <img
                  src="https://ik.imagekit.io/h3u86kveh/3xBanking.png?updatedAt=1751637214695"
                  alt="Banking Reinvented Logo"
                  width="120"
                  height="26"
                  style={{display: 'block', border: 0, outline: 'none'}}
                />
              </td>
            </tr>

            {/* MOMENTUM row */}
            <tr>
              <td align="center">
                <h1 className="imported-newsletter-title" style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 900,
                  fontSize: '79px',
                  lineHeight: 1,
                  color: '#000',
                  margin: 0,
                  padding: 0
                }}>
                  MOMENTUM
                </h1>
              </td>
            </tr>

            {/* by Backbase row */}
            <tr>
              <td align="center">
                <div style={{textAlign: 'right', marginTop: '5px'}}>
                  <img
                    src="https://ik.imagekit.io/h3u86kveh/3xbackbase.png?updatedAt=1751637267279"
                    alt="by Backbase"
                    width="87"
                    height="16"
                    style={{display: 'inline-block', border: 0, outline: 'none'}}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

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

        {/* ================= PODCAST CARD : Gmail-safe ================= */}
        <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0', borderBottom: '1px solid #E0E6EB'}}>
          <tbody>
            <tr>
              {/* LEFT column – black box */}
              <td width="150" style={{padding: '20px', backgroundColor: '#000000', verticalAlign: 'top'}}>
                <table cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <td>
                        <img src="https://ik.imagekit.io/h3u86kveh/3xwave.png?updatedAt=1751637359774" alt="Podcast soundwave" width="37" height="17" style={{display: 'block', border: 0}} />
                      </td>
                    </tr>
                    <tr><td height="10"></td></tr>
                    <tr>
                      <td style={{fontFamily:'Arial, sans-serif', fontSize:'12px', fontWeight:600, color:'#FFFFFF', lineHeight:'1.2'}}>
                        Banking<br/>Reinvented
                      </td>
                    </tr>
                    <tr><td height="10"></td></tr>
                    <tr>
                      <td style={{fontSize:'11px', color:'#69FEFF'}}>The&nbsp;Podcast</td>
                    </tr>
                  </tbody>
                </table>
              </td>

              {/* RIGHT column – cyan copy */}
              <td style={{padding: '20px 34px', fontFamily:'Arial, sans-serif', fontSize:'14px', color:'#000000', backgroundColor: '#A5FEFF', verticalAlign: 'top'}}>
                <strong style={{fontSize:'14px'}}>Want to dive&nbsp;deeper?</strong> Go listen to our podcast Banking&nbsp;Reinvented where we explore the various trends reshaping banks.<br/><br/>
                <a href="http://rss.com/podcasts/banking-reinvented" target="_blank" rel="noopener noreferrer" style={{fontSize:'12px', fontWeight:'bold', color:'#000000', textDecoration:'none'}}>
                  Listen&nbsp;here&nbsp;
                  <img src="https://ik.imagekit.io/h3u86kveh/Play%20icon.png?updatedAt=1751884732636" alt="Play" width="16" height="16" style={{verticalAlign:'middle', border:0}} />
                </a>
              </td>
            </tr>
          </tbody>
        </table>

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
                        <a href="https://www.linkedin.com/company/backbase/" target="_blank" rel="noopener noreferrer">
                          <img 
                            src="https://ik.imagekit.io/h3u86kveh/LinkedIn%20icon.png?updatedAt=1751883568994" 
                            alt="LinkedIn" 
                            width="16" 
                            height="16"
                            style={{display: 'inline-block', border: 0, verticalAlign: 'middle', marginRight: '8px'}}
                          />
                        </a>
                        <a href="https://www.facebook.com/backbase/" target="_blank" rel="noopener noreferrer">
                          <img 
                            src="https://ik.imagekit.io/h3u86kveh/Facebook%20icon.png?updatedAt=1751883568978" 
                            alt="Facebook" 
                            width="16" 
                            height="16"
                            style={{display: 'inline-block', border: 0, verticalAlign: 'middle', marginRight: '8px'}}
                          />
                        </a>
                        <a href="https://www.instagram.com/backbase_global/?hl=en" target="_blank" rel="noopener noreferrer">
                          <img 
                            src="https://ik.imagekit.io/h3u86kveh/insta%20icon.png?updatedAt=1751883569027" 
                            alt="Instagram" 
                            width="16" 
                            height="16"
                            style={{display: 'inline-block', border: 0, verticalAlign: 'middle'}}
                          />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default StaticImportedNewsletter; 