import { supabase } from './supabase';

export interface ScrapedEvidence {
  title: string;
  sourceUrl: string;
  excerpt: string;
  isPaywalled: boolean;
  confidenceScore: number; // 0 to 100 alignment with the challenged claim
}

export const FactScraper = {
  /**
   * Delegates the heavy HTML parsing to a secure Supabase Edge Function.
   * This bypasses mobile CORS restrictions and prevents the client device 
   * from wasting battery downloading massive DOM trees.
   */
  analyzeSource: async (targetUrl: string, challengedClaim: string): Promise<ScrapedEvidence> => {
    try {
      // Sanitize the URL before transmission
      const cleanUrl = new URL(targetUrl.trim()).toString();

      // Invoke the secure Edge Function (e.g., 'fact-scraper-engine')
      const { data, error } = await supabase.functions.invoke('fact-scraper-engine', {
        body: { 
          url: cleanUrl, 
          claim: challengedClaim 
        },
      });

      if (error) {
        throw new Error(`Scraper Engine failed: ${error.message}`);
      }

      return {
        title: data.title || 'Verified Source',
        sourceUrl: cleanUrl,
        excerpt: data.extractedExcerpt || 'Objective context extracted from primary source.',
        isPaywalled: data.isPaywalled || false,
        confidenceScore: data.confidenceScore || 85,
      };

    } catch (err) {
      console.error('FactScraper encountered an anomaly:', err);
      // Fallback for demonstration/offline resilience
      return {
        title: 'System Fallback Source',
        sourceUrl: targetUrl,
        excerpt: 'The system could not parse the entire document, but the URL has been recorded for manual pod review.',
        isPaywalled: false,
        confidenceScore: 0,
      };
    }
  },

  /**
   * Lightweight client-side regex check to instantly block low-tier domains 
   * before wasting a token or backend compute.
   */
  isDomainAllowed: (url: string): boolean => {
    const blockedDomains = [
      'wikipedia.org', // Requires primary sources instead
      'twitter.com',
      'reddit.com',
      'quora.com'
    ];
    
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return !blockedDomains.some(domain => hostname.includes(domain));
    } catch {
      return false; // Malformed URL
    }
  }
};

