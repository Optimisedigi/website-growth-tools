import { ChevronDown } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/Optimise-Digital-Logo-new_1752059045392.png";

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
                src={logoPath} 
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
                <div className="absolute top-full left-0 pt-1 w-96 z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="https://www.optimisedigital.online/driving-growth-with-email-paid-social" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Boosting Online Visibility & Sales
                      </a>
                      <a href="https://www.optimisedigital.online/turning-traffic-into-leads-with-seo-cro" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Driving Growth with Email and Paid Social
                      </a>
                      <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Turning Traffic into Leads with SEO & CRO
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
              <a href="/" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap py-2 text-sm">
                <span>Free AI Growth Tools</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'growth-tools' && (
                <div className="absolute top-full left-0 pt-1 w-[20rem] z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="/free-simple-keyword-tracker" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 font-semibold">
                        FREE Simple Keyword Tracker
                      </a>
                      <a href="/website-conversion-rate-audit" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800 font-semibold">
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
            <div className="ml-6 lg:ml-8">
              <a
                href="https://www.optimisedigital.online/contact"
                className="text-white font-bold py-2 px-4 rounded-md transition-colors whitespace-nowrap"
                style={{ backgroundColor: '#F5C938', fontFamily: 'Poppins, sans-serif', fontSize: '13.75px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5B332'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F5C938'}
              >
                Get Your FREE Growth Assessment
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-700 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">

              
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
                  <a href="https://www.optimisedigital.online/driving-growth-with-email-paid-social" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Boosting Online Visibility & Sales
                  </a>
                  <a href="https://www.optimisedigital.online/turning-traffic-into-leads-with-seo-cro" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Driving Growth with Email and Paid Social
                  </a>
                  <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Turning Traffic into Leads with SEO & CRO
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

              {/* Free AI Growth Tools Mobile */}
              <div className="block px-3 py-2">
                <a href="/" className="text-gray-700 font-medium mb-2 block hover:text-gray-900">Free AI Growth Tools</a>
                <div className="pl-4 space-y-1">
                  <a href="/free-simple-keyword-tracker" className="block py-1 text-sm text-gray-600 hover:text-gray-900 font-semibold">
                    FREE Simple Keyword Tracker
                  </a>
                  <a href="/website-conversion-rate-audit" className="block py-1 text-sm text-gray-600 hover:text-gray-900 font-semibold">
                    FREE Website Conversion Rate Audit
                  </a>
                </div>
              </div>

              <a href="https://www.optimisedigital.online/contact" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Contact
              </a>

              {/* Mobile CTA Button */}
              <div className="px-3 py-2">
                <a
                  href="https://www.optimisedigital.online/contact"
                  className="block text-white font-bold px-4 py-2 rounded-md transition-colors text-center"
                  style={{ backgroundColor: '#F5C938', fontFamily: 'Poppins, sans-serif', fontSize: '13.75px' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5B332'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F5C938'}
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
