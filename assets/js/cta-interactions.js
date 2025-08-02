/**
 * CTA Interactions - Handle Call to Action button interactions and tracking
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

class CTAInteractions {
    constructor() {
        this.trackingEnabled = true;
        this.interactions = new Map();
        this.init();
    }

    /**
     * Initialize CTA interactions
     */
    init() {
        this.setupVideoButtons();
        this.setupPaperDownload();
        this.setupSecondaryActions();
        this.setupAnalytics();

        console.info('CTA Interactions initialized');
    }

    /**
     * Setup video button interactions
     */
    setupVideoButtons() {
        const videoButtons = document.querySelectorAll('.video-btn');

        videoButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                this.handleVideoClick(e, index);
            });

            // Add hover effects
            button.addEventListener('mouseenter', () => {
                this.addHoverEffect(button);
            });

            button.addEventListener('mouseleave', () => {
                this.removeHoverEffect(button);
            });
        });
    }

    /**
     * Handle video button clicks
     */
    handleVideoClick(event, index) {
        const button = event.currentTarget;
        const videoUrl = button.href;
        const videoType = this.getVideoType(index);

        // Add click animation
        this.addClickAnimation(button);

        // Track interaction
        this.trackInteraction('video_click', {
            type: videoType,
            url: videoUrl,
            timestamp: Date.now()
        });

        // Show loading state briefly
        this.showLoadingState(button, 500);

        console.info(`Video clicked: ${videoType}`, { url: videoUrl });
    }

    /**
     * Get video type based on index
     */
    getVideoType(index) {
        const types = ['chinese_explanation', 'english_explanation', 'detailed_mechanism'];
        return types[index] || 'unknown';
    }

    /**
     * Setup paper download interactions
     */
    setupPaperDownload() {
        const paperButton = document.querySelector('.paper-btn');

        if (paperButton) {
            paperButton.addEventListener('click', (e) => {
                this.handlePaperDownload(e);
            });
        }
    }

    /**
     * Handle paper download clicks
     */
    handlePaperDownload(event) {
        const button = event.currentTarget;
        const paperUrl = button.href;

        // Add click animation
        this.addClickAnimation(button);

        // Update download counter
        this.updateDownloadCounter();

        // Track interaction
        this.trackInteraction('paper_download', {
            url: paperUrl,
            timestamp: Date.now()
        });

        // Show success message
        this.showSuccessMessage(button, '論文下載已開始');

        console.info('Paper download initiated', { url: paperUrl });
    }

    /**
     * Update download counter
     */
    updateDownloadCounter() {
        const downloadCounter = document.getElementById('download-counter');
        if (downloadCounter) {
            const currentCount = parseInt(downloadCounter.textContent.replace(/,/g, '')) || 0;
            const newCount = currentCount + 1;
            downloadCounter.textContent = newCount.toLocaleString();

            // Animate counter update
            downloadCounter.style.animation = 'none';
            downloadCounter.offsetHeight; // Trigger reflow
            downloadCounter.style.animation = 'counterUp 0.5s ease-out';
        }
    }

    /**
     * Setup secondary action buttons
     */
    setupSecondaryActions() {
        const academicBtn = document.querySelector('.academic-cta button');
        const businessBtn = document.querySelector('.business-cta button');
        const mediaBtn = document.querySelector('.media-cta button');

        if (academicBtn) {
            academicBtn.addEventListener('click', () => {
                this.handleSecondaryAction('academic', academicBtn);
            });
        }

        if (businessBtn) {
            businessBtn.addEventListener('click', () => {
                this.handleSecondaryAction('business', businessBtn);
            });
        }

        if (mediaBtn) {
            mediaBtn.addEventListener('click', () => {
                this.handleSecondaryAction('media', mediaBtn);
            });
        }
    }

    /**
     * Handle secondary action clicks
     */
    handleSecondaryAction(actionType, button) {
        // Add click animation
        this.addClickAnimation(button);

        // Track interaction
        this.trackInteraction('secondary_action', {
            type: actionType,
            timestamp: Date.now()
        });

        // Show contact form or redirect
        this.showContactForm(actionType);

        console.info(`Secondary action clicked: ${actionType}`);
    }

    /**
     * Show contact form modal
     */
    showContactForm(actionType) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">${this.getActionTitle(actionType)}</h3>
                    <p class="text-gray-600">請留下您的聯絡資訊，我們將盡快與您聯繫</p>
                </div>
                
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                        <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">訊息</label>
                        <textarea rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="請描述您的需求..."></textarea>
                    </div>
                    <div class="flex space-x-4">
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            發送
                        </button>
                        <button type="button" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors" onclick="this.closest('.fixed').remove()">
                            取消
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form, actionType);
            modal.remove();
        });
    }

    /**
     * Get action title for modal
     */
    getActionTitle(actionType) {
        const titles = {
            academic: '學術合作申請',
            business: '商業合作諮詢',
            media: '媒體採訪申請'
        };
        return titles[actionType] || '聯絡我們';
    }

    /**
     * Handle form submission
     */
    handleFormSubmission(_form, actionType) {
        // Track form submission
        this.trackInteraction('form_submission', {
            type: actionType,
            timestamp: Date.now()
        });

        // Show success message
        this.showGlobalSuccessMessage('您的訊息已送出，我們將盡快與您聯繫');

        console.info(`Form submitted for ${actionType}`);
    }

    /**
     * Add click animation to button
     */
    addClickAnimation(button) {
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';

        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    /**
     * Add hover effect
     */
    addHoverEffect(button) {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    }

    /**
     * Remove hover effect
     */
    removeHoverEffect(button) {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '';
    }

    /**
     * Show loading state
     */
    showLoadingState(button, duration = 1000) {
        button.classList.add('loading');
        button.style.pointerEvents = 'none';

        setTimeout(() => {
            button.classList.remove('loading');
            button.style.pointerEvents = 'auto';
        }, duration);
    }

    /**
     * Show success message
     */
    showSuccessMessage(button, message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'absolute top-full left-0 right-0 bg-green-500 text-white text-sm py-2 px-4 rounded-b-lg feedback-success';
        messageEl.textContent = message;

        button.parentElement.style.position = 'relative';
        button.parentElement.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    /**
     * Show global success message
     */
    showGlobalSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg z-50 feedback-success';
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    /**
     * Setup analytics
     */
    setupAnalytics() {
        // Track page view
        this.trackInteraction('cta_section_view', {
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        });
    }

    /**
     * Track user interactions
     */
    trackInteraction(eventType, data) {
        if (!this.trackingEnabled) {return;}

        const interaction = {
            type: eventType,
            data: data,
            sessionId: this.getSessionId(),
            timestamp: Date.now()
        };

        this.interactions.set(`${eventType}_${Date.now()}`, interaction);

        // Store in localStorage for persistent tracking
        this.storeInteraction(interaction);

        console.info('Interaction tracked:', interaction);
    }

    /**
     * Get or create session ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('cta_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('cta_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Store interaction in localStorage
     */
    storeInteraction(interaction) {
        try {
            const stored = JSON.parse(localStorage.getItem('cta_interactions') || '[]');
            stored.push(interaction);

            // Keep only last 100 interactions
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }

            localStorage.setItem('cta_interactions', JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store interaction:', error);
        }
    }

    /**
     * Get interaction statistics
     */
    getInteractionStats() {
        const stats = {
            totalInteractions: this.interactions.size,
            videoClicks: 0,
            paperDownloads: 0,
            socialShares: 0,
            formSubmissions: 0
        };

        this.interactions.forEach(interaction => {
            switch (interaction.type) {
                case 'video_click':
                    stats.videoClicks++;
                    break;
                case 'paper_download':
                    stats.paperDownloads++;
                    break;
                case 'social_share':
                    stats.socialShares++;
                    break;
                case 'form_submission':
                    stats.formSubmissions++;
                    break;
            }
        });

        return stats;
    }
}

// Initialize CTA Interactions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ctaInteractions = new CTAInteractions();
    });
} else {
    window.ctaInteractions = new CTAInteractions();
}