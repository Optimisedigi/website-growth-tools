interface SerperResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

interface SerperResponse {
  organic: SerperResult[];
  searchParameters: {
    q: string;
    gl: string;
    hl: string;
  };
}

export class SerpService {
  private apiKey: string;
  private baseUrl = 'https://google.serper.dev/search';

  constructor() {
    this.apiKey = process.env.SERPER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('SERPER_API_KEY not found - falling back to mock data');
    }
  }

  async searchKeyword(keyword: string, targetDomain: string, location: string = 'us'): Promise<{
    position: number | null;
    searchVolume: number;
    opportunity: string;
  }> {
    if (!this.apiKey) {
      return this.getMockData();
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: keyword,
          ...this.parseLocationParams(location),
          hl: 'en',     // Language code (English)
          num: 100,     // Number of results (max 100)
        }),
      });

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.status}`);
      }

      const data: SerperResponse = await response.json();
      
      // Find the target domain in the results
      const position = this.findDomainPosition(data.organic, targetDomain);
      
      return {
        position,
        searchVolume: this.estimateSearchVolume(keyword),
        opportunity: this.calculateOpportunity(position, keyword),
      };
    } catch (error) {
      console.error('SERP API error:', error);
      // Fallback to mock data on error
      return this.getMockData();
    }
  }

  private findDomainPosition(results: SerperResult[], targetDomain: string): number | null {
    // Clean the target domain (remove protocol and www)
    const cleanTarget = this.cleanDomain(targetDomain);
    
    for (let i = 0; i < results.length; i++) {
      const resultUrl = results[i].link.toLowerCase();
      const targetUrl = targetDomain.toLowerCase();
      
      // Extract full domain from both URLs for comparison
      const resultDomain = this.cleanDomain(resultUrl);
      
      // Check if the result is from the target domain (including subdomains and paths)
      if (resultUrl.includes(cleanTarget) || resultDomain === cleanTarget) {
        return i + 1; // Position is 1-indexed
      }
    }
    
    return null; // Not found in top 100
  }

  private parseLocationParams(location: string): { gl?: string; loc?: string } {
    // Handle city-level targeting with format "country:city"
    if (location.includes(':')) {
      const [country, city] = location.split(':');
      return {
        gl: country, // Country code
        loc: this.getCityLocationString(country, city) // City location string
      };
    }
    
    // Default to country-level targeting
    return { gl: location };
  }

  private getCityLocationString(country: string, city: string): string {
    // Map city codes to full location strings for Serper API
    const cityMap: Record<string, string> = {
      // United States
      'us:new-york': 'New York, NY, United States',
      'us:los-angeles': 'Los Angeles, CA, United States',
      'us:chicago': 'Chicago, IL, United States',
      'us:houston': 'Houston, TX, United States',
      'us:miami': 'Miami, FL, United States',
      'us:atlanta': 'Atlanta, GA, United States',
      'us:seattle': 'Seattle, WA, United States',
      'us:denver': 'Denver, CO, United States',
      
      // Canada
      'ca:toronto': 'Toronto, ON, Canada',
      'ca:vancouver': 'Vancouver, BC, Canada',
      'ca:montreal': 'Montreal, QC, Canada',
      
      // United Kingdom
      'gb:london': 'London, England, United Kingdom',
      'gb:manchester': 'Manchester, England, United Kingdom',
      'gb:birmingham': 'Birmingham, England, United Kingdom',
      
      // Australia
      'au:sydney': 'Sydney, NSW, Australia',
      'au:melbourne': 'Melbourne, VIC, Australia',
      'au:brisbane': 'Brisbane, QLD, Australia',
      'au:perth': 'Perth, WA, Australia',
      
      // Germany
      'de:berlin': 'Berlin, Germany',
      'de:munich': 'Munich, Germany',
      'de:hamburg': 'Hamburg, Germany',
      
      // France
      'fr:paris': 'Paris, France',
      'fr:lyon': 'Lyon, France',
      'fr:marseille': 'Marseille, France',
      
      // Spain
      'es:madrid': 'Madrid, Spain',
      'es:barcelona': 'Barcelona, Spain',
      
      // Italy
      'it:rome': 'Rome, Italy',
      'it:milan': 'Milan, Italy',
      
      // Netherlands
      'nl:amsterdam': 'Amsterdam, Netherlands',
      
      // Brazil
      'br:sao-paulo': 'São Paulo, Brazil',
      'br:rio-de-janeiro': 'Rio de Janeiro, Brazil',
      
      // Mexico
      'mx:mexico-city': 'Mexico City, Mexico',
      
      // India
      'in:mumbai': 'Mumbai, India',
      'in:delhi': 'New Delhi, India',
      'in:bangalore': 'Bangalore, India',
      
      // Japan
      'jp:tokyo': 'Tokyo, Japan',
      'jp:osaka': 'Osaka, Japan',
      
      // South Korea
      'kr:seoul': 'Seoul, South Korea',
    };
    
    const locationKey = `${country}:${city}`;
    return cityMap[locationKey] || `${city}, ${country}`;
  }

  private cleanDomain(url: string): string {
    try {
      // Remove protocol if present
      let domain = url.replace(/^https?:\/\//, '');
      // Remove www. if present
      domain = domain.replace(/^www\./, '');
      // Remove path, query, and fragment
      domain = domain.split('/')[0];
      return domain.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  private estimateSearchVolume(keyword: string): number {
    // Simple heuristic based on keyword characteristics
    const length = keyword.length;
    const wordCount = keyword.split(' ').length;
    
    // Shorter, single words tend to have higher volume
    if (wordCount === 1 && length < 8) {
      return Math.floor(Math.random() * 50000) + 10000; // 10K-60K
    } else if (wordCount <= 2 && length < 15) {
      return Math.floor(Math.random() * 20000) + 5000; // 5K-25K
    } else if (wordCount <= 3) {
      return Math.floor(Math.random() * 10000) + 1000; // 1K-11K
    } else {
      return Math.floor(Math.random() * 2000) + 100; // 100-2.1K
    }
  }

  private calculateOpportunity(position: number | null, keyword: string): string {
    const searchVolume = this.estimateSearchVolume(keyword);
    
    if (!position) {
      // Not ranking - high opportunity if good search volume
      return searchVolume > 5000 ? 'critical' : searchVolume > 1000 ? 'high' : 'medium';
    }
    
    if (position > 50) {
      return searchVolume > 2000 ? 'high' : 'medium';
    } else if (position > 20) {
      return searchVolume > 5000 ? 'medium' : 'low';
    } else if (position > 10) {
      return 'low';
    } else {
      return 'low'; // Already in top 10
    }
  }

  private getMockData(): { position: number | null; searchVolume: number; opportunity: string } {
    const rand = Math.random();
    let position: number | null;
    
    if (rand < 0.15) position = null; // 15% chance of not ranking
    else if (rand < 0.25) position = Math.floor(Math.random() * 10) + 1; // Top 10
    else if (rand < 0.45) position = Math.floor(Math.random() * 10) + 11; // 11-20
    else if (rand < 0.75) position = Math.floor(Math.random() * 30) + 21; // 21-50
    else position = Math.floor(Math.random() * 50) + 51; // 51-100

    const volumes = [100, 250, 500, 800, 1200, 1900, 2400, 3200, 4400, 6600, 8100, 12100, 18000, 27100];
    const searchVolume = volumes[Math.floor(Math.random() * volumes.length)];
    
    const levels = ["low", "medium", "high", "critical"];
    const weights = [0.4, 0.35, 0.2, 0.05];
    const randOpp = Math.random();
    let cumulative = 0;
    let opportunity = "low";
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (randOpp < cumulative) {
        opportunity = levels[i];
        break;
      }
    }

    return { position, searchVolume, opportunity };
  }
}

export const serpService = new SerpService();