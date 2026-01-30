import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Trophy, TrendingUp, Lightbulb } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

interface MetricsDashboardProps {
  metrics?: DashboardMetrics;
  loading: boolean;
}

export default function MetricsDashboard({ metrics, loading }: MetricsDashboardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-4" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Keywords",
      value: metrics?.totalKeywords || 0,
      icon: Search,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Top 10 Rankings",
      value: metrics?.top10 || 0,
      icon: Trophy,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Avg. Position",
      value: metrics?.avgPosition || 0,
      icon: TrendingUp,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Opportunities",
      value: metrics?.opportunities || 0,
      icon: Lightbulb,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {typeof metric.value === "number" && metric.title === "Avg. Position" 
                    ? metric.value.toFixed(1)
                    : metric.value
                  }
                </p>
              </div>
              <div className={`h-12 w-12 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
            </div>

          </Card>
        );
      })}
    </div>
  );
}
