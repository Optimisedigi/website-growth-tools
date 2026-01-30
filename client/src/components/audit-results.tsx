import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Navigation, 
  FileText, 
  Eye,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import type { AuditResults } from "@shared/schema";

interface AuditResultsProps {
  results: AuditResults;
  onNewAudit: () => void;
}

export default function AuditResults({ results, onNewAudit }: AuditResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return CheckCircle;
    if (score >= 6) return AlertTriangle;
    return AlertCircle;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return CheckCircle;
      case "warning": return AlertTriangle;
      case "critical": return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600 bg-green-100";
      case "warning": return "text-yellow-600 bg-yellow-100";
      case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Overall Score */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onNewAudit}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              New Audit
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="h-4 w-4" />
              <span>Analyzed: {new URL(results.websiteUrl).hostname}</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
          
          <div className="pt-4">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}/10
            </div>
            <CardTitle className="text-3xl mt-4">
              Conversion Audit Results
            </CardTitle>
            <CardDescription className="text-lg">
              {results.overallScore >= 8 
                ? "Excellent! Your website has strong conversion fundamentals."
                : results.overallScore >= 6
                ? "Good foundation with room for improvement."
                : "Significant opportunities to boost conversions identified."
              }
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Above-Fold Content", score: results.aboveFoldScore, icon: Eye },
          { label: "Call-to-Actions", score: results.ctaScore, icon: Target },
          { label: "Navigation", score: results.navigationScore, icon: Navigation },
          { label: "Content Structure", score: results.contentScore, icon: FileText },
        ].map((item, index) => {
          const IconComponent = getScoreIcon(item.score);
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <item.icon className="h-5 w-5 text-gray-600" />
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getScoreColor(item.score)}`}>
                    {item.score}
                  </div>
                </div>
                <p className="font-medium text-gray-900 mt-2">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Key Findings
          </CardTitle>
          <CardDescription>
            Critical areas identified during the audit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.findings.map((finding, index) => {
            const StatusIcon = getStatusIcon(finding.status);
            return (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                <div className={`p-2 rounded-full ${getStatusColor(finding.status)}`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{finding.category}</h4>
                    <Badge variant="outline" className={getStatusColor(finding.status)}>
                      {finding.score}/10
                    </Badge>
                  </div>
                  <p className="text-gray-600 mt-1">{finding.message}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Priority Recommendations
          </CardTitle>
          <CardDescription>
            Actionable steps to improve your conversion rate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.recommendations.map((rec, index) => (
            <div key={index} className="p-6 rounded-lg border-l-4 border-blue-500 bg-blue-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full">
                    {rec.priority}
                  </span>
                  <h4 className="font-bold text-gray-900">{rec.title}</h4>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {rec.impact}
                </Badge>
              </div>
              <p className="text-gray-700 mb-3">{rec.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">{rec.estimatedLift}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Extracted Content Preview */}
      {results.extractedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Analysis
            </CardTitle>
            <CardDescription>
              Key elements found on your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.extractedContent.headline && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Main Headline</h4>
                <p className="text-lg text-gray-700 p-3 bg-gray-50 rounded">
                  "{results.extractedContent.headline}"
                </p>
              </div>
            )}

            {results.extractedContent.subHeadlines && results.extractedContent.subHeadlines.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Sub-headlines</h4>
                <div className="space-y-2">
                  {results.extractedContent.subHeadlines.slice(0, 3).map((headline, index) => (
                    <p key={index} className="text-gray-700 p-2 bg-gray-50 rounded">
                      "{headline}"
                    </p>
                  ))}
                </div>
              </div>
            )}

            {results.extractedContent.ctaTexts && results.extractedContent.ctaTexts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Call-to-Actions Found</h4>
                <div className="flex flex-wrap gap-2">
                  {results.extractedContent.ctaTexts.slice(0, 6).map((cta, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {cta}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {results.extractedContent.navigationItems && results.extractedContent.navigationItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Navigation Menu</h4>
                <div className="flex flex-wrap gap-2">
                  {results.extractedContent.navigationItems.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Boost Your Conversions?
            </h3>
            <p className="text-gray-600 mb-4">
              Implement these recommendations and you could see significant improvements in your conversion rate.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={onNewAudit} variant="outline">
                Audit Another Website
              </Button>
              <Button asChild>
                <a href="https://www.optimisedigital.online/" target="_blank" rel="noopener noreferrer">
                  Get Professional Help
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}