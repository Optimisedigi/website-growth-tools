import { 
  projects, 
  keywords, 
  type Project, 
  type Keyword, 
  type InsertProject, 
  type InsertKeyword,
  type Snapshot,
  type InsertSnapshot,
  type KeywordWithProject,
  type DashboardMetrics,
  type RankingDistribution,
  type AuditResults
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjectByWebsite(website: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Keywords
  getKeyword(id: number): Promise<Keyword | undefined>;
  getKeywordsByProject(projectId: number): Promise<Keyword[]>;
  getAllKeywords(): Promise<KeywordWithProject[]>;
  createKeywords(keywords: InsertKeyword[]): Promise<Keyword[]>;
  updateKeyword(id: number, keyword: Partial<Keyword>): Promise<Keyword | undefined>;
  deleteKeywords(keywordIds: number[]): Promise<void>;
  clearAllKeywords(): Promise<void>;
  
  // Snapshots
  createSnapshot(snapshot: InsertSnapshot): Promise<Snapshot>;
  getSnapshots(): Promise<Snapshot[]>;
  
  // Analytics
  getDashboardMetrics(): Promise<DashboardMetrics>;
  getRankingDistribution(): Promise<RankingDistribution>;
  getOpportunityKeywords(): Promise<KeywordWithProject[]>;

  // Audits
  createAudit(audit: Omit<AuditResults, 'id' | 'createdAt'>): Promise<AuditResults>;
  getAudit(id: number): Promise<AuditResults | undefined>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private keywords: Map<number, Keyword>;
  private snapshots: Map<number, Snapshot>;
  private audits: Map<number, AuditResults>;
  private currentProjectId: number;
  private currentKeywordId: number;
  private currentSnapshotId: number;
  private currentAuditId: number;

  constructor() {
    this.projects = new Map();
    this.keywords = new Map();
    this.snapshots = new Map();
    this.audits = new Map();
    this.currentProjectId = 1;
    this.currentKeywordId = 1;
    this.currentSnapshotId = 1;
    this.currentAuditId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample project
    const sampleProject: Project = {
      id: this.currentProjectId++,
      name: "Sample SEO Project",
      website: "https://example.com",
      createdAt: new Date(),
    };
    this.projects.set(sampleProject.id, sampleProject);

    // Create sample keywords with realistic data
    const sampleKeywords: Keyword[] = [
      {
        id: this.currentKeywordId++,
        projectId: sampleProject.id,
        keyword: "seo tools",
        position: 7,
        previousPosition: 10,
        searchVolume: 12100,
        opportunity: "medium",
        location: "us:new-york",
        lastUpdated: new Date(),
      },
      {
        id: this.currentKeywordId++,
        projectId: sampleProject.id,
        keyword: "keyword tracking",
        position: 15,
        previousPosition: 13,
        searchVolume: 3200,
        opportunity: "high",
        location: "us:los-angeles",
        lastUpdated: new Date(),
      },
      {
        id: this.currentKeywordId++,
        projectId: sampleProject.id,
        keyword: "google rankings",
        position: 3,
        previousPosition: 3,
        searchVolume: 8100,
        opportunity: "low",
        location: "uk:london",
        lastUpdated: new Date(),
      },
      {
        id: this.currentKeywordId++,
        projectId: sampleProject.id,
        keyword: "serp analysis",
        position: 42,
        previousPosition: 50,
        searchVolume: 1900,
        opportunity: "high",
        location: "au:sydney",
        lastUpdated: new Date(),
      },
      {
        id: this.currentKeywordId++,
        projectId: sampleProject.id,
        keyword: "rank tracking software",
        position: null,
        previousPosition: null,
        searchVolume: 2400,
        opportunity: "critical",
        location: "ca:toronto",
        lastUpdated: new Date(),
      },
      {
        id: this.currentKeywordId++,
        projectId: sampleProject.id,
        keyword: "search engine optimization",
        position: 18,
        previousPosition: 19,
        searchVolume: 27100,
        opportunity: "medium",
        location: "jp:tokyo",
        lastUpdated: new Date(),
      },
    ];

    sampleKeywords.forEach(keyword => {
      this.keywords.set(keyword.id, keyword);
    });
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectByWebsite(website: string): Promise<Project | undefined> {
    return Array.from(this.projects.values()).find(
      (project) => project.website === website
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date() 
    };
    this.projects.set(id, project);
    return project;
  }

  async getKeyword(id: number): Promise<Keyword | undefined> {
    return this.keywords.get(id);
  }

  async getKeywordsByProject(projectId: number): Promise<Keyword[]> {
    return Array.from(this.keywords.values()).filter(
      (keyword) => keyword.projectId === projectId
    );
  }

  async getAllKeywords(): Promise<KeywordWithProject[]> {
    const keywords = Array.from(this.keywords.values());
    const result: KeywordWithProject[] = [];
    
    for (const keyword of keywords) {
      const project = await this.getProject(keyword.projectId);
      if (project) {
        result.push({ ...keyword, project });
      }
    }
    
    return result;
  }

  async createKeywords(insertKeywords: InsertKeyword[]): Promise<Keyword[]> {
    const createdKeywords: Keyword[] = [];
    
    for (const insertKeyword of insertKeywords) {
      const id = this.currentKeywordId++;
      const keyword: Keyword = {
        ...insertKeyword,
        id,
        lastUpdated: new Date(),
      };
      this.keywords.set(id, keyword);
      createdKeywords.push(keyword);
    }
    
    return createdKeywords;
  }

  async updateKeyword(id: number, updates: Partial<Keyword>): Promise<Keyword | undefined> {
    const existing = this.keywords.get(id);
    if (!existing) return undefined;
    
    const updated: Keyword = {
      ...existing,
      ...updates,
      lastUpdated: new Date(),
    };
    
    this.keywords.set(id, updated);
    return updated;
  }

  async deleteKeywords(keywordIds: number[]): Promise<void> {
    keywordIds.forEach(id => {
      this.keywords.delete(id);
    });
  }

  async createSnapshot(insertSnapshot: InsertSnapshot): Promise<Snapshot> {
    const id = this.currentSnapshotId++;
    const snapshot: Snapshot = {
      ...insertSnapshot,
      id,
      createdAt: new Date(),
    };
    this.snapshots.set(id, snapshot);
    return snapshot;
  }

  async getSnapshots(): Promise<Snapshot[]> {
    return Array.from(this.snapshots.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const allKeywords = Array.from(this.keywords.values());
    const totalKeywords = allKeywords.length;
    const top10 = allKeywords.filter(k => k.position && k.position <= 10).length;
    const positionsSum = allKeywords
      .filter(k => k.position)
      .reduce((sum, k) => sum + k.position!, 0);
    const keywordsWithPositions = allKeywords.filter(k => k.position).length;
    const avgPosition = keywordsWithPositions > 0 ? positionsSum / keywordsWithPositions : 0;
    const opportunities = allKeywords.filter(k => 
      k.opportunity === "high" || k.opportunity === "critical"
    ).length;

    return {
      totalKeywords,
      top10,
      avgPosition: Math.round(avgPosition * 10) / 10,
      opportunities,
    };
  }

  async getRankingDistribution(): Promise<RankingDistribution> {
    const allKeywords = Array.from(this.keywords.values());
    const top10 = allKeywords.filter(k => k.position && k.position <= 10).length;
    const top20 = allKeywords.filter(k => k.position && k.position <= 20).length;
    const top50 = allKeywords.filter(k => k.position && k.position <= 50).length;
    const notFound = allKeywords.filter(k => !k.position).length;

    return { top10, top20, top50, notFound };
  }

  async getOpportunityKeywords(): Promise<KeywordWithProject[]> {
    const allKeywords = await this.getAllKeywords();
    return allKeywords
      .filter(k => k.opportunity === "high" || k.opportunity === "critical")
      .slice(0, 10); // Limit to top 10 opportunities
  }

  async clearAllKeywords(): Promise<void> {
    this.keywords.clear();
    this.currentKeywordId = 1;
  }

  async createAudit(auditData: Omit<AuditResults, 'id' | 'createdAt'>): Promise<AuditResults> {
    const audit: AuditResults = {
      ...auditData,
      id: this.currentAuditId++,
      createdAt: new Date().toISOString(),
    };
    
    this.audits.set(audit.id, audit);
    return audit;
  }

  async getAudit(id: number): Promise<AuditResults | undefined> {
    return this.audits.get(id);
  }
}

export const storage = new MemStorage();
