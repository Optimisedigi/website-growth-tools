import { useEffect } from "react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Zap, Database, Download, RefreshCw, Bell } from "lucide-react";

export default function Settings() {
  useEffect(() => {
    document.title = "Settings - keyword ranking";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Configure your SERP tracking preferences and data sources.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-green-600" />
                SERP Data Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Serper API</h3>
                  <p className="text-sm text-gray-500">Live Google SERP data</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">API Status:</span>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cost per search:</span>
                    <span className="font-medium">$0.0003</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response time:</span>
                    <span className="font-medium">~2 seconds</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                Serper provides fast, reliable Google search results for accurate position tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Storage Type</h3>
                    <p className="text-sm text-gray-500">In-memory storage for development</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Active
                  </Badge>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">Data is cleared when adding new keywords to keep results focused on your current analysis.</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Current Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-purple-600" />
                Update Frequency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Manual Updates</h3>
                  <p className="text-sm text-gray-500">Rankings are updated when you click "Refresh with Live SERP Data"</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Best Practices:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Update rankings weekly for stable tracking</li>
                    <li>• Check daily during active SEO campaigns</li>
                    <li>• Monitor after major site changes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-orange-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Ranking Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified about significant ranking changes</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" disabled className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Email Alerts (Coming Soon)
                  </Button>
                  <Button variant="outline" size="sm" disabled className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Slack Integration (Coming Soon)
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500">
                  Set up automated alerts for ranking drops or improvements above specified thresholds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-sm mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings2 className="h-5 w-5 mr-2 text-gray-600" />
              Application Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Version</h3>
                <p className="text-sm text-gray-600">RankTracker Pro v1.0</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Last Updated</h3>
                <p className="text-sm text-gray-600">January 2025</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Data Source</h3>
                <p className="text-sm text-gray-600">Google Search via Serper API</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}