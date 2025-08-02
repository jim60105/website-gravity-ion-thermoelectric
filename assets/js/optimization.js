/**
 * Performance Optimization Module
 * 
 * This module provides various performance optimization features including:
 * - Lazy loading for images and iframes
 * - Resource preloading
 * - Critical resource prioritization
 * - Core Web Vitals monitoring
 * - Browser caching optimization
 */

class PerformanceOptimizer {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        this.preloadedResources = new Set();
        this.metrics = {
            LCP: null,
            FID: null,
            CLS: null,
            TTFB: null
        };
        
        this.init();
    }

    /**
     * Initialize performance optimization features
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupOptimizations();
            });
        } else {
            this.setupOptimizations();
        }
    }

    /**
     * Setup all performance optimizations
     */
    setupOptimizations() {
        this.setupLazyLoading();
        this.setupResourcePreloading();
        this.setupCriticalResourceHints();
        this.monitorCoreWebVitals();
        this.optimizeScrollPerformance();
        this.setupImageOptimization();
        this.optimizeThirdPartyScripts();
        
        console.info('[Performance] Optimization systems initialized');
    }

    /**
     * Setup lazy loading for images and iframes
     */
    setupLazyLoading() {
        // Use native lazy loading when supported
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.loading = 'lazy';
            });
        } else {
            // Fallback to Intersection Observer
            this.setupIntersectionObserver();
        }

        // Lazy load videos and iframes
        this.setupVideoLazyLoading();
    }

    /**
     * Setup Intersection Observer for lazy loading fallback
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            this.loadAllImages();
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, this.observerOptions);

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * Load individual image
     */
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const newImg = new Image();
            
            newImg.onload = () => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
                img.classList.add('loaded');
                resolve(img);
            };
            
            newImg.onerror = () => {
                img.classList.add('error');
                reject(new Error(`Failed to load image: ${img.dataset.src}`));
            };
            
            newImg.src = img.dataset.src;
        });
    }

    /**
     * Load all images immediately (fallback)
     */
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }

    /**
     * Setup lazy loading for videos
     */
    setupVideoLazyLoading() {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.removeAttribute('data-src');
                        video.load();
                    }
                    videoObserver.unobserve(video);
                }
            });
        }, this.observerOptions);

        const lazyVideos = document.querySelectorAll('video[data-src], iframe[data-src]');
        lazyVideos.forEach(video => videoObserver.observe(video));
    }

    /**
     * Preload critical resources
     */
    setupResourcePreloading() {
        // Preload critical images
        const criticalImages = [
            '/assets/images/og-image.webp',
            '/assets/images/hero-background.webp'
        ];

        criticalImages.forEach(src => this.preloadResource(src, 'image'));

        // Preload critical CSS and JS
        const criticalResources = [
            { href: '/assets/css/styles.css', as: 'style' },
            { href: '/assets/js/main.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            this.preloadResource(resource.href, resource.as);
        });
    }

    /**
     * Preload a specific resource
     */
    preloadResource(href, as) {
        if (this.preloadedResources.has(href)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        
        if (as === 'image') {
            link.type = 'image/webp';
        }
        
        document.head.appendChild(link);
        this.preloadedResources.add(href);
    }

    /**
     * Setup critical resource hints
     */
    setupCriticalResourceHints() {
        // DNS prefetch for external domains
        const externalDomains = [
            'https://cdn.tailwindcss.com',
            'https://cdn.jsdelivr.net',
            'https://vixra.org',
            'https://youtu.be'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });

        // Preconnect to critical external resources
        const preconnectDomains = [
            'https://cdn.tailwindcss.com',
            'https://cdn.jsdelivr.net'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * Monitor Core Web Vitals
     */
    monitorCoreWebVitals() {
        // Monitor Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // Monitor First Input Delay (FID)
        this.observeFID();
        
        // Monitor Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // Monitor Time to First Byte (TTFB)
        this.measureTTFB();
    }

    /**
     * Observe Largest Contentful Paint
     */
    observeLCP() {
        if (!('PerformanceObserver' in window)) return;

        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.LCP = lastEntry.startTime;
            
            console.info(`[Performance] LCP: ${this.metrics.LCP.toFixed(2)}ms`);
            
            if (this.metrics.LCP > 2500) {
                console.warn('[Performance] LCP is above recommended threshold (2.5s)');
            }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    /**
     * Observe First Input Delay
     */
    observeFID() {
        if (!('PerformanceObserver' in window)) return;

        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.FID = entry.processingStart - entry.startTime;
                
                console.info(`[Performance] FID: ${this.metrics.FID.toFixed(2)}ms`);
                
                if (this.metrics.FID > 100) {
                    console.warn('[Performance] FID is above recommended threshold (100ms)');
                }
            });
        });

        observer.observe({ entryTypes: ['first-input'] });
    }

    /**
     * Observe Cumulative Layout Shift
     */
    observeCLS() {
        if (!('PerformanceObserver' in window)) return;

        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            this.metrics.CLS = clsValue;
            
            if (this.metrics.CLS > 0.1) {
                console.warn(`[Performance] CLS is above recommended threshold: ${this.metrics.CLS.toFixed(4)}`);
            }
        });

        observer.observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Measure Time to First Byte
     */
    measureTTFB() {
        if (!window.performance || !window.performance.timing) return;

        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            this.metrics.TTFB = perfData.responseStart - perfData.navigationStart;
            
            console.info(`[Performance] TTFB: ${this.metrics.TTFB}ms`);
            
            if (this.metrics.TTFB > 800) {
                console.warn('[Performance] TTFB is above recommended threshold (800ms)');
            }
        });
    }

    /**
     * Optimize scroll performance
     */
    optimizeScrollPerformance() {
        let ticking = false;

        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-related optimizations
                    this.updateVisibleElements();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Use passive listeners for better performance
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
        window.addEventListener('resize', optimizedScrollHandler, { passive: true });
    }

    /**
     * Update visible elements during scroll
     */
    updateVisibleElements() {
        // Only process elements that are currently visible
        const elements = document.querySelectorAll('[data-animate-on-scroll]');
        elements.forEach(element => {
            if (this.isElementVisible(element)) {
                element.classList.add('visible');
            }
        });
    }

    /**
     * Check if element is visible in viewport
     */
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Setup image optimization
     */
    setupImageOptimization() {
        // Add WebP support detection
        this.detectWebPSupport().then(supportsWebP => {
            if (supportsWebP) {
                document.documentElement.classList.add('webp');
            } else {
                document.documentElement.classList.add('no-webp');
            }
        });

        // Optimize image loading priorities
        this.optimizeImagePriorities();
    }

    /**
     * Detect WebP support
     */
    detectWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * Optimize image loading priorities
     */
    optimizeImagePriorities() {
        // Mark critical images for immediate loading
        const criticalImages = document.querySelectorAll('img[data-critical]');
        criticalImages.forEach(img => {
            img.loading = 'eager';
            img.fetchPriority = 'high';
        });

        // Mark non-critical images for lazy loading
        const nonCriticalImages = document.querySelectorAll('img:not([data-critical])');
        nonCriticalImages.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            img.fetchPriority = 'low';
        });
    }

    /**
     * Optimize third-party scripts
     */
    optimizeThirdPartyScripts() {
        // Defer non-critical third-party scripts
        const thirdPartyScripts = document.querySelectorAll('script[src*="cdn"], script[src*="googleapis"]');
        thirdPartyScripts.forEach(script => {
            if (!script.async && !script.defer) {
                script.defer = true;
            }
        });
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Report performance metrics
     */
    reportMetrics() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.getMetrics(),
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };

        console.info('[Performance] Metrics Report:', report);
        
        // Send to analytics if available
        if (typeof Utils !== 'undefined' && Utils.Analytics) {
            Utils.Analytics.trackPerformance(report);
        }

        return report;
    }
}

// Initialize performance optimizer
if (typeof window !== 'undefined') {
    window.PerformanceOptimizer = new PerformanceOptimizer();
    
    // Report metrics after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.PerformanceOptimizer.reportMetrics();
        }, 5000);
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}