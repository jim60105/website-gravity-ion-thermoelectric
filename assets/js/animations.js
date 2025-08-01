/**
 * Animation system for Gravity Ion Thermoelectric Website
 * Handles particle animations, scroll effects, and visual interactions
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

/**
 * Particle System for Ion Visualization
 */
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? Utils.DOM.select(container) : container;

        this.options = {
            particleCount: Utils.Device.isMobile() ? 50 : 100,
            ionTypes: ['positive', 'negative', 'plasma'],
            animationSpeed: 1,
            enabled: !Utils.Device.prefersReducedMotion(),
            ...options
        };

        this.particles = [];
        this.animationId = null;
        this.isRunning = false;

        if (this.container && this.options.enabled) {
            this.init();
        }
    }

    /**
     * Initialize particle system
     */
    init() {
        this.setupContainer();
        this.createParticles();
        this.start();
    }

    /**
     * Setup container for particles
     */
    setupContainer() {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
    }

    /**
     * Create individual particles
     */
    createParticles() {
        const containerRect = this.container.getBoundingClientRect();

        for (let i = 0; i < this.options.particleCount; i++) {
            const particle = this.createParticle(containerRect);
            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }

    /**
     * Create a single particle
     * @param {DOMRect} containerRect - Container dimensions
     * @returns {Object} Particle object
     */
    createParticle(containerRect) {
        const ionType =
            this.options.ionTypes[Utils.MathUtils.randomInt(0, this.options.ionTypes.length - 1)];

        const size = Utils.MathUtils.random(2, 8);
        const x = Utils.MathUtils.random(0, containerRect.width);
        const y = Utils.MathUtils.random(0, containerRect.height);
        const vx = Utils.MathUtils.random(-0.5, 0.5) * this.options.animationSpeed;
        const vy = Utils.MathUtils.random(-0.5, 0.5) * this.options.animationSpeed;
        const opacity = Utils.MathUtils.random(0.3, 0.8);

        const element = Utils.DOM.createElement('div', {
            className: `particle ion-${ionType}`,
            style: `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                opacity: ${opacity};
                animation-delay: ${Utils.MathUtils.random(0, 8)}s;
            `
        });

        return {
            element,
            x,
            y,
            vx,
            vy,
            size,
            opacity,
            ionType,
            life: Utils.MathUtils.random(5, 15)
        };
    }

    /**
     * Start particle animation
     */
    start() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.animate();
    }

    /**
     * Stop particle animation
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isRunning) {
            return;
        }

        this.updateParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Update particle positions and properties
     */
    updateParticles() {
        const containerRect = this.container.getBoundingClientRect();

        this.particles.forEach((particle, _index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary collision
            if (particle.x <= 0 || particle.x >= containerRect.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= containerRect.height) {
                particle.vy *= -1;
            }

            // Keep particles in bounds
            particle.x = Utils.MathUtils.clamp(particle.x, 0, containerRect.width);
            particle.y = Utils.MathUtils.clamp(particle.y, 0, containerRect.height);

            // Update DOM element
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;

            // Update life
            particle.life -= 0.01;
            if (particle.life <= 0) {
                this.resetParticle(particle, containerRect);
            }
        });
    }

    /**
     * Reset particle to initial state
     * @param {Object} particle - Particle to reset
     * @param {DOMRect} containerRect - Container dimensions
     */
    resetParticle(particle, containerRect) {
        particle.x = Utils.MathUtils.random(0, containerRect.width);
        particle.y = Utils.MathUtils.random(0, containerRect.height);
        particle.life = Utils.MathUtils.random(5, 15);
        particle.opacity = Utils.MathUtils.random(0.3, 0.8);
        particle.element.style.opacity = particle.opacity;
    }

    /**
     * Destroy particle system
     */
    destroy() {
        this.stop();
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
    }
}

/**
 * Scroll Animation Manager
 */
class ScrollAnimations {
    constructor() {
        this.observedElements = new Map();
        this.observer = null;
        this.enabled = !Utils.Device.prefersReducedMotion();

        if (this.enabled) {
            this.init();
        }
    }

    /**
     * Initialize scroll animations
     */
    init() {
        this.setupIntersectionObserver();
        this.observeElements();
        this.setupScrollEffects();
    }

    /**
     * Setup Intersection Observer for scroll animations
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };

        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const element = entry.target;
                const elementData = this.observedElements.get(element);

                if (entry.isIntersecting) {
                    this.triggerAnimation(element, elementData);
                } else if (elementData && elementData.repeat) {
                    this.resetAnimation(element, elementData);
                }
            });
        }, options);
    }

    /**
     * Observe elements for scroll animations
     */
    observeElements() {
        // Add fade-in animations to sections
        const sections = Utils.DOM.selectAll('section');
        sections.forEach((section, index) => {
            const animationType = index % 2 === 0 ? 'fade-in-up' : 'fade-in-left';
            this.addScrollAnimation(section, animationType, { delay: index * 100 });
        });

        // Add animations to articles
        const articles = Utils.DOM.selectAll('article');
        articles.forEach((article, index) => {
            this.addScrollAnimation(article, 'fade-in-up', { delay: index * 150 });
        });

        // Add animations to images
        const images = Utils.DOM.selectAll('img');
        images.forEach((img, index) => {
            this.addScrollAnimation(img, 'fade-in-right', { delay: index * 100 });
        });
    }

    /**
     * Add scroll animation to element
     * @param {Element} element - Target element
     * @param {string} animation - Animation type
     * @param {Object} options - Animation options
     */
    addScrollAnimation(element, animation, options = {}) {
        const animationData = {
            type: animation,
            delay: options.delay || 0,
            duration: options.duration || 600,
            repeat: options.repeat || false,
            triggered: false
        };

        Utils.DOM.addClass(element, animation);
        this.observedElements.set(element, animationData);

        if (this.observer) {
            this.observer.observe(element);
        }
    }

    /**
     * Trigger animation on element
     * @param {Element} element - Target element
     * @param {Object} animationData - Animation configuration
     */
    triggerAnimation(element, animationData) {
        if (animationData.triggered && !animationData.repeat) {
            return;
        }

        setTimeout(() => {
            Utils.DOM.addClass(element, 'active');
            animationData.triggered = true;
        }, animationData.delay);
    }

    /**
     * Reset animation on element
     * @param {Element} element - Target element
     * @param {Object} animationData - Animation configuration
     */
    resetAnimation(element, animationData) {
        Utils.DOM.removeClass(element, 'active');
        animationData.triggered = false;
    }

    /**
     * Setup additional scroll effects
     */
    setupScrollEffects() {
        // Parallax effect for hero section
        this.setupParallaxEffect();

        // Header transparency on scroll
        this.setupHeaderScroll();

        // Smooth scroll for navigation links
        this.setupSmoothScroll();
    }

    /**
     * Setup parallax effect
     */
    setupParallaxEffect() {
        const heroSection = Utils.DOM.select('section');
        if (!heroSection) {
            return;
        }

        const handleScroll = Utils.Performance.throttle(() => {
            const scrolled = Utils.Scroll.getPosition().y;
            const rate = scrolled * -0.5;

            if (heroSection) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    /**
     * Setup header scroll effect
     */
    setupHeaderScroll() {
        const header = Utils.DOM.select('header');
        if (!header) {
            return;
        }

        const handleScroll = Utils.Performance.throttle(() => {
            const scrolled = Utils.Scroll.getPosition().y;
            const opacity = Math.max(0.8, 1 - scrolled / 200);

            header.style.backgroundColor = `rgba(11, 11, 47, ${opacity})`;
            header.style.backdropFilter = scrolled > 50 ? 'blur(10px)' : 'none';
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    /**
     * Setup smooth scroll for navigation
     */
    setupSmoothScroll() {
        const navLinks = Utils.DOM.selectAll('nav a[href^="#"]');

        navLinks.forEach(link => {
            Utils.DOM.on(link, 'click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = Utils.DOM.select(targetId);

                if (targetElement) {
                    Utils.Scroll.to(targetElement, {
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Destroy scroll animations
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.observedElements.clear();
    }
}

/**
 * Button and Interactive Animations
 */
class InteractiveAnimations {
    constructor() {
        this.init();
    }

    /**
     * Initialize interactive animations
     */
    init() {
        this.setupButtonAnimations();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupFormAnimations();
    }

    /**
     * Setup button animations
     */
    setupButtonAnimations() {
        const buttons = Utils.DOM.selectAll('button, .btn');

        buttons.forEach(button => {
            // Add ripple effect on click
            Utils.DOM.on(button, 'click', e => {
                this.createRippleEffect(e, button);
            });

            // Add scale effect on hover
            Utils.DOM.on(button, 'mouseenter', () => {
                if (!Utils.Device.prefersReducedMotion()) {
                    button.style.transform = 'scale(1.05)';
                    button.style.transition = 'transform 0.2s ease';
                }
            });

            Utils.DOM.on(button, 'mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Create ripple effect on button click
     * @param {Event} e - Click event
     * @param {Element} button - Button element
     */
    createRippleEffect(e, button) {
        if (Utils.Device.prefersReducedMotion()) {
            return;
        }

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = Utils.DOM.createElement('span', {
            className: 'ripple',
            style: `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `
        });

        // Add ripple animation CSS if not exists
        if (!Utils.DOM.select('#ripple-style')) {
            const style = Utils.DOM.createElement(
                'style',
                { id: 'ripple-style' },
                `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `
            );
            document.head.appendChild(style);
        }

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Setup hover effects for interactive elements
     */
    setupHoverEffects() {
        const interactiveElements = Utils.DOM.selectAll('a, .interactive');

        interactiveElements.forEach(element => {
            Utils.DOM.on(element, 'mouseenter', () => {
                if (!Utils.Device.prefersReducedMotion()) {
                    element.style.transition = 'all 0.3s ease';
                    element.style.filter = 'brightness(1.1)';
                }
            });

            Utils.DOM.on(element, 'mouseleave', () => {
                element.style.filter = 'brightness(1)';
            });
        });
    }

    /**
     * Setup click effects
     */
    setupClickEffects() {
        const clickableElements = Utils.DOM.selectAll('[data-click-effect]');

        clickableElements.forEach(element => {
            Utils.DOM.on(element, 'click', () => {
                const effect = element.dataset.clickEffect;
                this.applyClickEffect(element, effect);
            });
        });
    }

    /**
     * Apply click effect to element
     * @param {Element} element - Target element
     * @param {string} effect - Effect type
     */
    applyClickEffect(element, effect) {
        if (Utils.Device.prefersReducedMotion()) {
            return;
        }

        switch (effect) {
            case 'pulse':
                element.style.animation = 'pulse 0.5s ease-in-out';
                break;
            case 'shake':
                element.style.animation = 'shake 0.5s ease-in-out';
                break;
            case 'bounce':
                element.style.animation = 'bounce 0.5s ease-in-out';
                break;
        }

        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    /**
     * Setup form animations
     */
    setupFormAnimations() {
        const inputs = Utils.DOM.selectAll('input, textarea, select');

        inputs.forEach(input => {
            Utils.DOM.on(input, 'focus', () => {
                if (!Utils.Device.prefersReducedMotion()) {
                    input.style.transform = 'scale(1.02)';
                    input.style.transition = 'transform 0.2s ease';
                }
            });

            Utils.DOM.on(input, 'blur', () => {
                input.style.transform = 'scale(1)';
            });
        });
    }
}

/**
 * Loading Animations
 */
class LoadingAnimations {
    constructor() {
        this.loaders = new Map();
    }

    /**
     * Show loading animation
     * @param {Element|string} target - Target element
     * @param {Object} options - Loading options
     */
    show(target, options = {}) {
        const element = typeof target === 'string' ? Utils.DOM.select(target) : target;
        if (!element) {
            return;
        }

        const config = {
            type: 'spinner',
            message: 'Loading...',
            overlay: true,
            ...options
        };

        const loader = this.createLoader(config);

        if (config.overlay) {
            element.style.position = 'relative';
            element.appendChild(loader);
        } else {
            element.innerHTML = '';
            element.appendChild(loader);
        }

        this.loaders.set(element, loader);
    }

    /**
     * Hide loading animation
     * @param {Element|string} target - Target element
     */
    hide(target) {
        const element = typeof target === 'string' ? Utils.DOM.select(target) : target;
        if (!element) {
            return;
        }

        const loader = this.loaders.get(element);
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
            this.loaders.delete(element);
        }
    }

    /**
     * Create loader element
     * @param {Object} config - Loader configuration
     * @returns {Element}
     */
    createLoader(config) {
        const overlay = Utils.DOM.createElement('div', {
            className: 'loading-overlay',
            style: `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                z-index: 1000;
            `
        });

        const spinner = Utils.DOM.createElement('div', {
            className: 'loading-spinner'
        });

        const message = Utils.DOM.createElement(
            'div',
            {
                style: 'color: white; margin-top: 16px; font-size: 14px;'
            },
            config.message
        );

        overlay.appendChild(spinner);
        overlay.appendChild(message);

        return overlay;
    }
}

// Initialize animation systems when DOM is ready
const AnimationManager = {
    particleSystem: null,
    scrollAnimations: null,
    interactiveAnimations: null,
    loadingAnimations: null,

    /**
     * Initialize all animation systems
     */
    init() {
        // Initialize particle system for hero section
        const particleContainer = Utils.DOM.select('#particle-container');
        if (particleContainer) {
            this.particleSystem = new ParticleSystem(particleContainer);
        }

        // Initialize scroll animations
        this.scrollAnimations = new ScrollAnimations();

        // Initialize interactive animations
        this.interactiveAnimations = new InteractiveAnimations();

        // Initialize loading animations
        this.loadingAnimations = new LoadingAnimations();

        console.info('Animation systems initialized');
    },

    /**
     * Destroy all animation systems
     */
    destroy() {
        if (this.particleSystem) {
            this.particleSystem.destroy();
        }
        if (this.scrollAnimations) {
            this.scrollAnimations.destroy();
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        ScrollAnimations,
        InteractiveAnimations,
        LoadingAnimations,
        AnimationManager
    };
}

// Make available globally
window.Animations = {
    ParticleSystem,
    ScrollAnimations,
    InteractiveAnimations,
    LoadingAnimations,
    AnimationManager
};
