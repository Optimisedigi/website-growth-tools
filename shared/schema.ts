import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  keyword: text("keyword").notNull(),
  position: integer("position"), // null means not found in top 100
  previousPosition: integer("previous_position"),
  searchVolume: integer("search_volume").notNull().default(0),
  opportunity: text("opportunity").notNull().default("low"), // low, medium, high, critical
  location: text("location").notNull().default("us:new-york"), // search location
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const snapshots = pgTable("snapshots", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  keywordIds: integer("keyword_ids").array().notNull(),
  positions: jsonb("positions").notNull(), // {keywordId: position}
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertKeywordSchema = createInsertSchema(keywords).omit({
  id: true,
  lastUpdated: true,
});

export const insertSnapshotSchema = createInsertSchema(snapshots).omit({
  id: true,
  createdAt: true,
});

export const trackKeywordsSchema = z.object({
  website: z.string()
    .min(1, "Please enter a website URL")
    .refine((val) => {
      // Allow various formats: example.com, www.example.com, https://example.com
      const urlPattern = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/.*)?$/;
      return urlPattern.test(val);
    }, "Please enter a valid website URL (e.g., example.com or www.example.com)"),
  keywords: z.string().min(1, "Please enter at least one keyword"),
  location: z.string().min(1, "Please select a location").default("us:new-york"),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type Keyword = typeof keywords.$inferSelect;
export type InsertSnapshot = z.infer<typeof insertSnapshotSchema>;
export type Snapshot = typeof snapshots.$inferSelect;
export type TrackKeywordsRequest = z.infer<typeof trackKeywordsSchema>;

export interface KeywordWithProject extends Keyword {
  project: Project;
}

export interface DashboardMetrics {
  totalKeywords: number;
  top10: number;
  avgPosition: number;
  opportunities: number;
}

export interface RankingDistribution {
  top10: number;
  top20: number;
  top50: number;
  notFound: number;
}

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
  businessType: z.string().min(1, "Please select your business type"),
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
