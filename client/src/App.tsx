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

// Landing page that shows available tools
function ToolsLanding() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Tools to Accelerate Your Digital Growth
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Most marketing platforms charge you for bloated services filled with features you'll never use. We built these tools to cut through the noise – simple, focused, and completely free. Use them anytime to uncover opportunities, improve your marketing, and grow your business without the unnecessary costs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Keyword Tracker Tool */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Simple Keyword Tracker
            </h2>
            <p className="text-gray-600 mb-6 flex-1">
              Track your website's Google search rankings for any keyword. 
              Monitor positions across different locations and get insights 
              on ranking opportunities.
            </p>
            <a 
              href="/free-simple-keyword-tracker"
              className="block w-full text-white px-6 py-3 rounded-md transition-colors text-center font-bold"
              style={{ backgroundColor: '#2563eb', fontFamily: 'Poppins, sans-serif', fontSize: '13.75px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Launch Tool →
            </a>
          </div>

          {/* Conversion Rate Audit Tool */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Free Website Conversion Rate Audit Tool
            </h2>
            <p className="text-gray-600 mb-6 flex-1">
              Instantly audit your landing page and get a CRO score based on best practice conversion rate optimisation. No sign-up needed – just enter your URL and goal to get started.
            </p>
            <a 
              href="/website-conversion-rate-audit"
              className="block w-full text-white px-6 py-3 rounded-md transition-colors text-center font-bold"
              style={{ backgroundColor: '#2563eb', fontFamily: 'Poppins, sans-serif', fontSize: '13.75px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Launch Tool →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={ToolsLanding} />
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
