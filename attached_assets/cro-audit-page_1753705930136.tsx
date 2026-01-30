import { useState } from "react";
import AuditForm from "@/components/audit-form";
import LoadingState from "@/components/loading-state";
import AuditResults from "@/components/audit-results";
import type { AuditResults as AuditResultsType } from "@shared/schema";

export default function CROAuditPage() {
  const [currentView, setCurrentView] = useState<'form' | 'loading' | 'results'>('form');
  const [auditResults, setAuditResults] = useState<AuditResultsType | null>(null);

  const handleAuditStart = () => {
    setCurrentView('loading');
  };

  const handleAuditComplete = (results: AuditResultsType) => {
    setAuditResults(results);
    setCurrentView('results');
  };

  const handleAuditReset = () => {
    setCurrentView('form');
    setAuditResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Is Your Website Built to Convert?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get a simple, high-level audit that highlights how well your site is set up to convert visitors. 
            Identify key areas for improvement and uncover opportunities to drive more results. Do this before you consider spending money on ads.
          </p>
        </div>

        {/* Content Views */}
        {currentView === 'form' && (
          <AuditForm 
            onAuditStart={handleAuditStart}
            onAuditComplete={handleAuditComplete}
          />
        )}

        {currentView === 'loading' && <LoadingState />}

        {currentView === 'results' && auditResults && (
          <AuditResults 
            results={auditResults}
            onStartNewAudit={handleAuditReset}
          />
        )}
      </main>
    </div>
  );
}