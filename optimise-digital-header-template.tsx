import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// Import your logo asset
// import optimiseDigitalLogo from "@assets/Optimise-Digital-Logo-new_1752059045392.png";

interface HeaderProps {
  /**
   * Current page identifier to highlight active navigation
   * Options: 'services' | 'case-studies' | 'growth-hub' | 'growth-tools' | 'about' | 'contact'
   */
  currentPage?: string;
  
  /**
   * Custom CTA button configuration
   */
  ctaButton?: {
    text: string;
    href: string;
    className?: string;
  };
  
  /**
   * Additional navigation items for Growth Tools dropdown
   */
  additionalGrowthTools?: Array<{
    label: string;
    href: string;
    isHighlighted?: boolean;
  }>;
}

/**
 * Optimise Digital Header Component - Reusable Template
 * 
 * This is a complete header matching optimisedigital.online branding and navigation.
 * 
 * Usage:
 * <OptimiseDigitalHeader 
 *   currentPage="growth-tools"
 *   ctaButton={{
 *     text: "Get Your FREE Assessment",
 *     href: "https://www.optimisedigital.online/contact"
 *   }}
 *   additionalGrowthTools={[
 *     { label: "Your Custom Tool", href: "/your-tool", isHighlighted: true }
 *   ]}
 * />
 * 
 * Required dependencies:
 * - lucide-react
 * - Tailwind CSS
 * 
 * Required assets:
 * - Optimise Digital logo (update the import path above)
 */
export default function OptimiseDigitalHeader({ 
  currentPage = '',
  ctaButton = {
    text: "Get Your FREE Growth Assessment",
    href: "https://www.optimisedigital.online/contact"
  },
  additionalGrowthTools = []
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Default Growth Tools items
  const defaultGrowthTools = [
    { 
      label: "The FREE Simple Keyword Tracker", 
      href: "https://tool.optimisedigital.online/free-simple-keyword-tracker",
      isHighlighted: true 
    }
  ];

  // Combine default and additional growth tools
  const allGrowthTools = [...defaultGrowthTools, ...additionalGrowthTools];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="https://www.optimisedigital.online/" className="flex items-center">
              {/* Update this img src to your logo path */}
              <img 
                src="/path-to-your-logo.png" 
                alt="Optimise Digital" 
                className="h-8 sm:h-10 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center space-x-1 font-medium whitespace-nowrap py-2 ${
                currentPage === 'services' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}>
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 pt-1 w-[20rem] z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="https://www.optimisedigital.online/google-ads-facebook-ads" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Google Ads & Facebook Ads
                      </a>
                      <a href="https://www.optimisedigital.online/website-development" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        Website Development
                      </a>
                      <a href="https://www.optimisedigital.online/seo-search-engine-optimisation" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        SEO (Search Engine Optimisation)
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Case Studies */}
            <a 
              href="https://www.optimisedigital.online/case-studies" 
              className={`font-medium whitespace-nowrap ${
                currentPage === 'case-studies' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Case Studies
            </a>

            {/* Growth Hub Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('growth-hub')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center space-x-1 font-medium whitespace-nowrap py-2 ${
                currentPage === 'growth-hub' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}>
                <span>Growth Hub</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'growth-hub' && (
                <div className="absolute top-full left-0 pt-1 w-[28rem] z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
                        The Decline of Digital Marketing - What's Really Going On?
                      </a>
                      <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block px-4 py-1.5 text-sm text-white hover:bg-gray-800">
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
              <button className={`flex items-center space-x-1 font-medium whitespace-nowrap py-2 ${
                currentPage === 'growth-tools' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}>
                <span>Growth Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'growth-tools' && (
                <div className="absolute top-full left-0 pt-1 w-[20rem] z-50">
                  <div className="bg-black border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      {allGrowthTools.map((tool, index) => (
                        <a 
                          key={index}
                          href={tool.href} 
                          className={`block px-4 py-1.5 text-sm text-white hover:bg-gray-800 ${
                            tool.isHighlighted ? 'font-semibold' : ''
                          }`}
                        >
                          {tool.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <a 
              href="https://www.optimisedigital.online/about-us" 
              className={`font-medium whitespace-nowrap ${
                currentPage === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              About Us
            </a>

            {/* Contact */}
            <a 
              href="https://www.optimisedigital.online/contact" 
              className={`font-medium whitespace-nowrap ${
                currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <a
              href={ctaButton.href}
              className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors whitespace-nowrap ${ctaButton.className || ''}`}
            >
              {ctaButton.text}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* Services Mobile */}
              <div className="block px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Services</div>
                <div className="pl-4 space-y-1">
                  <a href="https://www.optimisedigital.online/google-ads-facebook-ads" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Google Ads & Facebook Ads
                  </a>
                  <a href="https://www.optimisedigital.online/website-development" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Website Development
                  </a>
                  <a href="https://www.optimisedigital.online/seo-search-engine-optimisation" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    SEO (Search Engine Optimisation)
                  </a>
                </div>
              </div>

              {/* Case Studies Mobile */}
              <a href="https://www.optimisedigital.online/case-studies" className="block px-3 py-2 text-gray-700 font-medium hover:text-gray-900">
                Case Studies
              </a>

              {/* Growth Hub Mobile */}
              <div className="block px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Growth Hub</div>
                <div className="pl-4 space-y-1">
                  <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    The Decline of Digital Marketing - What's Really Going On?
                  </a>
                  <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/why-your-digital-marketing-isnt-working-anymore" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    How to Organically Improve Your Google Business Ranking
                  </a>
                  <a href="https://www.optimisedigital.online/growth-hub-digital-marketing-insights/is-digital-marketing-right-for-my-businessservice" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                    Is Advertising Right for Your Business?
                  </a>
                </div>
              </div>

              {/* Growth Tools Mobile */}
              <div className="block px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Growth Tools</div>
                <div className="pl-4 space-y-1">
                  {allGrowthTools.map((tool, index) => (
                    <a 
                      key={index}
                      href={tool.href} 
                      className={`block py-1 text-sm text-gray-600 hover:text-gray-900 ${
                        tool.isHighlighted ? 'font-semibold' : ''
                      }`}
                    >
                      {tool.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* About Us Mobile */}
              <a href="https://www.optimisedigital.online/about-us" className="block px-3 py-2 text-gray-700 font-medium hover:text-gray-900">
                About Us
              </a>

              {/* Contact Mobile */}
              <a href="https://www.optimisedigital.online/contact" className="block px-3 py-2 text-gray-700 font-medium hover:text-gray-900">
                Contact
              </a>

              {/* CTA Button Mobile */}
              <div className="px-3 py-2">
                <a
                  href={ctaButton.href}
                  className={`block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors ${ctaButton.className || ''}`}
                >
                  {ctaButton.text}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}