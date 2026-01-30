import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { getPositionBadgeClass, getOpportunityClass, getPositionChange, formatRelativeTime } from "@/lib/utils";
import type { KeywordWithProject } from "@shared/schema";

interface ResultsTableProps {
  keywords?: KeywordWithProject[];
  loading: boolean;
  onRefresh: () => void;
}

const getLocationDisplay = (location: string): string => {
  const locationMap: Record<string, string> = {
    "us": "🇺🇸 United States",
    "us:new-york": "🗽 New York",
    "us:los-angeles": "🌴 Los Angeles",
    "us:chicago": "🏙️ Chicago",
    "us:houston": "🚀 Houston",
    "us:miami": "🏖️ Miami",
    "uk": "🇬🇧 United Kingdom",
    "uk:london": "🏛️ London",
    "uk:manchester": "⚽ Manchester",
    "uk:birmingham": "🏭 Birmingham",
    "ca": "🇨🇦 Canada",
    "ca:toronto": "🍁 Toronto",
    "ca:vancouver": "🏔️ Vancouver",
    "ca:montreal": "🎭 Montreal",
    "au": "🇦🇺 Australia",
    "au:sydney": "🎭 Sydney",
    "au:melbourne": "☕ Melbourne",
    "au:brisbane": "🌞 Brisbane",
    "au:perth": "🦘 Perth",
    "au:adelaide": "🍷 Adelaide",
    "au:canberra": "🏛️ Canberra",
    "au:hobart": "🏔️ Hobart",
    "au:darwin": "🐊 Darwin",
    "de": "🇩🇪 Germany",
    "de:berlin": "🍺 Berlin",
    "de:munich": "🍻 Munich",
    "de:hamburg": "⚓ Hamburg",
    "fr": "🇫🇷 France",
    "fr:paris": "🗼 Paris",
    "fr:lyon": "🍷 Lyon",
    "fr:marseille": "🌊 Marseille",
    "es": "🇪🇸 Spain",
    "es:madrid": "👑 Madrid",
    "es:barcelona": "⚽ Barcelona",
    "it": "🇮🇹 Italy",
    "it:rome": "🏛️ Rome",
    "it:milan": "👗 Milan",
    "nl": "🇳🇱 Netherlands",
    "nl:amsterdam": "🚲 Amsterdam",
    "br": "🇧🇷 Brazil",
    "br:sao-paulo": "🏢 São Paulo",
    "br:rio-de-janeiro": "🏖️ Rio de Janeiro",
    "mx": "🇲🇽 Mexico",
    "mx:mexico-city": "🌮 Mexico City",
    "in": "🇮🇳 India",
    "in:mumbai": "🏙️ Mumbai",
    "in:delhi": "🕌 New Delhi",
    "in:bangalore": "💻 Bangalore",
    "jp": "🇯🇵 Japan",
    "jp:tokyo": "🗼 Tokyo",
    "jp:osaka": "🍜 Osaka",
    "kr": "🇰🇷 South Korea",
    "kr:seoul": "🏙️ Seoul",
    "sg": "🇸🇬 Singapore",
  };
  
  return locationMap[location] || location;
};

export default function ResultsTable({ keywords = [], loading, onRefresh }: ResultsTableProps) {
  const [filter, setFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("keyword");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter keywords based on the selected filter
  const filteredKeywords = (keywords || []).filter(keyword => {
    switch(filter) {
      case "top10":
        return keyword.position && keyword.position <= 10;
      case "top20":
        return keyword.position && keyword.position <= 20;
      case "top50":
        return keyword.position && keyword.position <= 50;
      case "notfound":
        return !keyword.position;
      case "low":
      case "medium":
      case "high":
      case "critical":
        return keyword.opportunity === filter;
      default:
        return true;
    }
  });

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    if (sortField === "keyword") {
      return sortDirection === "asc" 
        ? a.keyword.localeCompare(b.keyword)
        : b.keyword.localeCompare(a.keyword);
    }
    
    if (sortField === "position") {
      const aPos = a.position || 999;
      const bPos = b.position || 999;
      return sortDirection === "asc" ? aPos - bPos : bPos - aPos;
    }
    
    if (sortField === "searchVolume") {
      return sortDirection === "asc" 
        ? a.searchVolume - b.searchVolume
        : b.searchVolume - a.searchVolume;
    }
    
    if (sortField === "opportunity") {
      const opportunityOrder = { "low": 0, "medium": 1, "high": 2, "critical": 3 };
      const aOrder = opportunityOrder[a.opportunity as keyof typeof opportunityOrder] || 0;
      const bOrder = opportunityOrder[b.opportunity as keyof typeof opportunityOrder] || 0;
      return sortDirection === "asc" ? aOrder - bOrder : bOrder - aOrder;
    }
    
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getPositionDisplay = (position: number | null) => {
    return position ? `#${position}` : "Not Found";
  };

  const getPositionChangeIcon = (current: number | null, previous: number | null) => {
    const { direction } = getPositionChange(current, previous);
    
    switch (direction) {
      case "up":
        return <ArrowUp className="h-3 w-3" />;
      case "down":
        return <ArrowDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ranking results</CardTitle>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if we're showing pre-seeded mock/demo data
  const isDemoData = keywords && keywords.length > 0 && keywords.some(k =>
    k.keyword === "seo tools" || k.keyword === "keyword tracking" || k.project?.website?.includes("example")
  );

  return (
    <Card className="border border-gray-200 shadow-sm">
      {isDemoData && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 -rotate-[0.5deg]">
            {/* Hand-drawn curved arrow pointing left */}
            <svg width="48" height="32" viewBox="0 0 48 32" fill="none" className="text-amber-500 flex-shrink-0 hidden lg:block">
              <path d="M46 20C38 16 26 13 18 13C12 13 7 14.5 4 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M0 17L14 7L11 22Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-900">This is just demo data</p>
              <p className="text-sm text-amber-700">Add your website, keywords and location to get your real one-off results</p>
            </div>
          </div>
        </div>
      )}
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Ranking results
            </CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => onRefresh()} 
              variant="outline"
              size="sm"
              disabled={loading}
              className="hidden md:flex text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            >
              Refresh with live Google searches
            </Button>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Keywords</SelectItem>
                <SelectItem value="top10">Top 10</SelectItem>
                <SelectItem value="top20">Top 20</SelectItem>
                <SelectItem value="top50">Top 50</SelectItem>
                <SelectItem value="notfound">Not Found</SelectItem>
                <SelectItem value="low">Low Opportunity</SelectItem>
                <SelectItem value="medium">Medium Opportunity</SelectItem>
                <SelectItem value="high">High Opportunity</SelectItem>
                <SelectItem value="critical">Critical Opportunity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {keywords.length > 0 && (
          <p className="text-sm text-gray-500 mt-6 border border-gray-200 px-3 py-2 rounded-md bg-gray-50">
            Tracking: <span className="font-medium">{keywords[0].project.website}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("keyword")}
                >
                  <div className="flex items-center">
                    Keyword
                    {sortField === "keyword" && (
                      sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>

                <TableHead 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("position")}
                >
                  <div className="flex items-center">
                    Position
                    {sortField === "position" && (
                      sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                  onClick={() => handleSort("searchVolume")}
                >
                  <div className="flex items-center">
                    Search Volume
                    {sortField === "searchVolume" && (
                      sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden xl:table-cell">Last Updated</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("opportunity")}
                >
                  <div className="flex items-center">
                    Opportunity
                    {sortField === "opportunity" && (
                      sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedKeywords.length > 0 ? (
                sortedKeywords.map((keyword) => {
                  const positionChange = getPositionChange(keyword.position, keyword.previousPosition);
                  return (
                    <TableRow key={keyword.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {keyword.keyword}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getPositionBadgeClass(keyword.position)}
                        >
                          {getPositionDisplay(keyword.position)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 hidden sm:table-cell">
                        {keyword.searchVolume.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 hidden lg:table-cell">
                        {keyword.location ? getLocationDisplay(keyword.location) : "Global"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 hidden xl:table-cell">
                        {keyword.lastUpdated ? formatRelativeTime(new Date(keyword.lastUpdated)) : "Never"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getOpportunityClass(keyword.opportunity)}
                        >
                          {keyword.opportunity.charAt(0).toUpperCase() + keyword.opportunity.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 -rotate-1">
                        {/* Hand-drawn arrow pointing left */}
                        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" className="text-amber-500 flex-shrink-0 hidden lg:block">
                          <path d="M46 20C38 16 26 13 18 13C12 13 7 14.5 4 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                          <path d="M0 17L14 7L11 22Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                        </svg>
                        <div>
                          <p className="text-base font-semibold text-amber-900">No keywords tracked yet</p>
                          <p className="text-sm text-amber-700 mt-0.5">Add your website, keywords, and location to get your one-off results</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {sortedKeywords.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 1 to {sortedKeywords.length} of {sortedKeywords.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="default" size="sm" className="bg-primary text-white">
                  1
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
