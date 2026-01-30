import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MetricsDashboard from "@/components/metrics-dashboard";
import TrackingForm from "@/components/tracking-form";
import ResultsTable from "@/components/results-table";
import RankingVisualization from "@/components/ranking-visualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, BarChart3, RefreshCw, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getOpportunityClass } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { DashboardMetrics, KeywordWithProject } from "@shared/schema";

export default function Dashboard() {
  const [snapshotLabel, setSnapshotLabel] = useState("");
  const { toast } = useToast();

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/metrics"],
  });

  const { data: keywords, isLoading: keywordsLoading, refetch: refetchKeywords } = useQuery<KeywordWithProject[]>({
    queryKey: ["/api/keywords"],
  });

  const { data: opportunities } = useQuery<KeywordWithProject[]>({
    queryKey: ["/api/opportunities"],
  });

  useEffect(() => {
    document.title = "Free Keyword Tracker Tool | Simple & Accurate SEO Rank Checker";
    
    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://www.optimisedigital.online/ai-growth-tools/free-simple-keyword-tracker';
    
    // Add FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a keyword tracker tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A keyword tracker shows where your website ranks in search engine results for specific keywords. It's essential for monitoring SEO performance over time."
          }
        },
        {
          "@type": "Question",
          "name": "How do I track keyword rankings for free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can use our free keyword tracker by entering your URL, target keywords, and location. It will show your current ranking, search volume, and opportunity score."
          }
        },
        {
          "@type": "Question",
          "name": "Why is keyword tracking important for SEO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tracking helps you understand which keywords are performing well and which need improvement. It's a key part of any long-term SEO strategy."
          }
        },
        {
          "@type": "Question",
          "name": "Does this keyword tracker support location-based rankings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our tool allows you to select a specific location so you can monitor rankings in your target market — perfect for local SEO."
          }
        },
        {
          "@type": "Question",
          "name": "How often should I check my keyword rankings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Weekly or bi-weekly checks are ideal for spotting trends without overreacting to small fluctuations. Use the tracker regularly to monitor progress."
          }
        }
      ]
    };

    // Remove existing schema if present
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const schemaElement = document.querySelector('script[type="application/ld+json"]');
      if (schemaElement) {
        schemaElement.remove();
      }
    };
  }, []);

  const snapshotMutation = useMutation({
    mutationFn: async (data: { label: string; keywordIds: number[] }) => {
      const response = await apiRequest("POST", "/api/snapshots", data);
      return response.json();
    },
    onSuccess: () => {
      setSnapshotLabel("");
      toast({
        title: "Snapshot created",
        description: "Rankings snapshot has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateSnapshot = () => {
    if (snapshotLabel.trim() && keywords && keywords.length > 0) {
      snapshotMutation.mutate({
        label: snapshotLabel.trim(),
        keywordIds: keywords.map(k => k.id),
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export", {
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'keyword-rankings.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-4 pb-3">
          <ol className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500">
            <li>
              <a href="https://www.optimisedigital.online" className="hover:text-slate-900 transition-colors">Home</a>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <a href="/ai-growth-tools" className="hover:text-slate-900 transition-colors">Free AI growth tools</a>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-700 font-medium">Keyword rank tracker</li>
          </ol>
        </nav>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Free keyword rank tracker
          </h1>
          <p className="text-gray-600">A lightweight keyword tracker to monitor your rankings — nothing fancy, just simple and useful</p>
          <span className="inline-block mt-3 border border-blue-200 rounded-md bg-blue-50 px-3 py-2">
            <span className="text-xs text-blue-700">
              Rankings show text search and popular product results only (excludes sponsored listings, google shopping ads and AI overviews)
            </span>
          </span>
        </div>

        {/* Mobile: Track New Keywords first */}
        <div className="lg:hidden mb-8">
          <TrackingForm onSuccess={refetchKeywords} />
        </div>

        {/* Desktop: Show metrics dashboard */}
        <div className="hidden lg:block">
          <MetricsDashboard metrics={metrics} loading={metricsLoading} />
        </div>

        {/* Desktop layout: tracking form and snapshot on left, results on right */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <TrackingForm onSuccess={refetchKeywords} />
            
            {/* One-off tracking note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <p className="text-sm text-blue-800">
                Keyword tracking is <span className="font-semibold">one-off</span> — create a snapshot to label your results and export them as a CSV report to keep a record.
              </p>
            </div>

            {/* Desktop Snapshot Box */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-blue-600" />
                  Create snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Save current rankings for all keywords with a custom label.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Snapshot label (e.g., June 2025)"
                    value={snapshotLabel}
                    onChange={(e) => setSnapshotLabel(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCreateSnapshot}
                    disabled={!snapshotLabel.trim() || snapshotMutation.isPending || !keywords?.length}
                    size="sm"
                  >
                    {snapshotMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Desktop Export data Box */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Export data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Download your keyword rankings and performance data as a CSV file for further analysis.
                </p>
                <Button onClick={handleExport} className="w-full bg-slate-800 hover:bg-slate-900 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV report
                </Button>
              </CardContent>
            </Card>


          </div>
          
          <div className="lg:col-span-2">
            <ResultsTable keywords={keywords} loading={keywordsLoading} onRefresh={refetchKeywords} />
          </div>
        </div>

        {/* Mobile: Performance summary before results table */}
        <div className="lg:hidden mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Performance summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Keywords:</span>
                  <span className="text-sm font-medium">{metrics?.totalKeywords || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Top 10 Rankings:</span>
                  <span className="text-sm font-medium text-green-600">{metrics?.top10 || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Opportunities:</span>
                  <span className="text-sm font-medium text-orange-600">{metrics?.opportunities || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Position:</span>
                  <span className="text-sm font-medium">{metrics?.avgPosition?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: results table after performance summary */}
        <div className="lg:hidden mb-8">
          <ResultsTable keywords={keywords} loading={keywordsLoading} onRefresh={refetchKeywords} />
        </div>

        {/* Mobile: One-off tracking note */}
        <div className="lg:hidden mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <p className="text-sm text-blue-800">
              Keyword tracking is <span className="font-semibold">one-off</span> — create a snapshot to label your results and export them as a CSV report to keep a record.
            </p>
          </div>
        </div>

        {/* Mobile: Snapshot Box under results table */}
        <div className="lg:hidden mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                Create snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Save current rankings for all keywords with a custom label.
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Snapshot label (e.g., June 2025)"
                  value={snapshotLabel}
                  onChange={(e) => setSnapshotLabel(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleCreateSnapshot}
                  disabled={!snapshotLabel.trim() || snapshotMutation.isPending || !keywords?.length}
                  size="sm"
                >
                  {snapshotMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Export data Box */}
        <div className="lg:hidden">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Export data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Download your keyword rankings and performance data as a CSV file for further analysis.
              </p>
              <Button onClick={handleExport} className="w-full bg-slate-800 hover:bg-slate-900 text-white">
                <Download className="h-4 w-4 mr-2" />
                Download CSV report
              </Button>
            </CardContent>
          </Card>
        </div>



        {/* Desktop Performance summary */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Ranking distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RankingVisualization />
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Keyword opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunities && opportunities.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.slice(0, 3).map((opportunity) => (
                    <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {opportunity.keyword}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={getOpportunityClass(opportunity.opportunity)}
                        >
                          {opportunity.opportunity.charAt(0).toUpperCase() + opportunity.opportunity.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        Search Volume: {opportunity.searchVolume.toLocaleString()}
                        {opportunity.position ? ` | Your Rank: #${opportunity.position}` : " | Not ranking"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {opportunity.position 
                          ? "Potential to improve ranking. Competitor analysis shows optimization opportunities."
                          : "Your site doesn't rank in top 100. High-opportunity keyword with good search volume."
                        }
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No opportunities available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Track more keywords to discover opportunities
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                What is a keyword tracker tool?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                A keyword tracker shows where your website ranks in search engine results for specific keywords. It's essential for monitoring SEO performance over time.
              </p>
            </details>

            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                How do I track keyword rankings for free?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                You can use our free keyword tracker by entering your URL, target keywords, and location. It will show your current ranking, search volume, and opportunity score.
              </p>
            </details>

            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                Why is keyword tracking important for SEO?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Tracking helps you understand which keywords are performing well and which need improvement. It's a key part of any long-term SEO strategy.
              </p>
            </details>

            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                Does this keyword tracker support location-based rankings?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Yes, our tool allows you to select a specific location so you can monitor rankings in your target market — perfect for local SEO.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                How often should I check my keyword rankings?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Weekly or bi-weekly checks are ideal for spotting trends without overreacting to small fluctuations. Use the tracker regularly to monitor progress.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}