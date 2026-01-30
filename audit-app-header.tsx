import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// You'll need to add your logo to the audit app assets
// import logoPath from "@assets/Optimise-Digital-Logo-new_1752059045392.png";

// Footer component for consistency
function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Left side - Logo and description */}
          <div className="flex-1 max-w-md">
            <div className="mb-4">
              <img 
                src="/path-to-your-white-logo.png" // Update this to white logo path in your audit app
                alt="Optimise Digital" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-white text-sm leading-relaxed">
              Optimise Digital is a Sydney-based digital marketing agency helping businesses grow through SEO, paid search, social, email and CRO — built on strategy, data and intent.
            </p>
          </div>

          {/* Right side - Links */}
          <div className="flex flex-col gap-4 lg:items-end">
            <a 
              href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights"
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Learning Hub: Insights for Growth
            </a>
            <a 
              href="https://www.optimisedigital.online/google-ads-grant-nonprofit"
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Non-profit? Access your FREE Google Ads Grant
            </a>
            <a 
              href="https://www.optimisedigital.online/contact"
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Get your free growth assessment
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-[3px] border-gray-300 py-4">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="https://www.optimisedigital.online/">
              <img 
                src="/path-to-your-logo.png" // Update this path
                alt="Optimise Digital" 
                className="h-8 w-auto flex-shrink-0"
              />
            </a>
          </div>

          {/* Navigation and CTA Button Container */}
          <div className="hidden md:flex items-center ml-6 lg:ml-8 flex-1 justify-end">
            <nav className="flex items-center flex-wrap space-x-3 lg:space-x-5">
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap py-2 text-sm">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 pt-1 w-80 z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="https://www.optimisedigital.online/seo" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Search Engine Optimisation (SEO)
                      </a>
                      <a href="https://www.optimisedigital.online/conversion-rate-optimisation-cro" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Conversion Rate Optimisation (CRO)
                      </a>
                      <a href="https://www.optimisedigital.online/paid-search-advertising" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Paid Search Advertising
                      </a>
                      <a href="https://www.optimisedigital.online/paid-social-advertising" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Paid Social Advertising
                      </a>
                      <a href="https://www.optimisedigital.online/email-marketing" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Email Marketing
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Case Studies Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('case-studies')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap py-2 text-sm">
                <span>Case Studies</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'case-studies' && (
                <div className="absolute top-full left-0 pt-1 w-80 z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="https://www.optimisedigital.online/case-studies/how-we-increased-ramp-revenue-by-400-in-18-months" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        How We Increased Ramp Revenue by 400% in 18 Months
                      </a>
                      <a href="https://www.optimisedigital.online/case-studies/how-we-increased-leads-by-200-for-this-construction-company" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        How We Increased Leads by 200% for This Construction Company
                      </a>
                      <a href="https://www.optimisedigital.online/case-studies/how-we-generated-over-300-qualified-leads-in-30-days-with-a-5000-budget" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 text-wrap">
                        How We Generated Over 300 Qualified Leads in 30 Days with a $5,000 Budget
                      </a>
                      <a href="https://www.optimisedigital.online/case-studies/how-we-increased-leads-by-700-and-reduced-cost-per-lead-by-50-for-this-law-firm" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 text-wrap">
                        How We Increased Leads by 700% and Reduced Cost Per Lead by 50% for This Law Firm
                      </a>
                      <a href="https://www.optimisedigital.online/case-studies/how-we-increased-sales-by-250-in-6-months-for-this-ecommerce-business" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 text-wrap">
                        How We Increased Sales by 250% in 6 Months for This Ecommerce Business
                      </a>
                      <a href="https://www.optimisedigital.online/case-studies/how-we-increased-online-sales-by-400-for-this-saas-company" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 text-wrap">
                        How We Increased Online Sales by 400% for This SaaS Company
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Growth Hub Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('growth-hub')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap py-2 text-sm">
                <span>Growth Hub</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'growth-hub' && (
                <div className="absolute top-full left-0 pt-1 w-[28rem] z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        The Decline of Digital Marketing - What's Really Going On?
                      </a>
                      <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/boost-google-business-profile-ranking" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        How to Organically Improve Your Google Business Ranking
                      </a>
                      <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/is-digital-marketing-right-for-my-businessservice" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Is Advertising Right for Your Business?
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Growth Tools Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('growth-tools')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="https://www.optimisedigital.online/ai-growth-tools/" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap py-2 text-sm">
                <span>Growth Tools</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'growth-tools' && (
                <div className="absolute top-full left-0 pt-1 w-[20rem] z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="https://www.optimisedigital.online/ai-growth-tools/free-simple-keyword-tracker" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 font-semibold">
                        FREE Simple Keyword Tracker
                      </a>
                      <a href="https://www.optimisedigital.online/ai-growth-tools/website-conversion-rate-audit" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 font-semibold">
                        FREE Website Conversion Rate Audit
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a href="https://www.optimisedigital.online/contact" className="text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap text-sm">
              Contact
            </a>
            </nav>

            {/* CTA Button */}
            <div className="ml-4 lg:ml-6">
              <a
                href="https://www.optimisedigital.online/contact"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors whitespace-nowrap text-sm"
              >
                Get Your FREE Growth Assessment
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 mt-4">


              {/* Services Mobile */}
              <div className="block px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Services</div>
                <div className="pl-4 space-y-1">
                  <a href="https://www.optimisedigital.online/seo" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Search Engine Optimisation (SEO)
                  </a>
                  <a href="https://www.optimisedigital.online/conversion-rate-optimisation-cro" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Conversion Rate Optimisation (CRO)
                  </a>
                  <a href="https://www.optimisedigital.online/paid-search-advertising" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Paid Search Advertising
                  </a>
                  <a href="https://www.optimisedigital.online/paid-social-advertising" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Paid Social Advertising
                  </a>
                  <a href="https://www.optimisedigital.online/email-marketing" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Email Marketing
                  </a>
                </div>
              </div>

              {/* Case Studies Mobile */}
              <div className="block px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Case Studies</div>
                <div className="pl-4 space-y-1">
                  <a href="https://www.optimisedigital.online/case-studies/how-we-increased-ramp-revenue-by-400-in-18-months" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How We Increased Ramp Revenue by 400% in 18 Months
                  </a>
                  <a href="https://www.optimisedigital.online/case-studies/how-we-increased-leads-by-200-for-this-construction-company" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How We Increased Leads by 200% for This Construction Company
                  </a>
                  <a href="https://www.optimisedigital.online/case-studies/how-we-generated-over-300-qualified-leads-in-30-days-with-a-5000-budget" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How We Generated Over 300 Qualified Leads in 30 Days with a $5,000 Budget
                  </a>
                  <a href="https://www.optimisedigital.online/case-studies/how-we-increased-leads-by-700-and-reduced-cost-per-lead-by-50-for-this-law-firm" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How We Increased Leads by 700% and Reduced Cost Per Lead by 50% for This Law Firm
                  </a>
                  <a href="https://www.optimisedigital.online/case-studies/how-we-increased-sales-by-250-in-6-months-for-this-ecommerce-business" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How We Increased Sales by 250% in 6 Months for This Ecommerce Business
                  </a>
                  <a href="https://www.optimisedigital.online/case-studies/how-we-increased-online-sales-by-400-for-this-saas-company" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How We Increased Online Sales by 400% for This SaaS Company
                  </a>
                </div>
              </div>

              {/* Growth Hub Mobile */}
              <div className="block px-3 py-2">
                <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights" className="text-gray-700 font-medium mb-2 block hover:text-gray-900">Growth Hub</a>
                <div className="pl-4 space-y-1">
                  <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    The Decline of Digital Marketing - What's Really Going On?
                  </a>
                  <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/boost-google-business-profile-ranking" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How to Organically Improve Your Google Business Ranking
                  </a>
                  <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/is-digital-marketing-right-for-my-businessservice" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Is Advertising Right for Your Business?
                  </a>
                </div>
              </div>

              {/* Growth Tools Mobile */}
              <div className="block px-3 py-2">
                <a href="https://www.optimisedigital.online/ai-growth-tools/" className="text-gray-700 font-medium mb-2 block hover:text-gray-900">Growth Tools</a>
                <div className="pl-4 space-y-1">
                  <a href="https://www.optimisedigital.online/ai-growth-tools/free-simple-keyword-tracker" className="block py-1 text-sm text-gray-600 hover:text-gray-900 font-semibold">
                    FREE Simple Keyword Tracker
                  </a>
                  <a href="https://www.optimisedigital.online/ai-growth-tools/website-conversion-rate-audit" className="block py-1 text-sm text-gray-600 hover:text-gray-900 font-semibold">
                    FREE Website Conversion Rate Audit
                  </a>
                </div>
              </div>

              <a href="https://www.optimisedigital.online/contact" className="block px-3 py-2 text-gray-700 font-medium hover:text-gray-900">
                Contact
              </a>

              {/* CTA Button Mobile */}
              <div className="px-3 py-2">
                <a
                  href="https://www.optimisedigital.online/contact"
                  className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  Get Your FREE Growth Assessment
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Export both Header and Footer for consistency
export { Footer };