import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Eye, MousePointer, Lightbulb, Download, Mail } from "lucide-react";
import type { AuditResults, AuditFinding } from "@shared/schema";

interface AuditResultsProps {
  results: AuditResults;
  onStartNewAudit: () => void;
}

export default function AuditResults({ results, onStartNewAudit }: AuditResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-gradient-to-br from-green-50 to-green-100";
    if (score >= 60) return "text-amber-600 bg-gradient-to-br from-amber-50 to-amber-100";
    return "text-red-600 bg-gradient-to-br from-red-50 to-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good potential for improvement";
    return "Needs significant optimization";
  };

  const getFindingIcon = (status: AuditFinding['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getFindingBgColor = (status: AuditFinding['status']) => {
    switch (status) {
      case 'good':
        return "bg-green-50 border-green-200";
      case 'warning':
        return "bg-amber-50 border-amber-200";
      case 'critical':
        return "bg-red-50 border-red-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High Impact':
        return "bg-green-100 text-green-800";
      case 'Medium Impact':
        return "bg-amber-100 text-amber-800";
      case 'Low Impact':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your CRO Audit Results</h3>
            <p className="text-gray-600">
              Website: <span className="font-medium text-primary">{results.websiteUrl}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className={`text-center p-4 rounded-xl ${getScoreColor(results.overallScore)}`}>
              <div className="text-3xl font-bold mb-1">{results.overallScore}</div>
              <div className="text-sm font-medium text-gray-700">Overall Score</div>
              <div className="text-xs text-gray-500 mt-1">{getScoreLabel(results.overallScore)}</div>
            </div>

            <div className={`text-center p-4 rounded-xl ${getScoreColor(results.aboveFoldScore)}`}>
              <div className="text-3xl font-bold mb-1">{results.aboveFoldScore}</div>
              <div className="text-sm font-medium text-gray-700">Above-fold</div>
              <div className="text-xs text-gray-500 mt-1">Content structure</div>
            </div>

            <div className={`text-center p-4 rounded-xl ${getScoreColor(results.ctaScore)}`}>
              <div className="text-3xl font-bold mb-1">{results.ctaScore}</div>
              <div className="text-sm font-medium text-gray-700">CTA Quality</div>
              <div className="text-xs text-gray-500 mt-1">Button optimization</div>
            </div>

            <div className={`text-center p-4 rounded-xl ${getScoreColor(results.navigationScore)}`}>
              <div className="text-3xl font-bold mb-1">{results.navigationScore}</div>
              <div className="text-sm font-medium text-gray-700">Navigation</div>
              <div className="text-xs text-gray-500 mt-1">User experience</div>
            </div>

            <div className={`text-center p-4 rounded-xl ${getScoreColor(results.contentScore)}`}>
              <div className="text-3xl font-bold mb-1">{results.contentScore}</div>
              <div className="text-sm font-medium text-gray-700">Content</div>
              <div className="text-xs text-gray-500 mt-1">Structure & hierarchy</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Findings Summary</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {results.findings.slice(0, 4).map((finding, index) => (
                <div key={index} className="flex items-start">
                  {getFindingIcon(finding.status)}
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{finding.category}</div>
                    <div className="text-sm text-gray-600">{finding.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Content Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5 text-primary" />
            Extracted Website Content Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.extractedContent.headline && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Main Headline</h4>
                <p className="text-gray-900 font-medium bg-blue-50 p-3 rounded-lg border border-blue-100">
                  "{results.extractedContent.headline}"
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  This is your primary value proposition. Make sure it clearly communicates what you offer and why visitors should care.
                </p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              {results.extractedContent.navigationItems.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Navigation Structure</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.extractedContent.navigationItems.slice(0, 8).map((nav, index) => (
                      <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                        {nav}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Clear navigation helps users find what they need quickly. Keep it simple with 5-7 main categories.
                  </p>
                </div>
              )}
              
              {results.extractedContent.ctaTexts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Call-to-Action Buttons</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.extractedContent.ctaTexts.slice(0, 6).map((cta, index) => (
                      <span key={index} className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200">
                        {cta}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Your CTAs should use action words and create urgency. The primary CTA should stand out visually from secondary options.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            Priority Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                {recommendation.priority}
              </div>
              <div className="flex-grow">
                <h5 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h5>
                <p className="text-gray-600 mb-3">{recommendation.description}</p>
                <div className="flex items-center text-sm">
                  <Badge className={getImpactColor(recommendation.impact)}>
                    {recommendation.impact}
                  </Badge>
                  <span className="text-gray-500 ml-2">Estimated {recommendation.estimatedLift}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Start New Audit */}
      <div className="text-center">
        <Button onClick={onStartNewAudit} variant="outline" size="lg">
          Start New Audit
        </Button>
      </div>
    </div>
  );
}