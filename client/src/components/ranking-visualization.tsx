import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getOpportunityClass } from "@/lib/utils";
import type { RankingDistribution, KeywordWithProject } from "@shared/schema";

export default function RankingVisualization() {
  const { data: distribution, isLoading: distributionLoading } = useQuery<RankingDistribution>({
    queryKey: ["/api/ranking-distribution"],
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<KeywordWithProject[]>({
    queryKey: ["/api/opportunities"],
  });

  if (distributionLoading || opportunitiesLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Ranking Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Keyword Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalKeywords = distribution 
    ? distribution.top10 + distribution.top20 + distribution.top50 + distribution.notFound
    : 1;

  const distributionData = distribution ? [
    {
      label: "Top 10",
      count: distribution.top10,
      percentage: Math.round((distribution.top10 / totalKeywords) * 100),
      color: "bg-blue-600",
    },
    {
      label: "Top 20",
      count: distribution.top20,
      percentage: Math.round((distribution.top20 / totalKeywords) * 100),
      color: "bg-blue-400",
    },
    {
      label: "Top 50",
      count: distribution.top50,
      percentage: Math.round((distribution.top50 / totalKeywords) * 100),
      color: "bg-blue-300",
    },
    {
      label: "Not in Top 100",
      count: distribution.notFound,
      percentage: Math.round((distribution.notFound / totalKeywords) * 100),
      color: "bg-slate-300",
    },
  ] : [];

  return (
    <div className="space-y-4">
      {distributionData.map((item, index) => (
        <div key={index}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">{item.label}</span>
            <span className="text-sm font-bold text-gray-900">
              {item.count} keywords
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`${item.color} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
