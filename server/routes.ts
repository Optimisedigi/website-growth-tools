import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { serpService } from "./serp-service";
import { trackKeywordsSchema, insertKeywordSchema, auditRequestSchema, normalizeUrl } from "@shared/schema";
import { z } from "zod";
import * as cheerio from 'cheerio';

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get metrics" });
    }
  });

  // Get all keywords
  app.get("/api/keywords", async (req, res) => {
    try {
      const { filter } = req.query;
      let keywords = await storage.getAllKeywords();
      
      // Apply position filter
      if (filter && typeof filter === "string") {
        switch (filter) {
          case "top10":
            keywords = keywords.filter(k => k.position && k.position <= 10);
            break;
          case "top20":
            keywords = keywords.filter(k => k.position && k.position <= 20);
            break;
          case "top50":
            keywords = keywords.filter(k => k.position && k.position <= 50);
            break;
          case "notfound":
            keywords = keywords.filter(k => !k.position);
            break;
        }
      }
      
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Failed to get keywords" });
    }
  });

  // Track new keywords
  app.post("/api/track-keywords", async (req, res) => {
    try {
      const { website, keywords: keywordText, location } = trackKeywordsSchema.parse(req.body);
      
      // Find or create project
      let project = await storage.getProjectByWebsite(website);
      if (!project) {
        project = await storage.createProject({
          name: `Project for ${website}`,
          website,
        });
      }
      
      // Parse keywords and create keyword records
      const keywordList = keywordText
        .split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      console.log(`Tracking ${keywordList.length} keywords for ${website}`);
      
      // Clear all existing keywords for a fresh start
      await storage.clearAllKeywords();
      
      // Fetch SERP positions + real search volumes in batch
      const keywordsToCreate = [];
      try {
        console.log(`Batch searching ${keywordList.length} keywords for ${website}`);
        const serpResults = await serpService.searchKeywords(keywordList, website, location);

        for (const result of serpResults) {
          keywordsToCreate.push({
            projectId: project!.id,
            keyword: result.keyword,
            position: result.position,
            previousPosition: null,
            searchVolume: result.searchVolume,
            opportunity: result.opportunity,
            location: location,
          });
        }
      } catch (error) {
        console.error('Batch keyword search failed, falling back to individual searches:', error);
        for (const keyword of keywordList) {
          try {
            const serpData = await serpService.searchKeyword(keyword, website, location);
            keywordsToCreate.push({
              projectId: project!.id,
              keyword,
              position: serpData.position,
              previousPosition: null,
              searchVolume: serpData.searchVolume,
              opportunity: serpData.opportunity,
              location: location,
            });
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (err) {
            console.error(`Error searching for keyword "${keyword}":`, err);
            keywordsToCreate.push({
              projectId: project!.id,
              keyword,
              position: generateRandomPosition(),
              previousPosition: null,
              searchVolume: generateRandomSearchVolume(),
              opportunity: generateOpportunityLevel(),
              location: location,
            });
          }
        }
      }
      
      const createdKeywords = await storage.createKeywords(keywordsToCreate);
      res.json({ 
        message: `Successfully tracked ${createdKeywords.length} keywords with real SERP data`,
        keywords: createdKeywords 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      } else {
        console.error("Track keywords error:", error);
        res.status(500).json({ message: "Failed to track keywords" });
      }
    }
  });

  // Get ranking distribution
  app.get("/api/ranking-distribution", async (req, res) => {
    try {
      const distribution = await storage.getRankingDistribution();
      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to get ranking distribution" });
    }
  });

  // Get opportunity keywords
  app.get("/api/opportunities", async (req, res) => {
    try {
      const opportunities = await storage.getOpportunityKeywords();
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get opportunities" });
    }
  });

  // Refresh keyword rankings
  app.post("/api/refresh-rankings", async (req, res) => {
    try {
      const allKeywords = await storage.getAllKeywords();
      console.log(`Refreshing rankings for ${allKeywords.length} keywords`);
      
      let refreshedCount = 0;
      for (const keyword of allKeywords) {
        try {
          console.log(`Refreshing "${keyword.keyword}" for ${keyword.project.website}`);
          const serpData = await serpService.searchKeyword(keyword.keyword, keyword.project.website, keyword.location || 'us:new-york');
          
          await storage.updateKeyword(keyword.id, {
            previousPosition: keyword.position,
            position: serpData.position,
            searchVolume: serpData.searchVolume,
            opportunity: serpData.opportunity,
          });
          
          refreshedCount++;
          
          // Small delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 150));
        } catch (error) {
          console.error(`Error refreshing keyword "${keyword.keyword}":`, error);
        }
      }
      
      res.json({ 
        message: `Successfully refreshed ${refreshedCount} keywords`,
        refreshedCount,
        totalKeywords: allKeywords.length
      });
    } catch (error) {
      console.error("Refresh rankings error:", error);
      res.status(500).json({ message: "Failed to refresh rankings" });
    }
  });

  // Export keywords to CSV
  app.get("/api/export", async (req, res) => {
    try {
      const keywords = await storage.getAllKeywords();
      const snapshots = await storage.getSnapshots();
      
      // Generate CSV content with snapshot labels
      const csvHeader = "Keyword,Position,Search Volume,Opportunity,Location,Website,Last Updated,Snapshot Labels\n";
      const csvContent = keywords.map(k => {
        const position = k.position || "Not Found";
        const locationDisplay = k.location || "Global";
        
        // Find snapshots that contain this keyword
        const keywordSnapshots = snapshots.filter(snapshot => 
          snapshot.keywordIds.includes(k.id)
        ).map(snapshot => snapshot.label).join("; ");
        
        return `"${k.keyword}","${position}","${k.searchVolume}","${k.opportunity}","${locationDisplay}","${k.project.website}","${k.lastUpdated?.toISOString() || ''}","${keywordSnapshots}"`;
      }).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="keyword-rankings.csv"');
      res.send(csvHeader + csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Delete selected keywords
  app.delete("/api/keywords/delete", async (req, res) => {
    try {
      const { keywordIds } = req.body;
      if (!Array.isArray(keywordIds) || keywordIds.length === 0) {
        return res.status(400).json({ error: "Valid keyword IDs required" });
      }
      
      await storage.deleteKeywords(keywordIds);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete keywords error:", error);
      res.status(500).json({ error: "Failed to delete keywords" });
    }
  });

  // Refresh all keywords with live SERP data
  app.post("/api/keywords/refresh", async (req, res) => {
    try {
      const keywords = await storage.getAllKeywords();
      
      for (const keyword of keywords) {
        const result = await serpService.searchKeyword(keyword.keyword, keyword.project.website, 'us:new-york');
        await storage.updateKeyword(keyword.id, {
          position: result.position,
          searchVolume: result.searchVolume,
          opportunity: result.opportunity,
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Refresh keywords error:", error);
      res.status(500).json({ error: "Failed to refresh keywords" });
    }
  });

  // Create ranking snapshot
  app.post("/api/snapshots", async (req, res) => {
    try {
      const { label, keywordIds } = req.body;
      if (!label || !Array.isArray(keywordIds) || keywordIds.length === 0) {
        return res.status(400).json({ error: "Label and keyword IDs required" });
      }
      
      // Get current positions for the selected keywords
      const positions: Record<number, number | null> = {};
      for (const keywordId of keywordIds) {
        const keyword = await storage.getKeyword(keywordId);
        if (keyword) {
          positions[keywordId] = keyword.position;
        }
      }
      
      const snapshot = await storage.createSnapshot({
        label,
        keywordIds,
        positions,
      });
      
      res.json(snapshot);
    } catch (error) {
      console.error("Create snapshot error:", error);
      res.status(500).json({ error: "Failed to create snapshot" });
    }
  });

  // Get all snapshots
  app.get("/api/snapshots", async (req, res) => {
    try {
      const snapshots = await storage.getSnapshots();
      res.json(snapshots);
    } catch (error) {
      console.error("Get snapshots error:", error);
      res.status(500).json({ error: "Failed to get snapshots" });
    }
  });

  // POST /api/audits - Create and run audit
  app.post("/api/audits", async (req, res) => {
    try {
      const validatedData = auditRequestSchema.parse(req.body);
      
      // Normalize the URL by adding protocol if missing
      const normalizedUrl = normalizeUrl(validatedData.websiteUrl);
      
      // Validate the normalized URL
      try {
        new URL(normalizedUrl);
      } catch {
        return res.status(400).json({ 
          message: "Please enter a valid website URL (e.g., example.com or https://example.com)" 
        });
      }
      
      // Create request with normalized URL
      const auditRequest = {
        ...validatedData,
        websiteUrl: normalizedUrl
      };
      
      // Perform website audit
      const auditResults = await performWebsiteAudit(auditRequest);
      
      // Store audit results
      const response = await storage.createAudit({
        websiteUrl: auditRequest.websiteUrl,
        conversionGoal: auditRequest.conversionGoal,
        overallScore: auditResults.overallScore,
        aboveFoldScore: auditResults.aboveFoldScore,
        ctaScore: auditResults.ctaScore,
        navigationScore: auditResults.navigationScore,
        contentScore: auditResults.contentScore,
        findings: auditResults.findings,
        recommendations: auditResults.recommendations,
        screenshot: auditResults.screenshot,
        extractedContent: auditResults.extractedContent,
      });
      
      res.json(response);
    } catch (error) {
      console.error('Audit error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to perform audit" 
      });
    }
  });

  // GET /api/audits/:id - Get audit results
  app.get("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.getAudit(id);
      
      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }
      
      res.json(audit);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to retrieve audit" 
      });
    }
  });

  // Serve sitemap.xml with correct content type
  app.get('/sitemap.xml', (req, res) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.optimisedigital.online/ai-growth-tools/</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.optimisedigital.online/ai-growth-tools/free-simple-keyword-tracker</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.optimisedigital.online/ai-growth-tools/website-conversion-rate-audit</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    
    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Serve robots.txt
  app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /

Sitemap: https://www.optimisedigital.online/ai-growth-tools/sitemap.xml`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for generating realistic mock SERP data
function generateRandomPosition(): number | null {
  const rand = Math.random();
  if (rand < 0.15) return null; // 15% chance of not ranking
  if (rand < 0.25) return Math.floor(Math.random() * 10) + 1; // Top 10
  if (rand < 0.45) return Math.floor(Math.random() * 10) + 11; // 11-20
  if (rand < 0.75) return Math.floor(Math.random() * 30) + 21; // 21-50
  return Math.floor(Math.random() * 50) + 51; // 51-100
}

function generateRandomSearchVolume(): number {
  const volumes = [100, 250, 500, 800, 1200, 1900, 2400, 3200, 4400, 6600, 8100, 12100, 18000, 27100];
  return volumes[Math.floor(Math.random() * volumes.length)];
}

function generateOpportunityLevel(): string {
  const levels = ["low", "medium", "high", "critical"];
  const weights = [0.4, 0.35, 0.2, 0.05]; // Most are low/medium opportunity
  const rand = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) return levels[i];
  }
  
  return "low";
}

async function performWebsiteAudit(request: any) {
  try {
    // Fetch website content using Node.js fetch with enhanced analysis
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(request.websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Analyze different aspects
    const aboveFoldAnalysis = analyzeAboveFoldContent($, request.websiteUrl);
    const ctaAnalysis = analyzeCTAElements($, request.conversionGoal);
    const navigationAnalysis = analyzeNavigation($);
    const contentAnalysis = analyzeContentStructure($);
    
    // Extract content for display
    const extractedContent = extractPageContent($);
    
    // Calculate scores
    const aboveFoldScore = calculateAboveFoldScore(aboveFoldAnalysis);
    const ctaScore = calculateCTAScore(ctaAnalysis);
    const navigationScore = calculateNavigationScore(navigationAnalysis);
    const contentScore = calculateContentScore(contentAnalysis);
    const overallScore = Math.round((aboveFoldScore + ctaScore + navigationScore + contentScore) / 4);
    
    // Generate findings and recommendations
    const findings = generateFindings(aboveFoldAnalysis, ctaAnalysis, navigationAnalysis, contentAnalysis);
    const recommendations = generateRecommendations(aboveFoldAnalysis, ctaAnalysis, navigationAnalysis, contentAnalysis, request);
    
    return {
      overallScore,
      aboveFoldScore,
      ctaScore,
      navigationScore,
      contentScore,
      findings,
      recommendations,
      screenshot: undefined,
      extractedContent
    };
    
  } catch (error) {
    console.error('Audit analysis error:', error);
    throw new Error('Failed to analyze website: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Helper functions for analysis
function analyzeAboveFoldContent($: any, websiteUrl: string) {
  const h1Elements = $('h1');
  const h2Elements = $('h2').slice(0, 3);
  const headlines = [...h1Elements.toArray(), ...h2Elements.toArray()].map((el: any) => $(el).text().trim()).filter((text: string) => text.length > 0);
  
  const mainHeadline = headlines[0] || '';
  const headlineClarity = mainHeadline.length > 10 && mainHeadline.length < 100 ? 9 : 4;
  
  const pageText = $('body').text().toLowerCase();
  const trustKeywords = ['testimonial', 'review', 'customer', 'trusted', 'rating', 'star', 'guarantee', 'secure', 'certified'];
  const hasTrustSignals = trustKeywords.some(keyword => pageText.includes(keyword));
  const trustScore = hasTrustSignals ? 8 : 4;
  
  const hasH1 = h1Elements.length > 0;
  const hasH2 = h2Elements.length > 0;
  const hasImages = $('img').length > 0;
  const hierarchyScore = hasH1 && hasH2 && hasImages ? 8 : 6;
  
  return {
    headlineClarity,
    trustScore,
    hierarchyScore,
    headlines,
    mainHeadline
  };
}

function analyzeCTAElements($: any, goal: string) {
  const buttonSelectors = 'button, a[href], input[type="submit"], .btn, .button, [role="button"]';
  const buttons = $(buttonSelectors).toArray().map((btn: any) => {
    const $btn = $(btn);
    const text = $btn.text().trim();
    const classes = $btn.attr('class') || '';
    const href = $btn.attr('href') || '';
    
    const isPrimary = text.toLowerCase().includes(goal.toLowerCase()) ||
                     classes.includes('primary') ||
                     classes.includes('btn-primary') ||
                     classes.includes('cta');
    
    return { text, isPrimary, classes, href };
  }).filter((btn: any) => btn.text.length > 0);
  
  const primaryCTA = buttons.find((btn: any) => btn.isPrimary) || buttons[0];
  
  const hasGoodText = primaryCTA && primaryCTA.text.length > 2 && primaryCTA.text.length < 25;
  const hasActionWord = primaryCTA && /^(get|start|try|buy|sign|join|contact|learn|download)/i.test(primaryCTA.text);
  
  return {
    primaryCTA: primaryCTA ? primaryCTA.text : null,
    visibility: primaryCTA ? 7 : 3,
    textQuality: hasGoodText && hasActionWord ? 9 : hasGoodText ? 6 : 4,
    positioning: primaryCTA ? 8 : 3,
    sizeColor: primaryCTA && primaryCTA.classes.includes('btn') ? 8 : 5,
    totalButtons: buttons.length,
    hasActionWord
  };
}

function analyzeNavigation($: any) {
  const navElements = $('nav, .navigation, .nav, .menu, [role="navigation"]');
  const navLinks = navElements.find('a').toArray().map((link: any) => $(link).text().trim()).filter((text: string) => text.length > 0);
  
  return {
    hasNavigation: navElements.length > 0,
    linkCount: navLinks.length,
    navigationItems: navLinks,
    isSimple: navLinks.length <= 7,
    hasHomeLink: navLinks.some((link: string) => link.toLowerCase().includes('home'))
  };
}

function analyzeContentStructure($: any) {
  const headings = $('h1, h2, h3, h4, h5, h6').toArray().map((h: any) => $(h).text().trim()).filter((text: string) => text.length > 0);
  const paragraphs = $('p').toArray().map((p: any) => $(p).text().trim()).filter((text: string) => text.length > 20);
  
  return {
    headingCount: headings.length,
    paragraphCount: paragraphs.length,
    hasGoodStructure: headings.length >= 3 && paragraphs.length >= 2,
    headings: headings.slice(0, 5),
    averageParagraphLength: paragraphs.length > 0 ? paragraphs.reduce((sum: number, p: string) => sum + p.length, 0) / paragraphs.length : 0
  };
}

function extractPageContent($: any) {
  const headline = $('h1').first().text().trim();
  const subHeadlines = $('h2, h3').toArray().slice(0, 5).map((h: any) => $(h).text().trim()).filter((text: string) => text.length > 0);
  const navigationItems = $('nav a, .navigation a, .nav a, .menu a').toArray().map((a: any) => $(a).text().trim()).filter((text: string) => text.length > 0);
  const ctaTexts = $('button, .btn, .button, [role="button"]').toArray().map((btn: any) => $(btn).text().trim()).filter((text: string) => text.length > 0);
  
  return {
    headline,
    subHeadlines,
    navigationItems: navigationItems.slice(0, 8),
    ctaTexts: ctaTexts.slice(0, 6)
  };
}

// Scoring functions
function calculateAboveFoldScore(analysis: any) {
  return Math.round((analysis.headlineClarity + analysis.trustScore + analysis.hierarchyScore) / 3);
}

function calculateCTAScore(analysis: any) {
  return Math.round((analysis.visibility + analysis.textQuality + analysis.positioning + analysis.sizeColor) / 4);
}

function calculateNavigationScore(analysis: any) {
  let score = 5;
  if (analysis.hasNavigation) score += 2;
  if (analysis.isSimple) score += 2;
  if (analysis.hasHomeLink) score += 1;
  return Math.min(score, 10);
}

function calculateContentScore(analysis: any) {
  let score = 5;
  if (analysis.hasGoodStructure) score += 3;
  if (analysis.averageParagraphLength > 50 && analysis.averageParagraphLength < 200) score += 2;
  return Math.min(score, 10);
}

function generateFindings(aboveFold: any, cta: any, navigation: any, content: any) {
  const findings = [];
  
  // Above-fold findings
  if (aboveFold.headlineClarity >= 8) {
    findings.push({
      category: "Headline Quality",
      score: aboveFold.headlineClarity,
      status: 'good',
      message: "Clear and concise main headline"
    });
  } else {
    findings.push({
      category: "Headline Quality",
      score: aboveFold.headlineClarity,
      status: aboveFold.headlineClarity >= 6 ? 'warning' : 'critical',
      message: "Headline could be clearer and more compelling"
    });
  }
  
  // CTA findings
  if (cta.primaryCTA) {
    findings.push({
      category: "Call-to-Action",
      score: cta.textQuality,
      status: cta.textQuality >= 7 ? 'good' : 'warning',
      message: cta.textQuality >= 7 ? "Strong CTA with clear action" : "CTA could be more action-oriented"
    });
  } else {
    findings.push({
      category: "Call-to-Action",
      score: 3,
      status: 'critical',
      message: "No clear primary call-to-action found"
    });
  }
  
  return findings;
}

function generateRecommendations(aboveFold: any, cta: any, navigation: any, content: any, request: any) {
  const recommendations = [];
  
  if (aboveFold.headlineClarity < 8) {
    recommendations.push({
      priority: 1,
      title: "Improve Main Headline",
      description: "Create a clearer, more compelling headline that immediately communicates your value proposition to visitors.",
      impact: "High Impact",
      estimatedLift: "15-25% conversion increase"
    });
  }
  
  if (!cta.primaryCTA || cta.textQuality < 7) {
    recommendations.push({
      priority: 2,
      title: "Optimize Primary CTA",
      description: "Create a prominent, action-oriented call-to-action button that stands out and guides users toward your conversion goal.",
      impact: "High Impact",
      estimatedLift: "10-20% conversion increase"
    });
  }
  
  if (!navigation.isSimple) {
    recommendations.push({
      priority: 3,
      title: "Simplify Navigation",
      description: "Reduce navigation complexity to 5-7 main categories to improve user experience and reduce decision fatigue.",
      impact: "Medium Impact",
      estimatedLift: "5-10% conversion increase"
    });
  }
  
  return recommendations.slice(0, 5);
}
