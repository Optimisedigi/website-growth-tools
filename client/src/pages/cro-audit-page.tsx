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
    canonical.href = 'https://www.optimisedigital.online/ai-growth-tools/website-conversion-rate-audit';
    
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
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-4 pb-3">
          <ol className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500">
            <li>
              <a href="https://www.optimisedigital.online" className="hover:text-slate-900 transition-colors">Home</a>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <a href="/ai-growth-tools" className="hover:text-slate-900 transition-colors">Free AI growth tools</a>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-700 font-medium">Conversion rate audit</li>
          </ol>
        </nav>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Free website conversion rate audit tool – CRO score in seconds
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

      </main>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                What is a CRO audit tool?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                A CRO audit tool analyses your website or landing page against conversion best practices. It helps identify where you're losing potential leads or sales.
              </p>
            </details>

            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                How do I check my website's conversion rate performance?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                You can enter your landing page URL and conversion goal into our free audit tool. It gives you a CRO score and actionable feedback instantly.
              </p>
            </details>

            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                Why is conversion rate optimisation important?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Improving your conversion rate means getting more leads or sales from the same amount of traffic. It lowers your cost per acquisition and increases ROI.
              </p>
            </details>

            <details className="group border-b border-slate-600 pb-4">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                What does the CRO score mean?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Your score reflects how well your page follows proven CRO principles like clarity, trust signals, CTA visibility and user experience.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                Can I improve my CRO score without redesigning my whole site?
                <svg className="w-4 h-4 ml-2 flex-shrink-0 transform group-open:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Yes. Most CRO improvements involve tweaks to layout, copy, CTAs or trust elements — not full redesigns. The audit gives simple, high-impact recommendations.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}