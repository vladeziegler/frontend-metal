import React from 'react';
import Image from 'next/image';

// No longer using next/image for the logos
// import Image from 'next/image';

// This component is a structural representation of the provided HTML.
// It uses the classes from imported-newsletter.css.
// For now, content is hardcoded to match the original design.
// It can be refactored later to accept props for dynamic content.

const ImportedNewsletter = () => {
  return (
    <div className="imported-newsletter-body">
      <div className="imported-newsletter-container">

        <div className="corrected-header-container">
          <div className="new-logo">
            <Image
              src="/BackbaseLogoSVG.svg"
              alt="Backbase Logo"
              width={25}
              height={25}
              className="backbase-logo-img"
            />
            <div className="new-logo-text">
              <span className="new-logo-text-banking">Banking</span>
              <span className="new-logo-text-reinvented">Reinvented</span>
            </div>
          </div>

          <h1 className="imported-newsletter-title">MOMENTUM</h1>
          
          <div className="by-backbase-wrapper">
            <span>by Backbase</span>
          </div>
        </div>

        <div className="imported-newsletter-content-section">
            <div className="imported-newsletter-section-body">
                Recently, we&apos;ve observed a significant shift in the investment landscape, with Venture Capitalists (VCs) championing a new M&A strategy known as &apos;Vertical AI Roll-Ups.&apos; This approach involves VCs acquiring traditional service businesses and embedding AI technology to unlock efficiencies and drive transformative growth. Unlike traditional private equity roll-ups focused on consolidation and cost-cutting, these AI-driven strategies prioritize technology-led value creation. This development is crucial for us as banking leaders, and in this newsletter, we&apos;ll explore why these AI roll-ups matter, their potential second-order effects, and the opportunities they present for our industry.
            </div>
        </div>

        <div className="imported-newsletter-content-section">
            <h2 className="imported-newsletter-section-title">Navigating the Ripple Effects: From AI Challenges to Strategic Action</h2>
            <div className="imported-newsletter-section-body">
                These AI roll-ups create significant ripples. We&apos;ll likely see hyper-efficient niche competitors emerge rapidly, as VCs aim to buy businesses at traditional valuations (e.g., 2x revenue) and sell them at tech multiples (e.g., 20x revenue) after AI integration. However, VCs will face challenges similar to ours: complex AI integration, with 18% of institutions citing poor data quality as a barrier, and heightened regulatory scrutiny, especially as only 23% of financial institutions have mature AI governance. To navigate this, we must act:
                Boost our internal AI capabilities and focus on clear business wins.
                Strengthen our data foundations for reliable AI.
                Develop AI talent and consider strategic tech partnerships.
                Stay vigilant to shifts in the competitive landscape. Proactive adaptation will be key to thriving in this AI-enhanced environment.
            </div>
        </div>
        
        <div className="imported-newsletter-content-section">
            <h2 className="imported-newsletter-section-title">Seizing the AI Opportunity: Building a Future-Ready Bank</h2>
            <div className="imported-newsletter-section-body">
                The rise of these AI-powered entities isn&apos;t just a threat; it&apos;s a catalyst for our own innovation. As VCs aim to quickly modernize acquired companies, it highlights the critical need for all banks to have a strong digital foundation. This means creating seamless customer experiences, developing new products quickly, and smoothly integrating technologies like AI. At Backbase, we provide an engagement banking platform designed to help banks achieve this – enabling you to innovate faster, personalize services at scale, and compete effectively in this AI-driven world. The question for all of us is: how prepared are our institutions to not only respond to these new players but to proactively use AI for transformative growth? Your next strategic moves in building an AI-ready bank will be crucial.
                <br/><br/>
                <p className="newsletter-takeaway">The emergence of AI-driven roll-ups underscores a clear imperative: financial institutions must accelerate their journey towards AI maturity and digital agility to define the future of banking, rather than be defined by it.</p>
            </div>
        </div>

        <div className="imported-newsletter-author-section">
            <Image src="/timProfilePic.png" alt="Tim Rutten" width={100} height={100} className="imported-newsletter-author-image" />
            <div className="imported-newsletter-author-details">
                <strong>Tim Rutten</strong><br/>
                Chief Marketing Officer, Backbase<br/>
                <a href="https://www.linkedin.com/in/timrutten" target="_blank" rel="noopener noreferrer" className="editor-link">Editor of the Executive Briefing Newsletter</a>
            </div>
        </div>
        <p className="subscribe-paragraph">
          Ps. Did you get this email forwarded? Subscribe <a href="https://www.backbase.com/strategy-call" target="_blank" rel="noopener noreferrer">here</a>
        </p>


        <div className="imported-newsletter-slide-section">
            <h2 className="imported-newsletter-section-highlight">Slide of the week</h2>
            <Image src="/Slideoftheweek.png" alt="Slide of the week" width={516} height={288} className="slide-image" />
        </div>

        <div className="imported-newsletter-content-section deep-dive-section">
            <h2 className="imported-newsletter-section-highlight">This made us think</h2>
            <ol className="imported-newsletter-list deep-dive-list">
                <li>
                <strong>VCs&apos; AI Gambit: Transforming Traditional Sectors Through Strategic Roll-Ups:</strong> Venture Capital is spearheading &apos;Vertical AI Roll-Ups,&apos; acquiring traditional service businesses to infuse them with AI, a strategy gaining traction as high interest rates and poor exits challenge Private Equity&apos;s dominance in roll-ups. This novel VC play to unlock value in non-tech sectors via AI underscores both the technology&apos;s vast potential and the risks of applying tech investment models to traditional operations. For leaders at large banks, this signals new AI-driven competitors and M&A shifts, illustrating the urgent need to accelerate internal AI adoption to innovate, manage risk, and serve a transforming market.
                </li>
                <li>
                <strong>AI in Banking: From Potential to Profit with Executive Leadership:</strong> The podcast &apos;AI revolution: transforming the banking landscape&apos; revealed that AI is no longer a fringe technology but a key, accessible driver for modernizing customer experiences and boosting bank efficiency. This evolution mandates that bank leaders champion AI adoption, targeting real-world gains like increased product penetration and enhanced customer engagement, as demonstrated by JPMorgan Chase&apos;s CEO-backed rollout of 300+ AI solutions. This summary from &apos;Banking Reinvented&apos; underscores why strategic AI integration is vital for competitive advantage. The critical takeaway is that unlocking AI&apos;s value requires strong executive sponsorship paired with a clear strategy to address specific business needs.
                </li>
            </ol>
        </div>

        <div className="imported-newsletter-podcast-section">
            <div className="imported-newsletter-podcast-image-container">
                <div className="podcast-reimagined-content">
                    <Image src="/Waves.svg" alt="Podcast soundwave" width={37} height={17} />
                    <div className="podcast-reimagined-text-container">
                        <span className="podcast-reimagined-title">Banking</span>
                        <span className="podcast-reimagined-title">Reinvented</span>
                    </div>
                    <span className="podcast-reimagined-subtext">The Podcast</span>
                </div>
            </div>
            <div className="imported-newsletter-podcast-details">
                <strong>Want to dive deeper?</strong><br/>
                Go listen to our podcast Banking Reinvented
                where we explore the various trends reshaping banks.<br/>
                <a href="#"><strong>Listen here <i className="fas fa-play-circle"></i></strong></a>
            </div>
        </div>

        <div className="imported-newsletter-movers-shakers-section">
            <h2 className="imported-newsletter-section-highlight">Movers & Shakers</h2>
            <ul className="imported-newsletter-list movers-shakers-list">
                <li><strong>Mark Whelan</strong>&nbsp;joins&nbsp;Australia and New Zealand Banking Group (ANZ)&nbsp;as&nbsp;Non-executive Director</li>
                <li><strong>Michelle Russell</strong>&nbsp;joins&nbsp;Australia and New Zealand Banking Group (ANZ)&nbsp;as&nbsp;Global Talent & Culture Digital Employee Experience</li>
                <li><strong>Stephen White</strong>&nbsp;joins&nbsp;Australia and New Zealand Banking Group (ANZ)&nbsp;as&nbsp;Group Executive Operations</li>
                <li><strong>Nuno Matos</strong>&nbsp;joins&nbsp;Australia and New Zealand Banking Group (ANZ)&nbsp;as&nbsp;Chief Executive Officer (CEO)</li>
                <li><strong>Fozia Amanulla</strong>&nbsp;joins&nbsp;Alliance Bank Malaysia Berhad&nbsp;as&nbsp;Chief Business Development Officer for Strategic Business Development Division</li>
                <li><strong>Rizal IL-Ehzan Fadil Azim</strong>&nbsp;joins&nbsp;Alliance Bank Malaysia Berhad&nbsp;as&nbsp;CEO</li>
                <li><strong>Michael Lehmbeck</strong>&nbsp;joins&nbsp;AgFirst Farm Credit Bank&nbsp;as&nbsp;Chief Information Officer</li>
            </ul>
        </div>

        <div className="imported-newsletter-events-section">
            <h2 className="imported-newsletter-section-highlight">Upcoming events</h2>
            <ul className="imported-newsletter-list">
                <li><strong>Banking Transformation Summit</strong>&nbsp;  •   June 18 2025, US Ent</li>
                <li><strong>Bahrain Decision-Makers Forum</strong>&nbsp;  •   June 23 2025, Bahrain</li>
                <li><strong>Finnovex Qatar</strong>&nbsp;  •   June 24 2025, Qatar</li>
                <li><strong>19th Maghreb Banking Summit</strong>&nbsp;  •   June 24 2025, Libya</li>
                <li><strong>Thailand Executive Roundtable</strong>&nbsp;  •   July 16 2025, Thailand</li>
                <li><strong>Revolution Banking Mexico</strong>&nbsp;  •   July 17 2025, Mexico</li>
            </ul>
        </div>

        <footer className="imported-newsletter-footer">
            <div className="imported-newsletter-footer-content">
                <p>
                    Want to talk more? <strong>Let's chat.</strong><br/>
                    All content in this newsletter was edited by Tim Rutten and the rest of the Backbase team. Sent by Backbase, Oosterdoksstraat 114, 1011 DK Amsterdam, The Netherlands
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

export default ImportedNewsletter; 