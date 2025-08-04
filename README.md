# 🎨 Goldsabertooth - Psychedelic Underground MTG Art Shop

A bold, comic book-styled ecommerce site built with Astro, React, TypeScript, and Tailwind CSS, integrated with Shopify Storefront API.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Shopify credentials:
   ```
   PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_token_here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:4321`

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Features

- ✅ **Astro 5 SSR** with React components
- ✅ **Shopify Storefront API** integration
- ✅ **Psychedelic Design** with comic book aesthetics
- ✅ **Shopping Cart** with Zustand state management
- ✅ **Product Filtering** by categories
- ✅ **Mobile Responsive** with accessible UI
- ✅ **Netlify Ready** with forms and deployment

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, BaseLayout
│   └── ui/              # Reusable UI components
├── layouts/             # Page layouts
├── lib/                 # Shopify API, cart store, types
├── pages/               # Routes and API endpoints
├── styles/              # Global CSS and fonts
└── utils/               # Utility functions

public/
├── textures/            # Background textures
├── favicon.svg          # Site icon
└── social-card.png      # Social media card
```

## 🎨 Design System

**Colors:**
- Electric Blue: `#00BFFF`, `#1E90FF`
- Neon Orange: `#FF6B35`, `#FF8C42`
- Neon Lime: `#32CD32`, `#ADFF2F`
- Psychedelic Purple: `#8A2BE2`, `#9932CC`
- Ink: `#0a0a0a`
- Paper: `#f8f7f2`

**Typography:**
- Display: Bangers (for headings)
- Body: Inter (for content)

## 🛒 Shopify Setup

1. Create a Shopify store
2. Enable Storefront API
3. Create a private app with Storefront API access
4. Add the domain and token to your `.env` file

## 🚀 Deployment

The site is pre-configured for Netlify deployment:

1. Connect your repo to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy!

The contact form uses Netlify Forms (no additional setup needed).

## 📱 Pages

- **/** - Homepage with hero and featured products
- **/shop** - Product listing with filtering
- **/shop/[handle]** - Product detail pages
- **/contact** - Contact form

## 🎪 Customization

The psychedelic theme can be customized in:
- `tailwind.config.cjs` - Colors and design tokens
- `src/styles/globals.css` - Custom CSS and animations
- Individual components for specific styling

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code with Astro

---

**Ready to unleash the chaos?** 🎨⚡🔮
