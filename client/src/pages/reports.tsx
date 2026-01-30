import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Header from "@/components/header";
import MetricsDashboard from "@/components/metrics-dashboard";
import RankingVisualization from "@/components/ranking-visualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3 } from "lucide-react";
import type { DashboardMetrics, KeywordWithProject } from "@shared/schema";

export default function Reports() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/metrics"],
  });

  const { data: keywords, isLoading: keywordsLoading } = useQuery<KeywordWithProject[]>({
    queryKey: ["/api/keywords"],
  });

  useEffect(() => {
    document.title = "Reports - RankTracker Pro";
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">Comprehensive insights into your keyword performance and ranking trends.</p>
        </div>

        <MetricsDashboard metrics={metrics} loading={metricsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Download your keyword rankings and performance data as a CSV file for further analysis.
              </p>
              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download CSV Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Performance Summary
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

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {keywords ? Math.round((keywords.filter(k => k.position && k.position <= 10).length / keywords.length) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">Keywords in Top 10</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {keywords ? Math.round((keywords.filter(k => k.position && k.position <= 50).length / keywords.length) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">Keywords in Top 50</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <RankingVisualization />
      </div>
    </div>
  );
}