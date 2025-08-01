/**
 * Animation system for Gravity Ion Thermoelectric Website
 * Handles particle animations, scroll effects, and visual interactions
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

/**
 * Enhanced Canvas-based Particle System for Ion Visualization
 */
class CanvasParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = typeof canvas === 'string' ? Utils.DOM.select(canvas) : canvas;
        if (!this.canvas) {
            console.warn('Canvas element not found for particle system');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.options = {
            particleCount: Utils.Device.isMobile() ? 100 : 200,
            lightIonColor: '#FFD700', // Yellow for light ions
            heavyIonColor: '#00BFFF', // Blue for heavy ions
            plasmaColor: '#8A2BE2', // Purple for plasma
            animationSpeed: 1,
            gravityStrength: 0.02,
            mouseInteraction: true,
            enabled: !Utils.Device.prefersReducedMotion(),
            ...options
        };

        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.animationId = null;
        this.isRunning = false;

        if (this.options.enabled) {
            this.init();
        }
    }

    /**
     * Initialize canvas particle system
     */
    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.start();
    }

    /**
     * Setup canvas dimensions and properties
     */
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', Utils.Performance.debounce(() => {
            this.resizeCanvas();
        }, 250));
    }

    /**
     * Resize canvas to fill container
     */
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    /**
     * Create particles with physics properties
     */
    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.options.particleCount; i++) {
            const particle = this.createParticle();
            this.particles.push(particle);
        }
    }

    /**
     * Create individual particle with random properties
     */
    createParticle() {
        const types = ['light', 'heavy', 'plasma'];
        const type = types[Utils.MathUtils.randomInt(0, types.length - 1)];

        let color, size, mass;
        switch (type) {
            case 'light':
                color = this.options.lightIonColor;
                size = Utils.MathUtils.random(2, 4);
                mass = 1;
                break;
            case 'heavy':
                color = this.options.heavyIonColor;
                size = Utils.MathUtils.random(4, 7);
                mass = 2;
                break;
            case 'plasma':
                color = this.options.plasmaColor;
                size = Utils.MathUtils.random(3, 6);
                mass = 1.5;
                break;
        }

        return {
            x: Utils.MathUtils.random(0, this.canvas.width),
            y: Utils.MathUtils.random(0, this.canvas.height),
            vx: Utils.MathUtils.random(-0.5, 0.5) * this.options.animationSpeed,
            vy: Utils.MathUtils.random(-0.5, 0.5) * this.options.animationSpeed,
            size,
            mass,
            color,
            type,
            opacity: Utils.MathUtils.random(0.3, 0.8),
            life: Utils.MathUtils.random(5, 15),
            maxLife: Utils.MathUtils.random(5, 15)
        };
    }

    /**
     * Setup mouse interaction listeners
     */
    setupEventListeners() {
        if (!this.options.mouseInteraction) {return;}

        const updateMouse = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        };

        this.canvas.addEventListener('mousemove', updateMouse);
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = touch.clientX - rect.left;
                this.mouse.y = touch.clientY - rect.top;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    /**
     * Start animation loop
     */
    start() {
        if (this.isRunning) {return;}
        this.isRunning = true;
        this.animate();
    }

    /**
     * Stop animation
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) {return;}

        this.updateParticles();
        this.drawParticles();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Update particle physics
     */
    updateParticles() {
        this.particles.forEach((particle, _index) => {
            // Apply gravity (heavier particles fall faster)
            particle.vy += this.options.gravityStrength * particle.mass;

            // Mouse interaction (attraction/repulsion)
            if (this.options.mouseInteraction) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);

                    // Light particles are attracted, heavy particles repelled
                    const direction = particle.type === 'light' ? 1 : -1;
                    particle.vx += Math.cos(angle) * force * 0.1 * direction;
                    particle.vy += Math.sin(angle) * force * 0.1 * direction;
                }
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary conditions with energy conservation
            if (particle.x <= particle.size || particle.x >= this.canvas.width - particle.size) {
                particle.vx *= -0.8; // Energy loss on collision
                particle.x = Utils.MathUtils.clamp(particle.x, particle.size, this.canvas.width - particle.size);
            }

            if (particle.y <= particle.size || particle.y >= this.canvas.height - particle.size) {
                particle.vy *= -0.8; // Energy loss on collision
                particle.y = Utils.MathUtils.clamp(particle.y, particle.size, this.canvas.height - particle.size);
            }

            // Apply friction
            particle.vx *= 0.999;
            particle.vy *= 0.999;

            // Update life and opacity
            particle.life -= 0.01;
            particle.opacity = Math.max(0.1, particle.life / particle.maxLife * 0.8);

            // Reset particle if life expired
            if (particle.life <= 0) {
                this.resetParticle(particle);
            }
        });
    }

    /**
     * Reset particle to initial state
     */
    resetParticle(particle) {
        particle.x = Utils.MathUtils.random(0, this.canvas.width);
        particle.y = Utils.MathUtils.random(0, this.canvas.height);
        particle.vx = Utils.MathUtils.random(-0.5, 0.5) * this.options.animationSpeed;
        particle.vy = Utils.MathUtils.random(-0.5, 0.5) * this.options.animationSpeed;
        particle.life = particle.maxLife;
        particle.opacity = Utils.MathUtils.random(0.3, 0.8);
    }

    /**
     * Draw particles on canvas
     */
    drawParticles() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.ctx.save();

            // Set particle style
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = particle.size * 2;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Add glow effect
            this.ctx.globalAlpha = particle.opacity * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });

        // Draw connections between nearby particles
        this.drawConnections();
    }

    /**
     * Draw connections between nearby particles
     */
    drawConnections() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    this.ctx.globalAlpha = (80 - distance) / 80 * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.restore();
    }

    /**
     * Destroy particle system
     */
    destroy() {
        this.stop();
        this.particles = [];
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
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
    canvasParticleSystem: null,
    scrollAnimations: null,
    interactiveAnimations: null,
    loadingAnimations: null,

    /**
     * Initialize all animation systems
     */
    init() {
        // Initialize canvas particle system for hero section
        const particlesCanvas = Utils.DOM.select('#particles-canvas');
        if (particlesCanvas) {
            this.canvasParticleSystem = new CanvasParticleSystem(particlesCanvas, {
                particleCount: Utils.Device.isMobile() ? 100 : 200,
                mouseInteraction: true,
                gravityStrength: 0.02
            });
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
        if (this.canvasParticleSystem) {
            this.canvasParticleSystem.destroy();
        }
        if (this.scrollAnimations) {
            this.scrollAnimations.destroy();
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CanvasParticleSystem,
        ScrollAnimations,
        InteractiveAnimations,
        LoadingAnimations,
        AnimationManager
    };
}

// Make available globally
window.Animations = {
    CanvasParticleSystem,
    ScrollAnimations,
    InteractiveAnimations,
    LoadingAnimations,
    AnimationManager
};
