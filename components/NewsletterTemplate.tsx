import React from 'react';
import { GeneratedNewsletterData } from '@/lib/types';
import { DeepDiveState } from '@/lib/store/deepDiveStore';
import { JobTrackingEntry } from '@/lib/store/jobTrackingStore';
import { UpcomingEvent } from '@/lib/store/eventsStore';

// Helper to format dates consistently
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00Z`); // Assuming YYYY-MM-DD from backend
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

// --- Component Props ---
interface NewsletterTemplateProps {
  newsletter: GeneratedNewsletterData | null;
  deepDives: DeepDiveState['deepDives'];
  jobTrackingEntries: JobTrackingEntry[];
  upcomingEvents: UpcomingEvent[];
}

// --- Main Template Component ---
const NewsletterTemplate: React.FC<NewsletterTemplateProps> = ({
  newsletter,
  deepDives,
  jobTrackingEntries,
  upcomingEvents,
}) => {
  // Destructure deep dives for cleaner access and to help TypeScript's type inference
  const article_deep_dive = deepDives?.article_deep_dive;
  const research_deep_dive = deepDives?.research_deep_dive;
  const podcast_deep_dive = deepDives?.podcast_deep_dive;

  // --- Brand and Style Definitions ---
  // These are defined as objects to be used in inline styles
  const brandColors = {
    bbBlue: '#003bdb',
    bbNavy: '#091c35',
    bbGray: '#64748b',
    bbPink: '#1345de',
  };

  const styles = {
    body: { margin: 0, padding: 0, background: '#f7f7f7', fontFamily: '"Libre Franklin", "Libre Franklin Fallback", sans-serif', lineHeight: 1.5, color: brandColors.bbNavy },
    container: { maxWidth: '640px', margin: '0 auto', background: '#ffffff', padding: '24px' },
    h1: { fontSize: '32px', color: brandColors.bbBlue, letterSpacing: '-1px', margin: '0 0 12px 0' },
    h2: { fontSize: '20px', color: brandColors.bbNavy, margin: '0 0 12px 0', fontWeight: 'bold' },
    h2Blue: { fontSize: '20px', color: brandColors.bbBlue, margin: '0 0 12px 0', fontWeight: 'bold' },
    h2Pink: { fontSize: '20px', color: brandColors.bbPink, margin: '0 0 12px 0', fontWeight: 'bold' },
    h3: { fontSize: '19px', color: brandColors.bbNavy, margin: '0 0 12px 0' },
    p: { margin: '0 0 16px 0' },
    a: { color: brandColors.bbBlue, textDecoration: 'underline' },
    sourceLink: { color: brandColors.bbGray, textDecoration: 'underline', fontSize: '13px' },
    divider: { borderTop: '1px solid #e2e8f0', margin: '40px 0' },
    callout: { background: '#eff6ff', border: '1px solid #c7d2fe', padding: '18px', borderRadius: '6px', margin: '0 0 16px 0' },
    small: { fontSize: '13px', color: brandColors.bbGray },
    tag: { display: 'inline-block', background: '#dbeafe', color: '#1e3a8a', fontSize: '12px', fontWeight: 600, borderRadius: '9999px', padding: '2px 8px', marginLeft: '6px' },
    ul: { paddingLeft: '20px', margin: '0 0 16px 0' },
    ol: { paddingLeft: '20px', margin: '0 0 16px 0' },
    li: { marginBottom: '10px' },
    pinkLi: { marginBottom: '10px', color: brandColors.bbPink },
    pinkLiStrong: { color: brandColors.bbPink, fontWeight: 'bold' },
    editor: { display: 'flex', alignItems: 'center', gap: '20px', margin: '32px 0' },
    editorImg: { borderRadius: '9999px', width: '120px', height: '120px', objectFit: 'cover' as const },
  };
  
  // A helper function to render a section with a divider
  const renderSection = (title: string, content: React.ReactNode, titleStyle: React.CSSProperties = styles.h2) => (
    <>
      <div style={styles.divider}></div>
      <h2 style={titleStyle}>{title}</h2>
      {content}
    </>
  );

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* --- HERO --- */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://ik.imagekit.io/h3u86kveh/backbase-logo-png_seeklogo-457182.png?updatedAt=1750070865004" alt="Backbase logo" style={{ width:'50%', maxWidth:'200px', margin:'-50px auto -50px auto', display:'block' }} />
        <p style={{...styles.small, textAlign: 'center'}}>
          {/* This part can be made dynamic later if needed */}
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} — Banking Reinvented Weekly Digest
        </p>

        {/* --- NEWSLETTER CONTENT --- */}
        {newsletter && (
          <>
            {renderSection(newsletter.section1.title, <div dangerouslySetInnerHTML={{ __html: newsletter.section1.content }} />)}
            {renderSection(newsletter.section2.title, <div dangerouslySetInnerHTML={{ __html: newsletter.section2.content }} />)}
            {renderSection(newsletter.section3.title, <div dangerouslySetInnerHTML={{ __html: newsletter.section3.content }} />)}
            {renderSection(newsletter.section4.title, <div dangerouslySetInnerHTML={{ __html: newsletter.section4.content }} />)}

            {/* Key takeaway now appears after section 4 */}
            {newsletter.key_takeaway && (
              <p style={{...styles.p, fontWeight: 'bold', marginTop: '16px'}}>
                {newsletter.key_takeaway}
              </p>
            )}
          </>
        )}

        {/* --- TIM'S NOTES (positioned before the portrait) --- */}
        {newsletter?.editor_notes && renderSection("Tim's Notes", (
            <div style={styles.callout}>
                <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: newsletter.editor_notes.replace(/\n/g, '<br />') }} />
            </div>
        ))}

        {/* --- PORTRAIT BLOCK --- */}
        <div style={styles.editor}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://ik.imagekit.io/h3u86kveh/timRutten%20Background%20Removed.png?updatedAt=1750071134948" 
            alt="Tim Rutten" 
            style={styles.editorImg} 
          />
          <div>
            <h3 style={{...styles.h3, color: brandColors.bbPink, marginBottom: '4px'}}>Tim Rutten</h3>
            <p style={{ margin: 0 }}><strong>Chief Marketing Officer, Backbase</strong></p>
            <p style={{...styles.small, margin: '6px 0 0 0'}}>Editor of the Banking Reinvented Newsletter</p>
          </div>
        </div>

        {/* --- DEEP DIVE INSIGHTS --- */}
        {deepDives && (
            <div style={styles.divider}></div>
        )}
        {(article_deep_dive || research_deep_dive || podcast_deep_dive) && (
            <div>
                <h2 style={styles.h2Pink}>This Made Us Think</h2>
                <ol style={styles.ol}>
                    {article_deep_dive && (
                        <li style={styles.li}>
                            <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: `<strong style="color: ${brandColors.bbPink};">${article_deep_dive.deep_dive_title}:</strong> ${article_deep_dive.deep_dive_content}` }} />
                        </li>
                    )}
                    {research_deep_dive && (
                        <li style={styles.li}>
                           <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: `<strong style="color: ${brandColors.bbPink};">${research_deep_dive.deep_dive_title}:</strong> ${research_deep_dive.deep_dive_content}` }} />
                        </li>
                    )}
                    {podcast_deep_dive && (
                        <li style={styles.li}>
                            <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: `<strong style="color: ${brandColors.bbPink};">${podcast_deep_dive.deep_dive_title}:</strong> ${podcast_deep_dive.deep_dive_content}` }} />
                        </li>
                    )}
                </ol>
            </div>
        )}

        {/* --- CTA FOR PODCAST --- */}
        <div>
          <p style={{ ...styles.p, textAlign: 'center', padding: '0 20px', margin: '40px 0' }}>
            Want to dive deeper? Go listen to our podcast <a href="https://rss.com/podcasts/banking-reinvented/" target="_blank" rel="noopener noreferrer" style={{ ...styles.a, color: brandColors.bbPink, fontWeight: 'bold' }}>Banking Reinvented</a> where Tim explores the various trends reshaping banks.
          </p>
        </div>

        {/* --- MOVERS & SHAKERS --- */}
        {jobTrackingEntries.length > 0 && renderSection('Movers & Shakers', (
          <ul style={styles.ul}>
            {jobTrackingEntries.map(entry => (
              <li key={entry.id} style={styles.li}>
                {entry.news_source_url ? (
                  <a href={entry.news_source_url} target="_blank" rel="noopener noreferrer" style={{ ...styles.pinkLiStrong, textDecoration: 'none' }}>
                    {entry.full_name}
                  </a>
                ) : (
                  <strong style={styles.pinkLiStrong}>{entry.full_name}</strong>
                )}
                {' '}joins {entry.bank_name} as {entry.role_title}.
              </li>
            ))}
          </ul>
        ), styles.h2Pink)}

        {/* --- UPCOMING EVENTS --- */}
        {upcomingEvents.length > 0 && renderSection('Upcoming Events', (
          <ul style={styles.ul}>
            {upcomingEvents.map(event => (
              <li key={event.id} style={styles.li}>
                <strong style={{color: brandColors.bbPink}}>{event['Event Name']}</strong> — {formatDate(event['Event Date'])} [{event.Territory}]
                {/* <span style={styles.tag}>{event.Type}</span> */}
              </li>
            ))}
          </ul>
        ), styles.h2Pink)}

        {/* --- SOURCES --- */}
        {newsletter?.source_urls && newsletter.source_urls.length > 0 && renderSection('Referenced Sources', (
          <ul style={styles.ul}>
            {newsletter.source_urls.map((url, index) => (
              <li key={index} style={styles.li}>
                <a href={url} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>{url}</a>
              </li>
            ))}
          </ul>
        ))}
        
        {/* --- FOOTER --- */}
        <div style={styles.divider}></div>
        <p style={{...styles.p, textAlign: 'center', marginBottom: '24px'}}>
          Want to talk more? <a href="mailto:tim@backbase.com" style={styles.a}>Let&apos;s chat.</a>
        </p>
        <p style={{...styles.small, textAlign: 'center'}}>
          All content in this newsletter was edited by Tim Rutten and the rest of the Backbase team team.<br />
          Sent with ❤️ by Backbase, Oosterdoksstraat 114, 1011 DK Amsterdam, The Netherlands<br />
          <a href="#" style={styles.a}>Unsubscribe</a> | <a href="#" style={styles.a}>Manage preferences</a>
        </p>
      </div>
    </div>
  );
};

export default NewsletterTemplate; 