import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuditForm from "@/components/audit-form";
import AuditResults from "@/components/audit-results";
import LoadingState from "@/components/loading-state";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditRequest, AuditResults as AuditResultsType } from "@shared/schema";

export default function CROAuditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResultsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuditSubmit = async (auditData: AuditRequest) => {
    setIsLoading(true);
    setError(null);
    setAuditResults(null);

    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to perform audit');
      }

      const results = await response.json();
      setAuditResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform audit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAudit = () => {
    setAuditResults(null);
    setError(null);
  };

  useEffect(() => {
    document.title = "Free CRO Audit Tool | Website Conversion Rate Optimiser";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Instantly audit your landing page and get a CRO score based on best practice conversion rate optimisation. No sign-up needed – just enter your URL and goal to get started.');
    }

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://tool.optimisedigital.online/website-conversion-rate-audit';
    
    // Add FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a CRO audit tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A CRO audit tool analyses your website or landing page against conversion best practices. It helps identify where you're losing potential leads or sales."
          }
        },
        {
          "@type": "Question",
          "name": "How do I check my website's conversion rate performance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can enter your landing page URL and conversion goal into our free audit tool. It gives you a CRO score and actionable feedback instantly."
          }
        },
        {
          "@type": "Question",
          "name": "Why is conversion rate optimisation important?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Improving your conversion rate means getting more leads or sales from the same amount of traffic. It lowers your cost per acquisition and increases ROI."
          }
        },
        {
          "@type": "Question",
          "name": "What does the CRO score mean?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your score reflects how well your page follows proven CRO principles like clarity, trust signals, CTA visibility and user experience."
          }
        },
        {
          "@type": "Question",
          "name": "Can I improve my CRO score without redesigning my whole site?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Most CRO improvements involve tweaks to layout, copy, CTAs or trust elements — not full redesigns. The audit gives simple, high-impact recommendations."
          }
        }
      ]
    };

    // Remove existing schema if present
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const schemaElement = document.querySelector('script[type="application/ld+json"]');
      if (schemaElement) {
        schemaElement.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Free Website Conversion Rate Audit Tool – CRO Score in Seconds
            </h1>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Instantly audit your landing page and get a Conversion rate optimisation score based on best practices. See how well your site is built to convert, uncover areas for improvement, and identify quick wins — before you spend a cent on ads. No sign-up needed.
            </p>
          </div>

          {/* Main Content */}
          {isLoading ? (
            <LoadingState />
          ) : auditResults ? (
            <AuditResults 
              results={auditResults} 
              onNewAudit={handleNewAudit}
            />
          ) : (
            <div>
              <AuditForm 
                onSubmit={handleAuditSubmit}
                isLoading={isLoading}
              />
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 mb-8 max-w-4xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <details className="group border-b border-gray-200 pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600">
                    What is a CRO audit tool?
                    <span className="ml-2 transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    A CRO audit tool analyses your website or landing page against conversion best practices. It helps identify where you're losing potential leads or sales.
                  </p>
                </details>

                <details className="group border-b border-gray-200 pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600">
                    How do I check my website's conversion rate performance?
                    <span className="ml-2 transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    You can enter your landing page URL and conversion goal into our free audit tool. It gives you a CRO score and actionable feedback instantly.
                  </p>
                </details>

                <details className="group border-b border-gray-200 pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600">
                    Why is conversion rate optimisation important?
                    <span className="ml-2 transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Improving your conversion rate means getting more leads or sales from the same amount of traffic. It lowers your cost per acquisition and increases ROI.
                  </p>
                </details>

                <details className="group border-b border-gray-200 pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600">
                    What does the CRO score mean?
                    <span className="ml-2 transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Your score reflects how well your page follows proven CRO principles like clarity, trust signals, CTA visibility and user experience.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600">
                    Can I improve my CRO score without redesigning my whole site?
                    <span className="ml-2 transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Yes. Most CRO improvements involve tweaks to layout, copy, CTAs or trust elements — not full redesigns. The audit gives simple, high-impact recommendations.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}