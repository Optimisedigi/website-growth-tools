import { useQuery, useMutation } from "@tanstack/react-query";
import { API_BASE } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import TrackingForm from "@/components/tracking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Trash2, Camera, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPositionBadgeClass, formatSearchVolume } from "@/lib/utils";

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
    "au:sydney": "🏄 Sydney",
    "au:melbourne": "☕ Melbourne",
    "au:brisbane": "🦘 Brisbane",
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
    "jp": "🇯🇵 Japan",
    "jp:tokyo": "🗼 Tokyo",
    "jp:osaka": "🍜 Osaka",
    "jp:yokohama": "⛩️ Yokohama",
    "br": "🇧🇷 Brazil",
    "br:sao-paulo": "🏙️ São Paulo",
    "br:rio-de-janeiro": "🏖️ Rio de Janeiro",
    "mx": "🇲🇽 Mexico",
    "mx:mexico-city": "🌮 Mexico City",
    "in": "🇮🇳 India",
    "in:mumbai": "🏙️ Mumbai",
    "in:delhi": "🕌 Delhi",
    "in:bangalore": "💻 Bangalore",
    "sg": "🇸🇬 Singapore",
    "hk": "🇭🇰 Hong Kong",
    "nl": "🇳🇱 Netherlands",
    "nl:amsterdam": "🌷 Amsterdam",
    "se": "🇸🇪 Sweden",
    "se:stockholm": "🏰 Stockholm",
    "ch": "🇨🇭 Switzerland",
    "ch:zurich": "💰 Zurich"
  };
  return locationMap[location] || location;
};
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { KeywordWithProject } from "@shared/schema";

export default function Keywords() {
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState("");
  
  const { data: keywords, isLoading: keywordsLoading, refetch: refetchKeywords } = useQuery<KeywordWithProject[]>({
    queryKey: ["/api/keywords"],
  });

  const { toast } = useToast();

  useEffect(() => {
    document.title = "Keywords - Simple Keyword Ranking Tool";
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async (keywordIds: number[]) => {
      const response = await fetch(`${API_BASE}/api/keywords/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ keywordIds }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete keywords");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ranking-distribution"] });
      setSelectedKeywords([]);
      toast({
        title: "Keywords deleted",
        description: "Selected keywords have been removed successfully.",
      });
    },
  });

  const snapshotMutation = useMutation({
    mutationFn: async (data: { label: string; keywordIds: number[] }) => {
      const response = await apiRequest("POST", "/api/snapshots", data);
      return response.json();
    },
    onSuccess: () => {
      setSelectedKeywords([]);
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

  const refreshMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/keywords/refresh", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      toast({
        title: "Rankings updated",
        description: "All keyword rankings have been refreshed with live SERP data.",
      });
    },
  });

  const handleSelectAll = () => {
    if (selectedKeywords.length === keywords?.length) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(keywords?.map(k => k.id) || []);
    }
  };

  const handleSelectKeyword = (keywordId: number) => {
    setSelectedKeywords(prev => 
      prev.includes(keywordId) 
        ? prev.filter(id => id !== keywordId)
        : [...prev, keywordId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedKeywords.length > 0) {
      deleteMutation.mutate(selectedKeywords);
    }
  };

  const handleCreateSnapshot = () => {
    if (selectedKeywords.length > 0 && snapshotLabel.trim()) {
      snapshotMutation.mutate({
        label: snapshotLabel.trim(),
        keywordIds: selectedKeywords,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Keywords Management</h1>
          <p className="mt-2 text-gray-600">Track and manage your keyword rankings with detailed insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <TrackingForm onSuccess={refetchKeywords} />
          </div>
          
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                  <span>Keywords Results</span>
                  <Button 
                    onClick={() => refreshMutation.mutate()}
                    disabled={refreshMutation.isPending}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Snapshot controls */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={selectedKeywords.length === keywords?.length && keywords?.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm font-medium">
                        Select All ({selectedKeywords.length} of {keywords?.length || 0} selected)
                      </span>
                    </div>
                    <Button 
                      onClick={handleDeleteSelected}
                      disabled={selectedKeywords.length === 0 || deleteMutation.isPending}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Snapshot label (e.g., June 2025)"
                      value={snapshotLabel}
                      onChange={(e) => setSnapshotLabel(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCreateSnapshot}
                      disabled={selectedKeywords.length === 0 || !snapshotLabel.trim() || snapshotMutation.isPending}
                      size="sm"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Create Snapshot
                    </Button>
                  </div>
                </div>

                {/* Keywords table */}
                <div className="space-y-4">
                  {keywordsLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {keywords?.map((keyword) => (
                        <div key={keyword.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox 
                            checked={selectedKeywords.includes(keyword.id)}
                            onCheckedChange={() => handleSelectKeyword(keyword.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{keyword.keyword}</div>
                            <div className="text-sm text-gray-500 hidden md:block">{keyword.project.website}</div>
                          </div>
                          <Badge className={getPositionBadgeClass(keyword.position)}>
                            {keyword.position ? `#${keyword.position}` : "Not Found"}
                          </Badge>
                          <div className="text-sm text-gray-600 hidden md:block">
                            {getLocationDisplay(keyword.location)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    </div>
  );
}