import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Zap, Shield } from "lucide-react";
import type { AuditRequest } from "@shared/schema";

interface AuditFormProps {
  onSubmit: (data: AuditRequest) => void;
  isLoading: boolean;
}

export default function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [conversionGoal, setConversionGoal] = useState("");
  const [businessType, setBusinessType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl.trim() || !conversionGoal || !businessType) {
      return;
    }

    onSubmit({
      websiteUrl: websiteUrl.trim(),
      conversionGoal,
      businessType,
    });
  };

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Start Your Free Audit</CardTitle>
          <CardDescription className="text-base">
            Just enter your URL and conversion goal to receive instant, actionable insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Landing Page URL Input */}
            <div className="space-y-2">
              <Label htmlFor="website-url">Landing Page URL *</Label>
              <Input
                id="website-url"
                type="text"
                placeholder="Enter your URL – mywebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
                className="text-base"
              />
              
              {/* Information Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                <p className="text-sm text-blue-800">
                  <strong>Single Page Analysis:</strong> This audit analyses the specific page you enter (not your entire website). For best results, use your homepage, main landing page, or the specific page where you want visitors to convert.
                </p>
              </div>
            </div>

            {/* Conversion Goal Select */}
            <div className="space-y-2">
              <Label htmlFor="conversion-goal">Primary Conversion Goal *</Label>
              <Select value={conversionGoal} onValueChange={setConversionGoal} required>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your main conversion goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase / Sales</SelectItem>
                  <SelectItem value="signup">Sign Up / Registration</SelectItem>
                  <SelectItem value="contact">Contact / Lead Generation</SelectItem>
                  <SelectItem value="subscribe">Subscribe / Newsletter</SelectItem>
                  <SelectItem value="download">Download / Content</SelectItem>
                  <SelectItem value="booking">Booking / Appointment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Type Select */}
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type *</Label>
              <Select value={businessType} onValueChange={setBusinessType} required>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce / Online Store</SelectItem>
                  <SelectItem value="saas">SaaS / Software</SelectItem>
                  <SelectItem value="services">Professional Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare / Medical</SelectItem>
                  <SelectItem value="education">Education / Training</SelectItem>
                  <SelectItem value="finance">Finance / Insurance</SelectItem>
                  <SelectItem value="realestate">Real Estate</SelectItem>
                  <SelectItem value="restaurant">Restaurant / Food</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="beauty">Beauty / Wellness</SelectItem>
                  <SelectItem value="legal">Legal Services</SelectItem>
                  <SelectItem value="travel">Travel / Tourism</SelectItem>
                  <SelectItem value="fitness">Fitness / Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Helps us provide more targeted recommendations
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-base py-6"
              disabled={isLoading || !websiteUrl.trim() || !conversionGoal || !businessType}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Website...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Start free CRO audit
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-base">Deep Analysis</h3>
          <p className="text-gray-600 text-base">
            Comprehensive review of headlines, CTAs, navigation, and content structure
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-base">Actionable Insights</h3>
          <p className="text-gray-600 text-base">
            Prioritized recommendations with estimated conversion lift potential
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-base">Free & Instant</h3>
          <p className="text-gray-600 text-base">
            No signup required. Get your detailed audit report in seconds
          </p>
        </div>
      </div>
    </div>
  );
}