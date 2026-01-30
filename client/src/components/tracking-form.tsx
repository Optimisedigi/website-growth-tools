import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { trackKeywordsSchema, type TrackKeywordsRequest } from "@shared/schema";
import { Upload, Download, RefreshCw, Bell } from "lucide-react";

interface TrackingFormProps {
  onSuccess: () => void;
}

const locations = [
  { value: "us", label: "🇺🇸 United States", searchText: "united states usa america" },
  { value: "us:new-york", label: "🗽 New York, NY", searchText: "new york nyc manhattan brooklyn queens bronx staten island" },
  { value: "us:los-angeles", label: "🌴 Los Angeles, CA", searchText: "los angeles la california hollywood beverly hills" },
  { value: "us:chicago", label: "🏙️ Chicago, IL", searchText: "chicago illinois windy city" },
  { value: "us:houston", label: "🤠 Houston, TX", searchText: "houston texas" },
  { value: "us:miami", label: "🏖️ Miami, FL", searchText: "miami florida south beach" },
  { value: "us:atlanta", label: "🍑 Atlanta, GA", searchText: "atlanta georgia" },
  { value: "us:seattle", label: "☕ Seattle, WA", searchText: "seattle washington emerald city" },
  { value: "us:denver", label: "⛰️ Denver, CO", searchText: "denver colorado mile high city" },
  { value: "ca", label: "🇨🇦 Canada", searchText: "canada" },
  { value: "ca:toronto", label: "🍁 Toronto, ON", searchText: "toronto ontario canada" },
  { value: "ca:vancouver", label: "🌲 Vancouver, BC", searchText: "vancouver british columbia canada" },
  { value: "ca:montreal", label: "🏛️ Montreal, QC", searchText: "montreal quebec canada" },
  { value: "gb", label: "🇬🇧 United Kingdom", searchText: "united kingdom uk britain england" },
  { value: "gb:london", label: "🏰 London", searchText: "london england uk britain" },
  { value: "gb:manchester", label: "⚽ Manchester", searchText: "manchester england uk" },
  { value: "gb:birmingham", label: "🏭 Birmingham", searchText: "birmingham england uk" },
  { value: "au", label: "🇦🇺 Australia", searchText: "australia" },
  { value: "au:sydney", label: "🎭 Sydney, NSW", searchText: "sydney new south wales australia" },
  { value: "au:melbourne", label: "☕ Melbourne, VIC", searchText: "melbourne victoria australia" },
  { value: "au:brisbane", label: "🌞 Brisbane, QLD", searchText: "brisbane queensland australia" },
  { value: "au:perth", label: "🦘 Perth, WA", searchText: "perth western australia" },
  { value: "de", label: "🇩🇪 Germany", searchText: "germany deutschland" },
  { value: "de:berlin", label: "🐻 Berlin", searchText: "berlin germany" },
  { value: "de:munich", label: "🍺 Munich", searchText: "munich munchen germany bavaria" },
  { value: "de:hamburg", label: "⚓ Hamburg", searchText: "hamburg germany" },
  { value: "fr", label: "🇫🇷 France", searchText: "france" },
  { value: "fr:paris", label: "🗼 Paris", searchText: "paris france" },
  { value: "fr:lyon", label: "🍷 Lyon", searchText: "lyon france" },
  { value: "fr:marseille", label: "🌊 Marseille", searchText: "marseille france" },
  { value: "es", label: "🇪🇸 Spain", searchText: "spain espana" },
  { value: "es:madrid", label: "👑 Madrid", searchText: "madrid spain" },
  { value: "es:barcelona", label: "⚽ Barcelona", searchText: "barcelona spain catalonia" },
  { value: "it", label: "🇮🇹 Italy", searchText: "italy italia" },
  { value: "it:rome", label: "🏛️ Rome", searchText: "rome roma italy" },
  { value: "it:milan", label: "👗 Milan", searchText: "milan milano italy" },
  { value: "nl", label: "🇳🇱 Netherlands", searchText: "netherlands holland" },
  { value: "nl:amsterdam", label: "🚲 Amsterdam", searchText: "amsterdam netherlands holland" },
  { value: "br", label: "🇧🇷 Brazil", searchText: "brazil brasil" },
  { value: "br:sao-paulo", label: "🏢 São Paulo", searchText: "sao paulo brazil" },
  { value: "br:rio-de-janeiro", label: "🏖️ Rio de Janeiro", searchText: "rio de janeiro brazil" },
  { value: "mx", label: "🇲🇽 Mexico", searchText: "mexico" },
  { value: "mx:mexico-city", label: "🌮 Mexico City", searchText: "mexico city cdmx" },
  { value: "in", label: "🇮🇳 India", searchText: "india" },
  { value: "in:mumbai", label: "🏙️ Mumbai", searchText: "mumbai bombay india" },
  { value: "in:delhi", label: "🕌 New Delhi", searchText: "new delhi delhi india" },
  { value: "in:bangalore", label: "💻 Bangalore", searchText: "bangalore bengaluru india" },
  { value: "jp", label: "🇯🇵 Japan", searchText: "japan" },
  { value: "jp:tokyo", label: "🗼 Tokyo", searchText: "tokyo japan" },
  { value: "jp:osaka", label: "🍜 Osaka", searchText: "osaka japan" },
  { value: "kr", label: "🇰🇷 South Korea", searchText: "south korea korea" },
  { value: "kr:seoul", label: "🏙️ Seoul", searchText: "seoul south korea" },
  { value: "sg", label: "🇸🇬 Singapore", searchText: "singapore" },
];

export default function TrackingForm({ onSuccess }: TrackingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<TrackKeywordsRequest>({
    resolver: zodResolver(trackKeywordsSchema),
    defaultValues: {
      website: "",
      keywords: "",
      location: "us:new-york",
    },
  });

  const trackKeywordsMutation = useMutation({
    mutationFn: async (data: TrackKeywordsRequest) => {
      const response = await apiRequest("POST", "/api/track-keywords", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      form.reset();
      // Invalidate all related queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ranking-distribution"] });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    setIsLoading(true);
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
      
      toast({
        title: "Success",
        description: "Keyword data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/refresh-rankings", {});
      const data = await response.json();
      
      toast({
        title: "Rankings Updated",
        description: `Refreshed ${data.refreshedCount} of ${data.totalKeywords} keywords with live SERP data`,
      });
      onSuccess(); // Refresh the data in the parent component
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh rankings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeUrl = (url: string): string => {
    // Remove any leading/trailing whitespace
    url = url.trim();
    
    // If it doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//)) {
      url = `https://${url}`;
    }
    
    return url;
  };

  const onSubmit = (data: TrackKeywordsRequest) => {
    // Normalize the URL before submitting
    const normalizedData = {
      ...data,
      website: normalizeUrl(data.website)
    };
    trackKeywordsMutation.mutate(normalizedData);
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Track New Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Website URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example.com or www.example.com"
                        className="focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Search Location
                    </FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              "justify-between h-10 focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? locations.find((location) => location.value === field.value)?.label
                              : "Select search location..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Search cities and countries..." />
                          <CommandList>
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup>
                              {locations.map((location) => (
                                <CommandItem
                                  key={location.value}
                                  value={location.searchText}
                                  onSelect={() => {
                                    field.onChange(location.value);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      location.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {location.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Keywords
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Enter keywords separated by line breaks:

seo tools
keyword tracking
google rankings
serp analysis"
                        className="focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-gray-500">One keyword per line (max 100)</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-gray-600 hover:text-gray-700"
                  disabled
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={trackKeywordsMutation.isPending}
                >
                  {trackKeywordsMutation.isPending ? "Analyzing SERP Data..." : "Track keywords with live Google searches"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>


    </div>
  );
}
