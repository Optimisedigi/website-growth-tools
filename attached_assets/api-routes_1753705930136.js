// API Routes for CRO Audit Tool
// Add these routes to your main app's server routes

import * as cheerio from 'cheerio';
import { auditRequestSchema, normalizeUrl } from '@shared/schema';

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
    
    // Store audit results (adapt to your storage system)
    const response = storage.createAudit({
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

async function performWebsiteAudit(request) {
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
function analyzeAboveFoldContent($, websiteUrl) {
  const h1Elements = $('h1');
  const h2Elements = $('h2').slice(0, 3);
  const headlines = [...h1Elements.toArray(), ...h2Elements.toArray()].map(el => $(el).text().trim()).filter(text => text.length > 0);
  
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

function analyzeCTAElements($, goal) {
  const buttonSelectors = 'button, a[href], input[type="submit"], .btn, .button, [role="button"]';
  const buttons = $(buttonSelectors).toArray().map(btn => {
    const $btn = $(btn);
    const text = $btn.text().trim();
    const classes = $btn.attr('class') || '';
    const href = $btn.attr('href') || '';
    
    const isPrimary = text.toLowerCase().includes(goal.toLowerCase()) ||
                     classes.includes('primary') ||
                     classes.includes('btn-primary') ||
                     classes.includes('cta');
    
    return { text, isPrimary, classes, href };
  }).filter(btn => btn.text.length > 0);
  
  const primaryCTA = buttons.find(btn => btn.isPrimary) || buttons[0];
  
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

function analyzeNavigation($) {
  const navElements = $('nav, .navigation, .nav, .menu, [role="navigation"]');
  const navLinks = navElements.find('a').toArray().map(link => $(link).text().trim()).filter(text => text.length > 0);
  
  return {
    hasNavigation: navElements.length > 0,
    linkCount: navLinks.length,
    navigationItems: navLinks,
    isSimple: navLinks.length <= 7,
    hasHomeLink: navLinks.some(link => link.toLowerCase().includes('home'))
  };
}

function analyzeContentStructure($) {
  const headings = $('h1, h2, h3, h4, h5, h6').toArray().map(h => $(h).text().trim()).filter(text => text.length > 0);
  const paragraphs = $('p').toArray().map(p => $(p).text().trim()).filter(text => text.length > 20);
  
  return {
    headingCount: headings.length,
    paragraphCount: paragraphs.length,
    hasGoodStructure: headings.length >= 3 && paragraphs.length >= 2,
    headings: headings.slice(0, 5),
    averageParagraphLength: paragraphs.length > 0 ? paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length : 0
  };
}

function extractPageContent($) {
  const headline = $('h1').first().text().trim();
  const subHeadlines = $('h2, h3').toArray().slice(0, 5).map(h => $(h).text().trim()).filter(text => text.length > 0);
  const navigationItems = $('nav a, .navigation a, .nav a, .menu a').toArray().map(a => $(a).text().trim()).filter(text => text.length > 0);
  const ctaTexts = $('button, .btn, .button, [role="button"]').toArray().map(btn => $(btn).text().trim()).filter(text => text.length > 0);
  
  return {
    headline,
    subHeadlines,
    navigationItems: navigationItems.slice(0, 8),
    ctaTexts: ctaTexts.slice(0, 6)
  };
}

// Scoring functions
function calculateAboveFoldScore(analysis) {
  return Math.round((analysis.headlineClarity + analysis.trustScore + analysis.hierarchyScore) / 3);
}

function calculateCTAScore(analysis) {
  return Math.round((analysis.visibility + analysis.textQuality + analysis.positioning + analysis.sizeColor) / 4);
}

function calculateNavigationScore(analysis) {
  let score = 5;
  if (analysis.hasNavigation) score += 2;
  if (analysis.isSimple) score += 2;
  if (analysis.hasHomeLink) score += 1;
  return Math.min(score, 10);
}

function calculateContentScore(analysis) {
  let score = 5;
  if (analysis.hasGoodStructure) score += 3;
  if (analysis.averageParagraphLength > 50 && analysis.averageParagraphLength < 200) score += 2;
  return Math.min(score, 10);
}

function generateFindings(aboveFold, cta, navigation, content) {
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

function generateRecommendations(aboveFold, cta, navigation, content, request) {
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