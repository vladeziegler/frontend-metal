import React from 'react';
import '../app/imported-newsletter.css';
import { GeneratedNewsletterData, ContentSection } from '@/lib/types';
import { AllDeepDivesWithUrlsForMetaSuggestionResponse } from '@/lib/store/deepDiveStore';
import { JobTrackingEntry } from '@/lib/store/jobTrackingStore';
import { UpcomingEvent } from '@/lib/store/eventsStore';

// Static version of ImportedNewsletter for HTML generation
// Uses standard img tags instead of Next.js Image components
// Email-compatible table-based layout with 650px width

// Helper to format dates consistently
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00Z`); // Assuming YYYY-MM-DD from backend
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

// Helper to prevent Outlook auto-formatting of dates using Zero-Width Non-Joiner characters
const formatDateForOutlook = (dateString: string | null | undefined) => {
    const formattedDate = formatDate(dateString);
    if (!formattedDate) return '';
    // Insert Zero-Width Non-Joiner characters to break Outlook's date pattern recognition
    return formattedDate.replace(/(\d+),?\s+(\d+)/g, '$1\u200C, \u200C$2');
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
  
  // Filter and limit job tracking entries (same logic as JobTrackingDisplay)
  const filteredJobEntries = React.useMemo(() => {
    if (!jobTrackingEntries || jobTrackingEntries.length === 0) return [];
    
    // Filter by appointment_date (last 14 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);
    
    const filtered = jobTrackingEntries.filter(entry => {
      if (!entry.appointment_date) return false;
      const appointmentDate = new Date(entry.appointment_date);
      return appointmentDate >= cutoffDate;
    });
    
    // Limit to 10 records
    return filtered.slice(0, 10);
  }, [jobTrackingEntries]);
  
  // Debug logging to understand data structure
  console.log('StaticImportedNewsletter Debug:', {
    hasDeepDivesWithUrls: !!deepDivesWithUrls,
    articleDeepDive: activeDives?.article_deep_dive,
    articleSourceUrl: activeDives?.article_deep_dive ? (activeDives.article_deep_dive as { source_url?: string }).source_url : undefined,
    totalJobEntries: jobTrackingEntries?.length || 0,
    filteredJobEntries: filteredJobEntries.length
  });

  // A helper function to render a section robustly, preventing errors if data is missing
  const renderSection = (section: ContentSection) => {
    if (!section || !section.title || !section.content) return null;
            return (
          <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '0 0 32px 0'}}>
        <tbody>
          <tr>
            <td style={{padding: '0 24px'}}>
              <h2 style={{
                fontFamily: 'Arial, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: '#000',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                {toSentenceCase(section.title)}
              </h2>
                              <div style={{
                  fontSize: '16px',
                  color: '#091c35',
                  lineHeight: '1.6',
                  fontFamily: 'Arial, sans-serif'
                }} dangerouslySetInnerHTML={{ __html: section.content }} />
            </td>
          </tr>
        </tbody>
      </table>
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
    /* ================= MASTER CONTAINER TABLE ================= */
    <table width="100%" cellPadding={0} cellSpacing={0} style={{
      maxWidth: '650px',
      width: '100%',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#091c35'
    }}>
      <tbody>
        <tr>
          <td>


            {/* ================= HEADER ================= */}
            <img
              src="https://ik.imagekit.io/h3u86kveh/HACK.png?updatedAt=1753099515120"
              alt="Banking Reinvented MOMENTUM by Backbase"
              width="1593"
              height="455"
              style={{
                width: '100%',
                maxWidth: '650px',
                height: 'auto',
                display: 'block',
                margin: '10px auto 20px auto'
              }}
            />

            {/* ================= EDITOR'S NOTES SECTION ================= */}
            {newsletter?.editor_notes && (
              <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '0 0 32px 0'}}>
                <tbody>
                  <tr>
                    <td style={{padding: '0 24px'}}>
                      <h2 style={{
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#000',
                        margin: '0 0 16px 0'
                      }}>
                        Editor&apos;s notes
                      </h2>
                      <div style={{
                        fontSize: '16px',
                        color: '#091c35',
                        fontStyle: 'italic',
                        lineHeight: '1.6',
                        fontFamily: 'Arial, sans-serif'
                      }} dangerouslySetInnerHTML={{ __html: processEditorNotes(newsletter.editor_notes) }} />
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* ================= DYNAMIC NEWSLETTER SECTIONS ================= */}
            {newsletter && (
              <>
                {renderSection(newsletter.section1)}
                {renderSection(newsletter.section2)}
                {renderSection(newsletter.section3)}
                {renderSection(newsletter.section4)}
                
                {newsletter.key_takeaway && (
                  <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '0 0 32px 0'}}>
                    <tbody>
                      <tr>
                        <td style={{padding: '0 24px'}}>
                          <p style={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#091c35',
                            lineHeight: '1.6',
                            fontFamily: 'Arial, sans-serif',
                            margin: 0
                          }} dangerouslySetInnerHTML={{ __html: newsletter.key_takeaway }} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* ================= AUTHOR SECTION ================= */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0 25px 0'}}>
              <tbody>
                <tr>
                  <td style={{padding: '0 24px'}}>
                    <table cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td style={{verticalAlign: 'top', paddingRight: '24px'}}>
                            <img 
                              src="https://ik.imagekit.io/h3u86kveh/Tim%20Profile.png?updatedAt=1751884232601" 
                              alt="Tim Rutten" 
                              width="100" 
                              height="100" 
                              style={{display: 'block', border: 0, maxWidth: '100%', height: 'auto'}}
                            />
                          </td>
                          <td style={{verticalAlign: 'top', fontSize: '14px', fontFamily: 'Arial, sans-serif', color: '#091c35'}}>
                            <strong style={{fontSize: '16px'}}>Tim Rutten</strong><br/>
                            Chief Marketing Officer, Backbase<br/>
                            <a href="https://www.linkedin.com/in/timrutten" target="_blank" rel="noopener noreferrer" style={{color: '#3366FF', textDecoration: 'none'}}>Editor of the Executive Briefing Newsletter</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ================= SUBSCRIBE PARAGRAPH ================= */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '0 0 50px 0', borderBottom: '1px solid #E0E6EB'}}>
              <tbody>
                <tr>
                  <td style={{padding: '0 24px 25px 24px', fontSize: '14px', fontStyle: 'italic', color: '#4E4E4E', fontFamily: 'Arial, sans-serif'}}>
                    Ps. Did you get this email forwarded? Subscribe <a href="https://www.backbase.com/ty/newsletter-thank-you-page" target="_blank" rel="noopener noreferrer" style={{color: '#3366FF', textDecoration: 'none'}}>here</a>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ================= SLIDE OF THE WEEK ================= */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0'}}>
              <tbody>
                <tr>
                  <td style={{padding: '0 24px'}}>
                    <h2 style={{
                      color: '#3366FF',
                      fontFamily: 'Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: '18px',
                      margin: '0 0 24px 0'
                    }}>
                      Slide of the week
                    </h2>
                    <img 
                      src="https://ik.imagekit.io/h3u86kveh/Slideoftheweek.png?updatedAt=1750756399393&f=jpg" 
                      alt="Slide of the week" 
                      width="516" 
                      height="288" 
                      style={{
                        width: '100%',
                        maxWidth: '602px',
                        height: 'auto',
                        border: '1px solid #f5f5f5',
                        display: 'block'
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ================= DEEP DIVE SECTION ================= */}
            {(activeDives?.article_deep_dive || activeDives?.research_deep_dive || activeDives?.podcast_deep_dive) && (
              <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0'}}>
                <tbody>
                  <tr>
                    <td style={{padding: '0 24px'}}>
                      <h2 style={{
                        color: '#3366FF',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        margin: '0 0 24px 0'
                      }}>
                        This made us think
                      </h2>
                      <ol style={{
                        fontSize: '16px',
                        paddingLeft: '1.5rem',
                        margin: 0,
                        fontFamily: 'Arial, sans-serif',
                        color: '#091c35',
                        lineHeight: '1.6'
                      }}>
                        {activeDives?.article_deep_dive && (
                          <li style={{marginBottom: '16px', paddingLeft: '0.5rem'}}>
                            <p style={{margin: 0}} dangerouslySetInnerHTML={{ __html: renderDeepDiveContent(activeDives.article_deep_dive) }} />
                          </li>
                        )}
                        {activeDives?.research_deep_dive && (
                          <li style={{marginBottom: '16px', paddingLeft: '0.5rem'}}>
                            <p style={{margin: 0}} dangerouslySetInnerHTML={{ __html: renderDeepDiveContent(activeDives.research_deep_dive) }} />
                          </li>
                        )}
                        {activeDives?.podcast_deep_dive && (
                          <li style={{marginBottom: '16px', paddingLeft: '0.5rem'}}>
                            <p style={{margin: 0}} dangerouslySetInnerHTML={{ __html: renderDeepDiveContent(activeDives.podcast_deep_dive) }} />
                          </li>
                        )}
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* ================= PODCAST CARD ================= */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0', borderBottom: '1px solid #E0E6EB'}}>
              <tbody>
                <tr>
                  <td style={{padding: '0 24px 50px 24px'}}>
                    <a href="http://rss.com/podcasts/banking-reinvented" target="_blank" rel="noopener noreferrer">
                      <img 
                        src="https://ik.imagekit.io/h3u86kveh/podcast%20card.png?updatedAt=1752497906537" 
                        alt="Banking Reinvented Podcast" 
                        width="1548" 
                        height="450" 
                        style={{
                          width: '100%',
                          maxWidth: '602px',
                          height: 'auto',
                          display: 'block',
                          border: 0
                        }}
                      />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ================= MOVERS & SHAKERS ================= */}
            {filteredJobEntries && filteredJobEntries.length > 0 && (
              <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0', paddingBottom: '50px', borderBottom: '1px solid #E0E6EB'}}>
                <tbody>
                  <tr>
                    <td style={{padding: '0 24px'}}>
                      <h2 style={{
                        color: '#3366FF',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        margin: '0 0 24px 0'
                      }}>
                        Movers & Shakers
                      </h2>
                      <ul style={{
                        fontSize: '16px',
                        paddingLeft: '20px',
                        margin: 0,
                        listStyleType: 'disc',
                        fontFamily: 'Arial, sans-serif',
                        color: '#091c35',
                        lineHeight: '1.6'
                      }}>
                        {filteredJobEntries.map(entry => (
                          <li key={entry.id} style={{
                            marginBottom: '12px'
                          }}>
                            {entry.news_source_url ? (
                              <>
                                <a href={entry.news_source_url} target="_blank" rel="noopener noreferrer" style={{color: '#3366FF', textDecoration: 'none'}}>
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
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* ================= UPCOMING EVENTS ================= */}
            {upcomingEvents && upcomingEvents.length > 0 && (
              <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0'}}>
                <tbody>
                  <tr>
                    <td style={{padding: '0 24px'}}>
                      <h2 style={{
                        color: '#3366FF',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        margin: '0 0 24px 0'
                      }}>
                        Upcoming events
                      </h2>
                      <ul style={{
                        fontSize: '16px',
                        paddingLeft: 0,
                        margin: 0,
                        listStyleType: 'none',
                        fontFamily: 'Arial, sans-serif',
                        color: '#091c35',
                        lineHeight: '1.6'
                      }}>
                        {upcomingEvents.map(event => (
                          <li key={event.id} style={{marginBottom: '12px'}}>
                            <a href="https://www.backbase.com/events" target="_blank" rel="noopener noreferrer" style={{color: '#3366FF', textDecoration: 'none'}}>
                              {event['Event Name']}
                            </a>
                            &nbsp; • &nbsp;{formatDateForOutlook(event['Event Date'])}, {event.Territory}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* ================= FOOTER ================= */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{margin: '50px 0 0 0', backgroundColor: '#F3F6F9'}}>
              <tbody>
                <tr>
                  <td style={{padding: '32px 42px'}}>
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td style={{fontSize: '12px', color: '#000', fontFamily: 'Arial, sans-serif', paddingBottom: '24px'}}>
                            Want to talk more? <strong>Let&apos;s chat.</strong><br/><br/>
                            All content in this newsletter was edited by Tim Rutten and the rest of the Backbase team. Sent by Backbase, Oosterdoksstraat 114, 1011 DK Amsterdam, The Netherlands
                          </td>
                        </tr>
                        <tr>
                          <td style={{borderTop: '1px solid #E0E6EB', paddingTop: '24px'}}>
                            <table width="100%" cellPadding={0} cellSpacing={0}>
                              <tbody>
                                {/* Row 1: Copyright */}
                                <tr>
                                  <td style={{fontSize: '12px', color: '#000', fontFamily: 'Arial, sans-serif', textAlign: 'center', paddingBottom: '8px'}}>
                                    <strong>© Backbase</strong> • All rights reserved
                                  </td>
                                </tr>
                                {/* Row 2: Unsubscribe */}
                                <tr>
                                  <td style={{fontSize: '12px', textAlign: 'center', paddingBottom: '8px'}}>
                                    <a href="https://www.backbase.com/ty/newsletter-unsubscribe-page" style={{textDecoration: 'underline', color: '#4E4E4E'}}>Unsubscribe</a>
                                  </td>
                                </tr>
                                {/* Row 3: LinkedIn */}
                                <tr>
                                  <td style={{textAlign: 'center'}}>
                                    <a href="https://www.linkedin.com/company/backbase/" target="_blank" rel="noopener noreferrer">
                                      <img 
                                        src="https://ik.imagekit.io/h3u86kveh/LinkedIn%20icon.png?updatedAt=1751883568994" 
                                        alt="LinkedIn" 
                                        width="16" 
                                        height="16"
                                        style={{display: 'block', border: 0, margin: '0 auto'}}
                                      />
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default StaticImportedNewsletter; 