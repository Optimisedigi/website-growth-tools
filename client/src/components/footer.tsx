import logoPath from "@assets/optimise-digital-logo-black.webp";

const SITE = "https://www.optimisedigital.online";

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href={SITE} className="inline-block">
              <img
                src={logoPath}
                alt="Optimise Digital"
                className="h-9 w-auto"
              />
            </a>
            <p className="mt-4 text-slate-600 max-w-md">
              Clear strategy. Honest advice. Helping brands grow the right way, with intent, consistency, and measurable outcomes.
            </p>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.linkedin.com/company/optimisedigitalonline"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Growth services */}
          <div>
            <p className="font-semibold text-slate-900 mb-4">Growth services</p>
            <ul className="space-y-3">
              <li><a href={`${SITE}/services/seo`} className="text-slate-600 hover:text-slate-900 transition-colors">SEO</a></li>
              <li><a href={`${SITE}/services/paid-search`} className="text-slate-600 hover:text-slate-900 transition-colors">Google ads</a></li>
              <li><a href={`${SITE}/services/paid-social`} className="text-slate-600 hover:text-slate-900 transition-colors">Paid social</a></li>
              <li><a href={`${SITE}/services/cro`} className="text-slate-600 hover:text-slate-900 transition-colors">CRO</a></li>
              <li><a href={`${SITE}/services/integrated-digital-growth-strategy`} className="text-slate-600 hover:text-slate-900 transition-colors">Integrated digital growth</a></li>
              <li><a href={`${SITE}/services/ai-automation`} className="text-slate-600 hover:text-slate-900 transition-colors">AI and automation</a></li>
            </ul>
          </div>

          {/* Free tools */}
          <div>
            <p className="font-semibold text-slate-900 mb-4">Free tools</p>
            <ul className="space-y-3">
              <li><a href={`${SITE}/digital-marketing-growth-hub`} className="text-slate-600 hover:text-slate-900 transition-colors">Growth hub</a></li>
              <li><a href="/free-simple-keyword-tracker" className="text-slate-600 hover:text-slate-900 transition-colors">AI keyword tracker</a></li>
              <li><a href="/website-conversion-rate-audit" className="text-slate-600 hover:text-slate-900 transition-colors">AI conversion audit</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="font-semibold text-slate-900 mb-4">Support</p>
            <ul className="space-y-3 text-slate-600">
              <li><a href={`${SITE}/about`} className="hover:text-slate-900 transition-colors">About</a></li>
              <li><a href={`${SITE}/contact`} className="hover:text-slate-900 transition-colors">Contact</a></li>
              <li><a href={`${SITE}/careers`} className="hover:text-slate-900 transition-colors">Careers</a></li>
              <li><span className="text-slate-600">Team hub</span></li>
              <li><span className="text-slate-600">Client hub</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} Optimise Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
