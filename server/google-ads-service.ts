interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

export class GoogleAdsService {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private developerToken: string;
  private customerId: string;
  private tokenCache: TokenCache | null = null;
  private configured: boolean;

  constructor() {
    this.clientId = process.env.GOOGLE_ADS_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET || '';
    this.refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN || '';
    this.developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '';
    this.customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/-/g, '');

    this.configured = !!(
      this.clientId &&
      this.clientSecret &&
      this.refreshToken &&
      this.developerToken &&
      this.customerId
    );

    if (!this.configured) {
      console.warn('[GoogleAds] Missing credentials — search volume will use heuristic fallback');
    } else {
      console.log('[GoogleAds] Configured with customer ID:', this.customerId);
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt - 60_000) {
      return this.tokenCache.accessToken;
    }

    console.log('[GoogleAds] Refreshing access token...');

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Token refresh failed (${response.status}): ${errorBody}`);
    }

    const data = await response.json();

    this.tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    console.log('[GoogleAds] Access token refreshed successfully');
    return this.tokenCache.accessToken;
  }

  /**
   * Fetch real search volumes from Google Ads Keyword Planner.
   * Returns a map of keyword -> monthly search volume.
   */
  async getSearchVolumes(keywords: string[]): Promise<Map<string, number>> {
    if (!this.configured || keywords.length === 0) {
      return new Map();
    }

    const accessToken = await this.getAccessToken();

    const url = `https://googleads.googleapis.com/v18/customers/${this.customerId}:generateKeywordHistoricalMetrics`;

    const body = {
      keywords,
      // Language: English
      language: 'languageConstants/1000',
      // Geo target: United States
      geoTargetConstants: ['geoTargetConstants/2840'],
    };

    console.log(`[GoogleAds] Fetching search volumes for ${keywords.length} keywords...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': this.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Google Ads API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const volumeMap = new Map<string, number>();

    console.log('[GoogleAds] API response:', JSON.stringify(data).slice(0, 500));

    if (data.results) {
      for (const result of data.results) {
        const keyword = result.text?.toLowerCase();
        const metrics = result.keywordMetrics;
        if (keyword && metrics) {
          // avgMonthlySearches is the main metric we want
          const volume = Number(metrics.avgMonthlySearches) || 0;
          volumeMap.set(keyword, volume);
        }
      }
    }

    console.log(`[GoogleAds] Got search volumes for ${volumeMap.size}/${keywords.length} keywords`);
    return volumeMap;
  }
}

export const googleAdsService = new GoogleAdsService();
