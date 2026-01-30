import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import CROAuditPage from "@/pages/cro-audit-page";

const SITE = "https://www.optimisedigital.online";

// Landing page that shows available tools
function ToolsLanding() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-4 pb-3">
          <ol className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500">
            <li>
              <a href={SITE} className="hover:text-slate-900 transition-colors">Home</a>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-700 font-medium">Free AI growth tools</li>
          </ol>
        </nav>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-3">Free tools</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Free tools to accelerate your digital growth
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Most marketing platforms charge you for bloated services filled with features you'll never use. We built these tools to cut through the noise — simple, focused, and completely free.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Keyword Tracker Tool */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Simple keyword tracker
              </h2>
              <p className="text-slate-600 mb-6 flex-1">
                Track your website's Google search rankings for any keyword. Monitor positions across different locations and get insights on ranking opportunities.
              </p>
              <a
                href="/free-simple-keyword-tracker"
                className="block w-full text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors text-center font-medium"
              >
                Launch tool
              </a>
            </div>

            {/* Conversion Rate Audit Tool */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Website conversion rate audit
              </h2>
              <p className="text-slate-600 mb-6 flex-1">
                Instantly audit your landing page and get a CRO score based on best practice conversion rate optimisation. No sign-up needed — just enter your URL and goal to get started.
              </p>
              <a
                href="/website-conversion-rate-audit"
                className="block w-full text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors text-center font-medium"
              >
                Launch tool
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={ToolsLanding} />
      <Route path="/ai-growth-tools" component={ToolsLanding} />
      <Route path="/free-simple-keyword-tracker" component={Dashboard} />
      <Route path="/website-conversion-rate-audit" component={CROAuditPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
