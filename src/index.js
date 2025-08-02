/**
 * Cloudflare Worker for Gravity Ion Thermoelectric Website
 * This worker serves static assets and handles SPA routing
 */

export default {
  async fetch(request, env, _ctx) {
    try {
      // Try to serve the static asset
      const response = await env.ASSETS.fetch(request);
      
      // If the asset exists, return it
      if (response.status !== 404) {
        return response;
      }
      
      // For SPA routing: if no asset found and it's a navigation request,
      // serve index.html
      if (request.headers.get('Accept')?.includes('text/html')) {
        const indexUrl = new URL('/index.html', request.url).toString();
        const indexRequest = new globalThis.Request(indexUrl, request);
        const indexResponse = await env.ASSETS.fetch(indexRequest);
        
        if (indexResponse.status === 200) {
          return new globalThis.Response(indexResponse.body, {
            ...indexResponse,
            headers: {
              ...indexResponse.headers,
              'Content-Type': 'text/html'
            }
          });
        }
      }
      
      // If still not found, return 404
      return new globalThis.Response('Not Found', { status: 404 });
      
    } catch (error) {
      // Handle any errors
      console.error('Worker error:', error);
      return new globalThis.Response('Internal Server Error', { status: 500 });
    }
  }
};
