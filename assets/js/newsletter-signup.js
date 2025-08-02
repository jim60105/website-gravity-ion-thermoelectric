/**
 * Newsletter Signup - Handle newsletter subscription functionality
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

class NewsletterSignup {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.emailInput = document.getElementById('newsletter-email');
        this.privacyCheckbox = document.getElementById('privacy-agreement');
        this.feedbackElement = document.getElementById('newsletter-feedback');
        this.subscribers = this.getStoredSubscribers();
        this.init();
    }

    /**
     * Initialize newsletter signup
     */
    init() {
        if (!this.form) {
            console.warn('Newsletter form not found');
            return;
        }

        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupRealTimeValidation();
        this.addFormAnimations();

        console.info('Newsletter signup initialized');
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        // Email validation
        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });

        this.emailInput.addEventListener('blur', () => {
            this.validateEmail(true);
        });

        // Privacy checkbox validation
        this.privacyCheckbox.addEventListener('change', () => {
            this.validatePrivacyAgreement();
        });
    }

    /**
     * Setup form submission
     */
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    /**
     * Setup real-time validation
     */
    setupRealTimeValidation() {
        let validationTimeout;

        this.emailInput.addEventListener('input', () => {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => {
                this.validateForm();
            }, 500);
        });
    }

    /**
     * Add form animations
     */
    addFormAnimations() {
        // Add focus animations
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        // Add hover effects to submit button
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('mouseenter', () => {
                submitButton.style.transform = 'translateY(-2px)';
            });

            submitButton.addEventListener('mouseleave', () => {
                submitButton.style.transform = 'translateY(0)';
            });
        }
    }

    /**
     * Validate email address
     */
    validateEmail(showError = false) {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        // Remove existing validation classes
        this.emailInput.classList.remove('border-red-500', 'border-green-500');

        if (email === '') {
            return true; // Empty is valid (not required to show error immediately)
        }

        if (isValid) {
            this.emailInput.classList.add('border-green-500');
            this.clearFieldError(this.emailInput);

            // Check if email is already subscribed
            if (this.isEmailAlreadySubscribed(email)) {
                this.showFieldError(this.emailInput, '此電子郵件已訂閱');
                return false;
            }

            return true;
        } else if (showError || email.length > 0) {
            this.emailInput.classList.add('border-red-500');
            this.showFieldError(this.emailInput, '請輸入有效的電子郵件地址');
            return false;
        }

        return false;
    }

    /**
     * Validate privacy agreement
     */
    validatePrivacyAgreement() {
        const isChecked = this.privacyCheckbox.checked;

        if (isChecked) {
            this.clearFieldError(this.privacyCheckbox);
            return true;
        } else {
            this.showFieldError(this.privacyCheckbox, '請同意隱私政策');
            return false;
        }
    }

    /**
     * Check if email is already subscribed
     */
    isEmailAlreadySubscribed(email) {
        return this.subscribers.some(subscriber =>
            subscriber.email.toLowerCase() === email.toLowerCase()
        );
    }

    /**
     * Validate entire form
     */
    validateForm() {
        const isEmailValid = this.validateEmail(true);
        const isPrivacyValid = this.validatePrivacyAgreement();

        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            if (isEmailValid && isPrivacyValid) {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                submitButton.disabled = true;
                submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        return isEmailValid && isPrivacyValid;
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission() {
        // Validate form one more time
        if (!this.validateForm()) {
            this.showError('請檢查表單資料');
            return;
        }

        const email = this.emailInput.value.trim();
        const submitButton = this.form.querySelector('button[type="submit"]');

        try {
            // Show loading state
            this.showLoadingState(submitButton);

            // Simulate API call
            await this.submitToServer(email);

            // Add to local storage
            this.addSubscriber(email);

            // Show success message
            this.showSuccess('訂閱成功！感謝您的關注');

            // Reset form
            this.resetForm();

            // Track subscription
            this.trackSubscription(email);

        } catch (error) {
            console.error('Newsletter subscription failed:', error);
            this.showError('訂閱失敗，請稍後再試');
        } finally {
            this.hideLoadingState(submitButton);
        }
    }

    /**
     * Simulate server submission
     */
    async submitToServer(email) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate occasional failures for testing
        if (Math.random() < 0.1) {
            throw new Error('Network error');
        }

        console.info('Email submitted to server:', email);
    }

    /**
     * Add subscriber to local storage
     */
    addSubscriber(email) {
        const subscriber = {
            email: email,
            subscribedAt: new Date().toISOString(),
            source: 'cta_section',
            status: 'active'
        };

        this.subscribers.push(subscriber);
        this.storeSubscribers();

        console.info('Subscriber added:', subscriber);
    }

    /**
     * Show loading state
     */
    showLoadingState(button) {
        this.originalButtonContent = button.innerHTML;
        button.innerHTML = `
            <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            處理中...
        `;
        button.disabled = true;
        button.classList.add('opacity-75');
    }

    /**
     * Hide loading state
     */
    hideLoadingState(button) {
        if (this.originalButtonContent) {
            button.innerHTML = this.originalButtonContent;
        }
        button.disabled = false;
        button.classList.remove('opacity-75');
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = 'mt-4 text-sm text-center text-green-400 feedback-success';
        this.feedbackElement.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.feedbackElement.classList.add('hidden');
        }, 5000);
    }

    /**
     * Show error message
     */
    showError(message) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = 'mt-4 text-sm text-center text-red-400 feedback-error';
        this.feedbackElement.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.feedbackElement.classList.add('hidden');
        }, 5000);
    }

    /**
     * Show field-specific error
     */
    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error text-red-400 text-xs mt-1';
        errorElement.textContent = message;

        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    /**
     * Clear field-specific error
     */
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    /**
     * Reset form
     */
    resetForm() {
        this.form.reset();
        this.emailInput.classList.remove('border-red-500', 'border-green-500');
        this.clearFieldError(this.emailInput);
        this.clearFieldError(this.privacyCheckbox);
        this.feedbackElement.classList.add('hidden');
    }

    /**
     * Track subscription
     */
    trackSubscription(email) {
        if (window.ctaInteractions) {
            window.ctaInteractions.trackInteraction('newsletter_subscription', {
                email: email,
                source: 'cta_section',
                timestamp: Date.now()
            });
        }
    }

    /**
     * Get stored subscribers
     */
    getStoredSubscribers() {
        try {
            const stored = localStorage.getItem('newsletter_subscribers');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Failed to get stored subscribers:', error);
            return [];
        }
    }

    /**
     * Store subscribers
     */
    storeSubscribers() {
        try {
            localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
        } catch (error) {
            console.warn('Failed to store subscribers:', error);
        }
    }

    /**
     * Get subscription statistics
     */
    getSubscriptionStats() {
        return {
            totalSubscribers: this.subscribers.length,
            activeSubscribers: this.subscribers.filter(s => s.status === 'active').length,
            recentSubscribers: this.subscribers.filter(s => {
                const subscribeDate = new Date(s.subscribedAt);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return subscribeDate > weekAgo;
            }).length,
            sources: this.getSubscriptionSources()
        };
    }

    /**
     * Get subscription sources breakdown
     */
    getSubscriptionSources() {
        const sources = {};
        this.subscribers.forEach(subscriber => {
            const source = subscriber.source || 'unknown';
            sources[source] = (sources[source] || 0) + 1;
        });
        return sources;
    }

    /**
     * Export subscribers (for admin use)
     */
    exportSubscribers() {
        const csv = this.convertToCSV(this.subscribers);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    }

    /**
     * Convert subscribers to CSV format
     */
    convertToCSV(subscribers) {
        const headers = ['Email', 'Subscribed At', 'Source', 'Status'];
        const rows = subscribers.map(sub => [
            sub.email,
            sub.subscribedAt,
            sub.source,
            sub.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return csvContent;
    }

    /**
     * Unsubscribe email (for testing/admin)
     */
    unsubscribe(email) {
        const index = this.subscribers.findIndex(s =>
            s.email.toLowerCase() === email.toLowerCase()
        );

        if (index !== -1) {
            this.subscribers[index].status = 'unsubscribed';
            this.storeSubscribers();
            console.info('Email unsubscribed:', email);
            return true;
        }

        return false;
    }

    /**
     * Clear all subscribers (for testing)
     */
    clearAllSubscribers() {
        this.subscribers = [];
        this.storeSubscribers();
        console.info('All subscribers cleared');
    }
}

// Initialize Newsletter Signup when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.newsletterSignup = new NewsletterSignup();
    });
} else {
    window.newsletterSignup = new NewsletterSignup();
}