import { useState } from "react";
import logoPath from "@assets/optimise-digital-logo-black.webp";

const SITE = "https://www.optimisedigital.online";

const services = [
  { name: "SEO", href: `${SITE}/services/seo`, description: "Organic search visibility" },
  { name: "Google ads", href: `${SITE}/services/paid-search`, description: "Paid search campaigns" },
  { name: "Paid social", href: `${SITE}/services/paid-social`, description: "Social media advertising" },
  { name: "CRO", href: `${SITE}/services/cro`, description: "Conversion rate optimisation" },
  { name: "Integrated digital growth", href: `${SITE}/services/integrated-digital-growth-strategy`, description: "Full-funnel growth strategy" },
  { name: "AI and automation", href: `${SITE}/services/ai-automation`, description: "AI-powered marketing" },
];

const tools = [
  { name: "Free keyword rank tracker", href: "/ai-growth-tools/free-simple-keyword-tracker", description: "Track your SEO rankings" },
  { name: "Free website conversion rate audit", href: "/ai-growth-tools/website-conversion-rate-audit", description: "Audit your conversion rate" },
];

function getServiceIcon(index: number) {
  const icons = [
    // SEO
    <svg key="seo" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>,
    // Google ads
    <svg key="paid-search" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>,
    // Paid Social
    <svg key="paid-social" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>,
    // CRO
    <svg key="cro" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>,
    // Digital Growth Strategy
    <svg key="strategy" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
    // AI and Automation
    <svg key="ai" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>,
  ];
  return icons[index % icons.length];
}

function getToolIcon(index: number) {
  const icons = [
    // Keyword Rank Tracker
    <svg key="rank-tracker" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>,
    // Conversion Rate Audit
    <svg key="cro-audit" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>,
  ];
  return icons[index % icons.length];
}

type DropdownKey = "services" | "tools" | null;

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center justify-between border border-slate-200 rounded-full px-3 py-2 bg-slate-50/80 shadow-sm">
          {/* Logo */}
          <a href={SITE} className="flex items-center pl-2 pr-4">
            <img src={logoPath} alt="Optimise Digital" className="h-9 w-auto" />
          </a>

          {/* Center nav */}
          <div className="flex items-center gap-1">
            {/* Services */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("services")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={`${SITE}/services`}
                className="flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-150 whitespace-nowrap"
              >
                Services
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "services" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ease-out ${
                  openDropdown === "services"
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1"
                }`}
              >
                <div className="bg-white rounded-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] border border-slate-200/80 py-2 min-w-[260px]">
                  {services.map((s, index) => (
                    <a
                      key={s.name}
                      href={s.href}
                      className="group/item flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-150"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors duration-150 flex-shrink-0 mt-0.5">
                        {getServiceIcon(index)}
                      </div>
                      <div>
                        <div className="text-[15px] font-medium text-slate-900">
                          {s.name}
                        </div>
                        <div className="text-sm text-slate-500 group-hover/item:text-slate-600 transition-colors duration-150 mt-0.5">
                          {s.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Integrated digital growth */}
            <a
              href={`${SITE}/services/integrated-digital-growth-strategy`}
              className="px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-150 whitespace-nowrap"
            >
              Integrated digital growth
            </a>

            {/* Free AI growth tools */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("tools")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="/ai-growth-tools"
                className="flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-150 whitespace-nowrap"
              >
                Free AI growth tools
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "tools" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ease-out ${
                  openDropdown === "tools"
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1"
                }`}
              >
                <div className="bg-white rounded-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] border border-slate-200/80 py-2 min-w-[260px]">
                  {tools.map((t, index) => (
                    <a
                      key={t.name}
                      href={t.href}
                      className="group/item flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-150"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors duration-150 flex-shrink-0 mt-0.5">
                        {getToolIcon(index)}
                      </div>
                      <div>
                        <div className="text-[15px] font-medium text-slate-900">
                          {t.name}
                        </div>
                        <div className="text-sm text-slate-500 group-hover/item:text-slate-600 transition-colors duration-150 mt-0.5">
                          {t.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Growth hub */}
            <a
              href={`${SITE}/digital-marketing-growth-hub`}
              className="px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-all duration-150 whitespace-nowrap"
            >
              Growth hub
            </a>
          </div>

          {/* Right: Contact */}
          <div className="flex items-center pr-1">
            <a
              href={`${SITE}/contact`}
              className="ml-1 px-5 py-2 text-[15px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-150"
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Mobile header */}
        <div className="flex lg:hidden items-center justify-between w-full border border-slate-200 rounded-full px-3 py-2 bg-slate-50/80">
          <a href={SITE} className="flex items-center">
            <img src={logoPath} alt="Optimise Digital" className="h-7 w-auto" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col space-y-1">
              {/* Services */}
              <button
                onClick={() => setMobileSection(mobileSection === "services" ? null : "services")}
                className="flex items-center justify-between w-full py-3 text-slate-700 font-medium"
              >
                <span>Services</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${mobileSection === "services" ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSection === "services" && (
                <div className="pl-4 pb-2 space-y-1">
                  {services.map((s) => (
                    <a key={s.name} href={s.href} className="block py-2.5 text-slate-600 hover:text-slate-900 transition-colors">
                      {s.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Free AI growth tools */}
              <button
                onClick={() => setMobileSection(mobileSection === "tools" ? null : "tools")}
                className="flex items-center justify-between w-full py-3 text-slate-700 font-medium"
              >
                <span>Free AI growth tools</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${mobileSection === "tools" ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSection === "tools" && (
                <div className="pl-4 pb-2 space-y-1">
                  {tools.map((t) => (
                    <a key={t.name} href={t.href} className="block py-2.5 text-slate-600 hover:text-slate-900 transition-colors">
                      {t.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Growth hub */}
              <a href={`${SITE}/digital-marketing-growth-hub`} className="block py-3 text-slate-700 font-medium hover:text-slate-900 transition-colors">
                Growth hub
              </a>

              {/* Contact */}
              <div className="pt-3 mt-3 border-t border-slate-200">
                <a
                  href={`${SITE}/contact`}
                  className="block w-full py-3 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
