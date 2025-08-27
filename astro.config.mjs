// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://goldsabertooth.com',
  output: 'server',
  adapter: netlify({
    // Optimize Edge Functions for better performance
    edgeMiddleware: true,
    // Enable caching for better performance
    cacheOnDemandPages: true
  }),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  server: {
    port: 4321
  },
  image: {
    domains: ['cdn.shopify.com'],
    // Optimize images for web performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      }
    ]
  },
  // Optimize build performance
  build: {
    // Enable asset inlining for smaller files
    inlineStylesheets: 'auto',
    // Split chunks for better caching
    split: true
  },
  // Enable compression for better performance
  compressHTML: true,
  // Optimize assets
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Rollup options for optimization
      rollupOptions: {
        output: {
          // Better chunk naming for caching
          assetFileNames: '_astro/[name].[hash][extname]',
          chunkFileNames: '_astro/[name].[hash].js',
          entryFileNames: '_astro/[name].[hash].js'
        }
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand']
    }
  }
});
