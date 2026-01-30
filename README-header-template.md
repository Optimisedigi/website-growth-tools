# Optimise Digital Header Template

This is a reusable header component that matches the exact branding and navigation structure of optimisedigital.online.

## Quick Setup

### 1. Copy the Component
Copy `optimise-digital-header-template.tsx` to your new Replit project.

### 2. Install Dependencies
```bash
npm install lucide-react
```

### 3. Add Your Logo
1. Upload your logo to `attached_assets/` or `public/`
2. Update the logo import path in the component:
```tsx
// Update this line with your logo path
<img src="/your-logo-path.png" alt="Optimise Digital" />
```

### 4. Basic Usage
```tsx
import OptimiseDigitalHeader from './optimise-digital-header-template';

function App() {
  return (
    <div>
      <OptimiseDigitalHeader currentPage="growth-tools" />
      {/* Your app content */}
    </div>
  );
}
```

## Advanced Configuration

### Highlight Current Page
```tsx
<OptimiseDigitalHeader currentPage="services" />
```
Options: `'services'` | `'case-studies'` | `'growth-hub'` | `'growth-tools'` | `'about'` | `'contact'`

### Custom CTA Button
```tsx
<OptimiseDigitalHeader 
  ctaButton={{
    text: "Try Our Tool",
    href: "/your-tool",
    className: "bg-blue-500 hover:bg-blue-600" // Optional custom styling
  }}
/>
```

### Add Custom Growth Tools
```tsx
<OptimiseDigitalHeader 
  additionalGrowthTools={[
    { 
      label: "Your Custom Tool", 
      href: "/your-tool", 
      isHighlighted: true 
    },
    { 
      label: "Another Tool", 
      href: "/another-tool" 
    }
  ]}
/>
```

## Features Included

✅ **Exact Brand Match**: Matches optimisedigital.online styling and navigation
✅ **Responsive Design**: Works on desktop and mobile
✅ **Hover Dropdowns**: Desktop dropdown menus with proper hover states
✅ **Mobile Menu**: Hamburger menu for mobile devices
✅ **Sticky Header**: Stays at top when scrolling
✅ **Active States**: Highlights current page
✅ **Customizable**: Easy to modify for different tools

## Navigation Structure

- **Services** (dropdown)
  - Google Ads & Facebook Ads
  - Website Development  
  - SEO (Search Engine Optimisation)
- **Case Studies**
- **Growth Hub** (dropdown)
  - Marketing insights articles
- **Growth Tools** (dropdown)
  - FREE Simple Keyword Tracker
  - Your custom tools
- **About Us**
- **Contact**

## Styling

The component uses Tailwind CSS classes. Make sure your project has Tailwind configured with these base classes:
- Standard color palette (gray, blue, orange)
- Responsive breakpoints (sm, lg)
- Hover and focus states

## Google Tag Manager

If you need Google Tag Manager tracking like in the original tool, add this to your HTML head:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5J7745W');</script>
<!-- End Google Tag Manager -->
```

And in your body:
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5J7745W"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## File Structure for New Project

```
your-new-project/
├── src/
│   ├── components/
│   │   └── optimise-digital-header.tsx  // The template
│   └── App.tsx  // Your main app
├── public/
│   └── logo.png  // Your logo file
└── package.json
```

This template gives you a complete, branded header that maintains consistency across all your Optimise Digital tools while being flexible enough to customize for each specific application.