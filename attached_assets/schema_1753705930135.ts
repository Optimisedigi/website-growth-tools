import { z } from "zod";

// Helper function to normalize URLs by adding protocol if missing
export function normalizeUrl(url: string): string {
  const trimmedUrl = url.trim();
  
  // If already has protocol, return as is
  if (trimmedUrl.match(/^https?:\/\//i)) {
    return trimmedUrl;
  }
  
  // Add https:// by default
  return `https://${trimmedUrl}`;
}

export const auditRequestSchema = z.object({
  websiteUrl: z.string().min(1, "Please enter a website URL"),
  conversionGoal: z.string().min(1, "Please specify your conversion goal"),
  businessType: z.string().optional(),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;

export interface AuditFinding {
  category: string;
  score: number;
  status: 'good' | 'warning' | 'critical';
  message: string;
  details?: string;
}

export interface AuditRecommendation {
  priority: number;
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact' | 'Low Impact';
  estimatedLift: string;
}

export interface AuditResults {
  id: number;
  websiteUrl: string;
  conversionGoal: string;
  overallScore: number;
  aboveFoldScore: number;
  ctaScore: number;
  navigationScore: number;
  contentScore: number;
  findings: AuditFinding[];
  recommendations: AuditRecommendation[];
  screenshot?: string; // Base64 encoded screenshot
  extractedContent: {
    headline: string;
    subHeadlines: string[];
    navigationItems: string[];
    ctaTexts: string[];
  };
  createdAt: string;
}