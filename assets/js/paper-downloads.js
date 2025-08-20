/**
 * Paper Downloads - Real-time viXra download counter
 * Fetches real download counts from viXra and displays them with animations
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

class PaperDownloads {
    constructor() {
        this.vixraUrl = 'https://vixra.org/abs/2412.0035';
        this.downloadRegex = /<p><b>Unique-IP document downloads:<\/b>\s*(\d+)\s*times\s*<\/p>/i;
        this.cacheKey = 'vixra_download_count';
        this.cacheTimeKey = 'vixra_download_count_time';
        this.cacheValidityMs = 30 * 60 * 1000; // 30 minutes
        this.maxRetries = 3;
        this.retryDelay = 1000; // Start with 1 second
        this.autoUpdateInterval = 5 * 60 * 1000; // 5 minutes

        this.currentCount = 0;
        this.isLoading = false;
        this.lastUpdated = null;
        this.autoUpdateTimer = null;

        this.init();
    }

    /**
     * Initialize the paper downloads counter
     */
    async init() {
        try {
            const container = Utils.DOM.select('#live-download-stats');
            if (!container) {
                console.warn('Live download stats container not found');
                return;
            }

            this.setupUI();
            await this.loadDownloadCount();
            this.setupAutoUpdate();
            this.setupEventListeners();

            if (window.App?.AppConfig?.debug) {
                console.info('Paper Downloads counter initialized');
            }
        } catch (error) {
            this.handleError(error, 'Initialization failed');
        }
    }

    /**
     * Setup the UI elements for download counter
     */
    setupUI() {
        const container = Utils.DOM.select('#live-download-stats');
        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="download-counter text-center">
                <div class="counter-display mb-6">
                    <div id="download-count" class="counter-number text-6xl md:text-8xl font-bold text-green-400 mb-4 transition-all duration-500">
                        <span class="loading-text">載入中...</span>
                    </div>
                    <div class="counter-label text-xl md:text-2xl text-gray-100 mb-2">即時下載次數</div>
                    <div class="counter-subtitle text-sm text-gray-300">來自 viXra 即時數據</div>
                </div>
                
                <div class="counter-actions mb-4">
                    <button id="refresh-downloads" class="refresh-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 mx-auto">
                        <svg class="w-4 h-4 refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        <span class="refresh-text">重新整理</span>
                    </button>
                </div>
                
                <div id="last-updated" class="last-updated text-xs text-gray-400"></div>
                <div id="error-message" class="error-message hidden mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"></div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const refreshBtn = Utils.DOM.select('#refresh-downloads');
        if (refreshBtn) {
            Utils.DOM.on(refreshBtn, 'click', () => {
                this.manualRefresh();
            });
        }
    }

    /**
     * Load download count from cache or fetch from viXra
     */
    async loadDownloadCount() {
        try {
            // Check cache first
            const cachedData = this.getCachedData();
            if (cachedData && this.isCacheValid(cachedData.timestamp)) {
                this.displayCount(cachedData.count, cachedData.timestamp, true);
                return;
            }

            // Fetch fresh data
            await this.fetchDownloadCount();
        } catch (error) {
            this.handleError(error, 'Failed to load download count');
        }
    }

    /**
     * Fetch download count from viXra with retry logic
     */
    async fetchDownloadCount(retryCount = 0) {
        if (this.isLoading) {
            return;
        }

        this.setLoadingState(true);
        this.hideError();

        try {
            // Check if fetch is available
            if (typeof window.fetch === 'undefined') {
                throw new Error('Fetch API not supported');
            }

            // Check if AbortController is available
            let controller;
            let timeoutId;
            if (typeof window.AbortController !== 'undefined') {
                controller = new window.AbortController();
                timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
            }

            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                }
            };

            if (controller) {
                fetchOptions.signal = controller.signal;
            }

            const response = await window.fetch(this.vixraUrl, fetchOptions);

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const count = this.parseDownloadCount(html);

            if (count === null) {
                throw new Error('Failed to parse download count from HTML');
            }

            const timestamp = Date.now();
            this.cacheData(count, timestamp);
            this.displayCount(count, timestamp, false);

            if (window.App?.AppConfig?.debug) {
                console.info('Successfully fetched download count:', count);
            }

        } catch (error) {
            if (retryCount < this.maxRetries) {
                const delay = this.retryDelay * Math.pow(2, retryCount); // Exponential backoff
                if (window.App?.AppConfig?.debug) {
                    console.warn(`Retry ${retryCount + 1}/${this.maxRetries} in ${delay}ms:`, error.message);
                }

                setTimeout(() => {
                    this.fetchDownloadCount(retryCount + 1);
                }, delay);
            } else {
                this.handleError(error, 'Failed to fetch after all retries');
            }
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Parse download count from HTML using regex
     */
    parseDownloadCount(html) {
        try {
            const match = html.match(this.downloadRegex);
            if (match && match[1]) {
                return parseInt(match[1], 10);
            }
            return null;
        } catch (error) {
            console.warn('Error parsing download count:', error);
            return null;
        }
    }

    /**
     * Display the download count with animation
     */
    displayCount(count, timestamp, isFromCache) {
        this.currentCount = count;
        this.lastUpdated = timestamp;

        const countElement = Utils.DOM.select('#download-count');
        const lastUpdatedElement = Utils.DOM.select('#last-updated');

        if (countElement) {
            // Animate counter from current to new value
            this.animateCounter(countElement, count);
        }

        if (lastUpdatedElement) {
            const timeStr = new Date(timestamp).toLocaleString('zh-TW');
            const cacheIndicator = isFromCache ? ' (快取)' : '';
            lastUpdatedElement.textContent = `最後更新：${timeStr}${cacheIndicator}`;
        }
    }

    /**
     * Animate counter with counting effect
     */
    animateCounter(element, targetCount) {
        const startCount = this.currentCount || 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(startCount + (targetCount - startCount) * easeOutQuart);

            element.innerHTML = `<span class="count-number">${currentCount.toLocaleString()}</span>`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Final value
                element.innerHTML = `<span class="count-number">${targetCount.toLocaleString()}</span>`;
                // Add pulse effect when done
                element.style.animation = 'counterPulse 0.5s ease-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Set loading state
     */
    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        const refreshBtn = Utils.DOM.select('#refresh-downloads');
        const refreshIcon = Utils.DOM.select('.refresh-icon');
        const refreshText = Utils.DOM.select('.refresh-text');

        if (refreshBtn) {
            refreshBtn.disabled = isLoading;
            if (isLoading) {
                Utils.DOM.addClass(refreshBtn, 'opacity-50 cursor-not-allowed');
                if (refreshIcon) {
                    Utils.DOM.addClass(refreshIcon, 'animate-spin');
                }
                if (refreshText) {
                    refreshText.textContent = '載入中...';
                }
            } else {
                Utils.DOM.removeClass(refreshBtn, 'opacity-50 cursor-not-allowed');
                if (refreshIcon) {
                    Utils.DOM.removeClass(refreshIcon, 'animate-spin');
                }
                if (refreshText) {
                    refreshText.textContent = '重新整理';
                }
            }
        }
    }

    /**
     * Handle manual refresh
     */
    async manualRefresh() {
        if (this.isLoading) {return;}

        // Clear cache to force fresh fetch
        this.clearCache();
        await this.fetchDownloadCount();
    }

    /**
     * Cache data in localStorage
     */
    cacheData(count, timestamp) {
        try {
            Utils.Storage.set(this.cacheKey, count);
            Utils.Storage.set(this.cacheTimeKey, timestamp);
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    /**
     * Get cached data
     */
    getCachedData() {
        try {
            const count = Utils.Storage.get(this.cacheKey);
            const timestamp = Utils.Storage.get(this.cacheTimeKey);

            if (count !== null && timestamp !== null) {
                return { count: parseInt(count, 10), timestamp: parseInt(timestamp, 10) };
            }
        } catch (error) {
            console.warn('Failed to get cached data:', error);
        }
        return null;
    }

    /**
     * Check if cache is still valid
     */
    isCacheValid(timestamp) {
        return timestamp && (Date.now() - timestamp) < this.cacheValidityMs;
    }

    /**
     * Clear cache
     */
    clearCache() {
        Utils.Storage.remove(this.cacheKey);
        Utils.Storage.remove(this.cacheTimeKey);
    }

    /**
     * Setup auto-update timer
     */
    setupAutoUpdate() {
        // Clear existing timer
        if (this.autoUpdateTimer) {
            clearInterval(this.autoUpdateTimer);
        }

        // Set up new timer
        this.autoUpdateTimer = setInterval(() => {
            if (!this.isLoading) {
                this.loadDownloadCount();
            }
        }, this.autoUpdateInterval);
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorElement = Utils.DOM.select('#error-message');
        if (errorElement) {
            errorElement.textContent = message;
            Utils.DOM.removeClass(errorElement, 'hidden');
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        const errorElement = Utils.DOM.select('#error-message');
        if (errorElement) {
            Utils.DOM.addClass(errorElement, 'hidden');
        }
    }

    /**
     * Handle errors
     */
    handleError(error, context = 'Paper Downloads Error') {
        const errorInfo = {
            message: error.message || 'Unknown error',
            context,
            timestamp: new Date().toISOString()
        };

        if (window.App?.AppConfig?.debug) {
            console.error(`${context}:`, errorInfo);
        }

        // Show user-friendly error message
        let userMessage = '載入失敗';
        if (error.message.includes('fetch')) {
            userMessage = '網路連線錯誤，請檢查網路狀態';
        } else if (error.message.includes('parse')) {
            userMessage = '資料解析錯誤，請稍後再試';
        } else if (error.message.includes('HTTP')) {
            userMessage = '伺服器回應錯誤，請稍後再試';
        }

        this.showError(userMessage);

        // Fallback: show cached data if available
        const cachedData = this.getCachedData();
        if (cachedData) {
            this.displayCount(cachedData.count, cachedData.timestamp, true);
        }
    }

    /**
     * Cleanup and destroy instance
     */
    destroy() {
        if (this.autoUpdateTimer) {
            clearInterval(this.autoUpdateTimer);
            this.autoUpdateTimer = null;
        }

        const refreshBtn = Utils.DOM.select('#refresh-downloads');
        if (refreshBtn) {
            Utils.DOM.off(refreshBtn, 'click');
        }
    }

    /**
     * Get current stats for external access
     */
    getStats() {
        return {
            currentCount: this.currentCount,
            lastUpdated: this.lastUpdated,
            isLoading: this.isLoading,
            cacheValid: this.lastUpdated ? this.isCacheValid(this.lastUpdated) : false
        };
    }
}

// CSS animations for counter effects
const style = document.createElement('style');
style.textContent = `
    @keyframes counterPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .count-number {
        background: linear-gradient(135deg, #10b981, #059669);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 900;
        text-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
    }
    
    .loading-text {
        color: #6b7280;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.paperDownloads = new PaperDownloads();
    });
} else {
    window.paperDownloads = new PaperDownloads();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaperDownloads;
}