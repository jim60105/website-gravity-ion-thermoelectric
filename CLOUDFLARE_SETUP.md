# Cloudflare Workers Setup Guide

This project has been successfully configured for deployment on Cloudflare Workers with static assets.

## Project Structure

```
/
├── index.html                 # Main HTML file
├── src/
│   └── index.js              # Cloudflare Worker script
├── assets/                   # Static assets (JS, CSS, images)
├── wrangler.toml            # Cloudflare Workers configuration
├── .assetsignore            # Files to exclude from deployment
└── package.json             # Project configuration
```

## Available Commands

- `npm run dev` - Start local development server with Wrangler
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run preview` - Preview deployment (dry run)
- `npm run lint` - Run ESLint on JavaScript files
- `npm run format` - Format code with Prettier

## Development

### Local Development
```bash
npm run dev
```
This starts a local development server at `http://localhost:8787`

### Deployment
```bash
npm run deploy
```
This deploys to your Cloudflare Workers subdomain

## Configuration

### Wrangler Configuration (`wrangler.toml`)
- **Static Assets**: Serves all files from the project root
- **SPA Support**: Redirects unknown routes to `index.html`
- **Smart Placement**: Optimal performance through automatic workload placement
- **Node.js Compatibility**: Enhanced runtime features

### Asset Exclusion (`.assetsignore`)
- Python virtual environments and cache files
- Node.js modules and build files
- Configuration and documentation files
- Large binary files

## Features

- ✅ Static asset serving
- ✅ Single Page Application (SPA) routing
- ✅ Gzip compression
- ✅ Global CDN distribution
- ✅ Custom domain support
- ✅ Preview deployments

## Performance

- **Bundle Size**: ~26 KiB total / ~6 KiB gzipped
- **Edge Deployment**: Global CDN with 330+ locations
- **Cold Start**: < 5ms typical response time

## Production URL

Your website is deployed at:
https://website-gravity-ion-thermoelectric.jim60105.workers.dev

## Next Steps

1. **Custom Domain**: Add a custom domain in the Cloudflare dashboard
2. **Environment Variables**: Add secrets using `wrangler secret put`
3. **Analytics**: Enable Workers Analytics for usage insights
4. **Caching**: Configure cache headers for optimal performance

## Troubleshooting

- **Large Files**: Check `.assetsignore` if deployment fails due to file size limits
- **Build Errors**: Ensure all dependencies are listed in `package.json`
- **Routing Issues**: Verify SPA routing is working correctly for client-side navigation
