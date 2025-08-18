/**
 * Accessibility Enhancement Module
 *
 * This module provides comprehensive accessibility features including:
 * - Enhanced keyboard navigation
 * - Screen reader improvements
 * - Focus management
 * - ARIA enhancements
 * - Color contrast checking
 * - Motion preference handling
 */

class AccessibilityEnhancer {
    constructor() {
        this.focusableElements = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];

        this.currentFocusIndex = -1;
        this.focusTracker = [];
        this.announcements = [];

        this.init();
    }

    /**
     * Initialize accessibility enhancements
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAccessibilityFeatures();
            });
        } else {
            this.setupAccessibilityFeatures();
        }
    }

    /**
     * Setup all accessibility features
     */
    setupAccessibilityFeatures() {
        this.enhanceKeyboardNavigation();
        this.setupFocusManagement();
        this.enhanceScreenReaderSupport();
        this.setupMotionPreferences();
        this.enhanceARIALabels();
        this.setupSkipLinks();
        this.monitorColorContrast();
        this.setupAnnouncementSystem();
        this.enhanceFormAccessibility();

        console.info('[Accessibility] Enhancement systems initialized');
    }

    /**
     * Enhance keyboard navigation
     */
    enhanceKeyboardNavigation() {
        // Enhanced tab navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Escape':
                    this.handleEscapeKey(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(e);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.handleArrowNavigation(e);
                    break;
                case 'Home':
                case 'End':
                    this.handleHomeEndNavigation(e);
                    break;
            }
        });

        // Add visible focus indicators
        this.enhanceFocusIndicators();
    }

    /**
     * Handle tab navigation
     */
    handleTabNavigation(e) {
        const focusableElements = this.getFocusableElements();
        const currentElement = document.activeElement;
        const currentIndex = Array.from(focusableElements).indexOf(currentElement);

        // Track focus for better management
        this.currentFocusIndex = currentIndex;

        // Handle modal trapping
        const modal = currentElement.closest('[role="dialog"], .modal');
        if (modal) {
            this.trapFocusInModal(e, modal);
        }
    }

    /**
     * Handle escape key
     */
    handleEscapeKey(e) {
        // Close modals, dropdowns, etc.
        const modal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (modal) {
            this.closeModal(modal);
            e.preventDefault();
        }

        // Close mobile menu
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            this.closeMobileMenu();
            e.preventDefault();
        }
    }

    /**
     * Handle enter/space activation
     */
    handleActivation(e) {
        const target = e.target;

        // Enhanced button activation
        if (target.matches('[role="button"]:not(button)')) {
            e.preventDefault();
            target.click();
        }

        // Enhanced link activation
        if (target.matches('a[href^="#"]')) {
            e.preventDefault();
            this.smoothScrollToTarget(target.getAttribute('href'));
        }
    }

    /**
     * Handle arrow navigation
     */
    handleArrowNavigation(e) {
        const target = e.target;

        // Navigation menu arrow support
        if (target.closest('nav')) {
            this.handleMenuArrowNavigation(e);
        }

        // Tab panel navigation
        if (target.closest('[role="tablist"]')) {
            this.handleTabArrowNavigation(e);
        }

        // Slider/carousel navigation
        if (target.closest('[role="slider"], .carousel')) {
            this.handleSliderNavigation(e);
        }
    }

    /**
     * Handle Home/End navigation
     */
    handleHomeEndNavigation(e) {
        const container = e.target.closest('nav, [role="tablist"], [role="menu"]');
        if (!container) {return;}

        const focusableElements = container.querySelectorAll(this.focusableElements.join(', '));

        if (e.key === 'Home' && focusableElements.length > 0) {
            e.preventDefault();
            focusableElements[0].focus();
        } else if (e.key === 'End' && focusableElements.length > 0) {
            e.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
        }
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Track focus changes
        document.addEventListener('focusin', (e) => {
            this.onFocusChange(e.target);
        });

        // Handle focus restoration
        document.addEventListener('focusout', (e) => {
            this.storePreviousFocus(e.target);
        });

        // Skip to main content functionality is already handled in setupSkipLinks
    }

    /**
     * Handle focus changes
     */
    onFocusChange(element) {
        // Announce focus changes to screen readers
        if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
            this.announceToScreenReader(`Focused on ${this.getElementDescription(element)}`);
        }

        // Update navigation state
        if (element.matches('a[href^="#"]')) {
            this.updateNavigationState(element);
        }

        // Scroll element into view if needed
        this.ensureElementVisible(element);
    }

    /**
     * Store previous focus for restoration
     */
    storePreviousFocus(element) {
        if (element && element.id) {
            sessionStorage.setItem('lastFocusedElement', element.id);
        }
    }

    /**
     * Restore previous focus
     */
    restorePreviousFocus() {
        const lastFocusedId = sessionStorage.getItem('lastFocusedElement');
        if (lastFocusedId) {
            const element = document.getElementById(lastFocusedId);
            if (element) {
                element.focus();
                sessionStorage.removeItem('lastFocusedElement');
            }
        }
    }

    /**
     * Enhance screen reader support
     */
    enhanceScreenReaderSupport() {
        // Add live regions for dynamic content
        this.setupLiveRegions();

        // Enhance image descriptions
        this.enhanceImageDescriptions();

        // Add context descriptions
        this.addContextDescriptions();

        // Enhance table accessibility
        this.enhanceTableAccessibility();
    }

    /**
     * Enhance image descriptions
     */
    enhanceImageDescriptions() {
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            const src = img.src || img.dataset.src;
            if (src) {
                const filename = src.split('/').pop().split('.')[0];
                img.alt = this.generateImageDescription(filename, img);
            }
        });
    }

    /**
     * Generate image description based on context
     */
    generateImageDescription(filename, img) {
        const context = img.closest('section, article, div[class*="card"]');
        const heading = context?.querySelector('h1, h2, h3, h4, h5, h6');
        const contextName = heading?.textContent || '';

        // Scientific diagrams
        if (filename.includes('energy') || filename.includes('thermodynamic')) {
            return `${contextName} 相關的科學示意圖`;
        }

        if (filename.includes('experiment') || filename.includes('test')) {
            return `${contextName} 實驗設備圖片`;
        }

        if (filename.includes('chart') || filename.includes('graph')) {
            return `${contextName} 數據圖表`;
        }

        return contextName ? `${contextName} 相關圖片` : '科學研究相關圖片';
    }

    /**
     * Add context descriptions
     */
    addContextDescriptions() {
        // Add descriptions to complex interactive elements
        const interactiveElements = document.querySelectorAll('[data-interactive]');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('aria-describedby')) {
                const description = this.createContextDescription(element);
                if (description) {
                    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
                    const descElement = document.createElement('div');
                    descElement.id = descId;
                    descElement.className = 'sr-only';
                    descElement.textContent = description;
                    element.appendChild(descElement);
                    element.setAttribute('aria-describedby', descId);
                }
            }
        });
    }

    /**
     * Create context description for interactive elements
     */
    createContextDescription(element) {
        if (element.classList.contains('particle-simulator')) {
            return '這是一個互動式粒子模擬器，您可以調整重力和熱振動參數來觀察離子分離效果';
        }

        if (element.classList.contains('chart-container')) {
            return '這是一個互動式圖表，顯示實驗數據和研究結果';
        }

        if (element.classList.contains('slider')) {
            return '使用左右箭頭鍵或滑鼠拖拽來調整數值';
        }

        return null;
    }

    /**
     * Enhance table accessibility
     */
    enhanceTableAccessibility() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            // Add table caption if missing
            if (!table.querySelector('caption')) {
                const heading = table.closest('section')?.querySelector('h1, h2, h3, h4, h5, h6');
                if (heading) {
                    const caption = document.createElement('caption');
                    caption.textContent = `${heading.textContent} 數據表格`;
                    caption.className = 'sr-only';
                    table.insertBefore(caption, table.firstChild);
                }
            }

            // Enhance header associations
            const headers = table.querySelectorAll('th');
            headers.forEach((header, index) => {
                if (!header.id) {
                    header.id = `header-${Math.random().toString(36).substr(2, 9)}`;
                }
            });
        });
    }

    /**
     * Setup live regions for announcements
     */
    setupLiveRegions() {
        // Create announcement regions
        const politeRegion = document.createElement('div');
        politeRegion.id = 'aria-live-polite';
        politeRegion.setAttribute('aria-live', 'polite');
        politeRegion.setAttribute('aria-atomic', 'true');
        politeRegion.className = 'sr-only';
        document.body.appendChild(politeRegion);

        const assertiveRegion = document.createElement('div');
        assertiveRegion.id = 'aria-live-assertive';
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        assertiveRegion.className = 'sr-only';
        document.body.appendChild(assertiveRegion);
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite';
        const region = document.getElementById(regionId);

        if (region) {
            // Clear previous announcement
            region.textContent = '';

            // Add new announcement with slight delay
            setTimeout(() => {
                region.textContent = message;

                // Clear after announcement
                setTimeout(() => {
                    region.textContent = '';
                }, 2000);
            }, 100);
        }

        console.info(`[Accessibility] Announced: ${message}`);
    }

    /**
     * Setup motion preferences
     */
    setupMotionPreferences() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        this.updateMotionSettings(prefersReducedMotion.matches);

        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            this.updateMotionSettings(e.matches);
        });
    }

    /**
     * Update motion settings based on user preference
     */
    updateMotionSettings(reduceMotion) {
        if (reduceMotion) {
            document.documentElement.classList.add('reduce-motion');

            // Disable animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            style.id = 'reduced-motion-styles';
            document.head.appendChild(style);

            console.info('[Accessibility] Reduced motion preferences applied');
        } else {
            document.documentElement.classList.remove('reduce-motion');

            // Remove reduced motion styles
            const existingStyle = document.getElementById('reduced-motion-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
        }
    }

    /**
     * Enhance ARIA labels and descriptions
     */
    enhanceARIALabels() {
        // Enhance buttons without accessible names
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                const icon = button.querySelector('svg, i, img');
                if (icon) {
                    button.setAttribute('aria-label', this.generateButtonLabel(button));
                }
            }
        });

        // Enhance links without accessible names
        const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        links.forEach(link => {
            if (!link.textContent.trim() || link.textContent.trim() === '→') {
                link.setAttribute('aria-label', this.generateLinkLabel(link));
            }
        });

        // Enhance form controls
        this.enhanceFormLabels();
    }

    /**
     * Generate button label based on context
     */
    generateButtonLabel(button) {
        const context = button.closest('section, article, div[class*="card"]');
        const heading = context?.querySelector('h1, h2, h3, h4, h5, h6');
        const contextName = heading?.textContent || '內容';

        if (button.classList.contains('share')) {return `分享 ${contextName}`;}
        if (button.classList.contains('download')) {return `下載 ${contextName}`;}
        if (button.classList.contains('close')) {return `關閉 ${contextName}`;}
        if (button.classList.contains('menu')) {return '開啟選單';}

        return '按鈕';
    }

    /**
     * Generate link label based on context and destination
     */
    generateLinkLabel(link) {
        const href = link.getAttribute('href');
        const context = link.closest('section, article, div[class*="card"]');
        const heading = context?.querySelector('h1, h2, h3, h4, h5, h6');
        const contextName = heading?.textContent || '';

        if (href?.startsWith('#')) {
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const targetHeading = target.querySelector('h1, h2, h3, h4, h5, h6');
                return `前往 ${targetHeading?.textContent || targetId}`;
            }
        }

        if (href?.includes('youtube.com') || href?.includes('youtu.be')) {
            return `觀看影片：${contextName}`;
        }

        if (href?.includes('.pdf') || href?.includes('vixra.org')) {
            return `下載文件：${contextName}`;
        }

        return contextName ? `閱讀更多：${contextName}` : '連結';
    }

    /**
     * Setup skip links
     */
    setupSkipLinks() {
        // Enhance existing skip link
        const skipLink = document.querySelector('a[href="#main-content"]');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('main-content') || document.querySelector('main');
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    /**
     * Monitor color contrast
     */
    monitorColorContrast() {
        // This is a simplified contrast checker
        // In production, you might want to use a more comprehensive solution
        const checkContrast = (element) => {
            const styles = window.getComputedStyle(element);
            const bgColor = styles.backgroundColor;
            const textColor = styles.color;

            // Basic contrast checking (you might want to implement a more robust solution)
            if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
                const contrast = this.calculateContrast(bgColor, textColor);
                if (contrast < 4.5) {
                    console.warn(`[Accessibility] Low contrast detected on element:`, element, `Contrast ratio: ${contrast.toFixed(2)}`);
                }
            }
        };

        // Check contrast on critical elements
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span');
        textElements.forEach(checkContrast);
    }

    /**
     * Calculate color contrast ratio (simplified)
     */
    calculateContrast(color1, color2) {
        // This is a very simplified version
        // For production, use a proper color contrast calculation
        const getLuminance = (color) => {
            // Extract RGB values and calculate relative luminance
            // This is a placeholder implementation
            return 0.5; // Placeholder
        };

        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);

        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);

        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Setup announcement system
     */
    setupAnnouncementSystem() {
        // Announce page load completion
        window.addEventListener('load', () => {
            this.announceToScreenReader('頁面載入完成。重力離子熱電技術網站已準備就緒。');
        });

        // Announce navigation changes
        if (typeof NavigationController !== 'undefined') {
            document.addEventListener('navigationchange', (e) => {
                const sectionName = e.detail.sectionName || '內容區塊';
                this.announceToScreenReader(`已前往 ${sectionName}`);
            });
        }
    }

    /**
     * Enhance form accessibility
     */
    enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add form submission feedback
            form.addEventListener('submit', (e) => {
                this.announceToScreenReader('表單已提交，正在處理中...', 'assertive');
            });

            // Enhance error handling
            this.setupFormErrorHandling(form);
        });
    }

    /**
     * Setup form error handling
     */
    setupFormErrorHandling(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                const label = this.getInputLabel(input);
                this.announceToScreenReader(`${label} 輸入有誤，請檢查`, 'assertive');
            });
        });
    }

    /**
     * Get input label text
     */
    getInputLabel(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {return label.textContent;}

        const ariaLabel = input.getAttribute('aria-label');
        if (ariaLabel) {return ariaLabel;}

        return input.placeholder || '輸入欄位';
    }

    /**
     * Get all focusable elements
     */
    getFocusableElements() {
        return document.querySelectorAll(this.focusableElements.join(', '));
    }

    /**
     * Get element description for announcements
     */
    getElementDescription(element) {
        if (element.hasAttribute('aria-label')) {
            return element.getAttribute('aria-label');
        }

        if (element.hasAttribute('aria-labelledby')) {
            const labelId = element.getAttribute('aria-labelledby');
            const label = document.getElementById(labelId);
            if (label) {return label.textContent;}
        }

        return element.textContent || element.tagName.toLowerCase();
    }

    /**
     * Ensure element is visible in viewport
     */
    ensureElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );

        if (!isVisible) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }

    /**
     * Enhance focus indicators
     */
    enhanceFocusIndicators() {
        // Add enhanced focus styles
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #FFD700 !important;
                outline-offset: 2px !important;
                border-radius: 4px !important;
            }
            
            .nav-link:focus {
                background: rgba(255, 215, 0, 0.1) !important;
            }
            
            button:focus, 
            [role="button"]:focus {
                box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize accessibility enhancer
if (typeof window !== 'undefined') {
    window.AccessibilityEnhancer = new AccessibilityEnhancer();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityEnhancer;
}