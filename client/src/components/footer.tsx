import optimiseDigitalWhiteLogo from "@assets/Optimise Digital Logo White_1753703347322.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Left side - Logo and description */}
          <div className="flex-1 max-w-md">
            <div className="mb-4">
              <img 
                src={optimiseDigitalWhiteLogo} 
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
              href="https://tool.optimisedigital.online"
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Free Business Growth Tools
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