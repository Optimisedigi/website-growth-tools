# Setup Instructions for Your Audit App

## Step 1: Add Header to Your Audit App

### Copy Files:
1. **Copy `audit-app-header.tsx`** to your audit app's components folder
2. **Copy the logo file** from this project to your audit app assets

### Install Dependencies:
```bash
npm install lucide-react
```

### Update Logo Path:
In `audit-app-header.tsx`, update line 6:
```tsx
// Change this line
import logoPath from "@assets/Optimise-Digital-Logo-new_1752059045392.png";

// And update the img src
<img src={logoPath} alt="Optimise Digital" className="h-8 w-auto flex-shrink-0" />
```

## Step 2: Add Google Tag Manager

Add to your `index.html` head section:
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5J7745W');</script>
<!-- End Google Tag Manager -->
```

Add to your `index.html` body (right after opening body tag):
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5J7745W"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## Step 3: Use Header in Your App

```tsx
import Header from './components/audit-app-header';

function App() {
  return (
    <div>
      <Header />
      {/* Your audit tool content */}
    </div>
  );
}
```

## Step 4: Styling Requirements

Make sure your audit app has Tailwind CSS configured with these classes:
- `bg-white`, `border-gray-200`, `text-gray-700`, etc.
- `hover:` states
- `md:`, `lg:` responsive breakpoints
- `z-50` for dropdowns

## Step 5: Deploy Your Audit App

1. **Test locally** to ensure header works correctly
2. **Deploy your audit app** to get the Replit URL
3. **Note the deployment URL** (something like `your-audit-app.repl.co`)

## Step 6: Subdomain Routing Setup

You'll need to configure routing to handle both apps under `tool.optimisedigital.online`:

### Option A: Reverse Proxy (Recommended)
Set up a reverse proxy service that routes:
- `tool.optimisedigital.online/free-keyword-tracker` → Your current keyword app
- `tool.optimisedigital.online/website-conversion-rate-audit` → Your new audit app

### Option B: DNS + Path Routing
Configure your DNS provider with path-based routing rules.

### Popular Services for This:
- **Cloudflare Workers**: Custom routing logic
- **Vercel**: Edge functions for routing
- **Nginx**: Traditional reverse proxy
- **API Gateway**: AWS, Google Cloud, etc.

## Step 7: Update Navigation Links

Once routing is set up, both apps will cross-reference each other through the Growth Tools dropdown:
- Keyword tracker links to audit tool
- Audit tool links back to keyword tracker

## Test Checklist

Before going live:
- [ ] Header displays correctly on desktop and mobile
- [ ] All dropdown menus work
- [ ] Logo links to main website
- [ ] CTA button links to contact page
- [ ] Google Tag Manager is firing
- [ ] Navigation between tools works
- [ ] Responsive design looks good
- [ ] Brand consistency maintained

## Current Status

**Your Multi-Tool Setup:**
```
tool.optimisedigital.online/
├── /                                    # Landing page (in keyword app)
├── /free-keyword-tracker               # Your keyword tool ✅
└── /website-conversion-rate-audit      # Your audit tool (needs routing)
```

The header component I've provided maintains complete brand consistency and includes cross-links between your tools!