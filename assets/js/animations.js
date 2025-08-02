/**
 * Animation system for Gravity Ion Thermoelectric Website
 * Handles particle animations, scroll effects, and visual interactions
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

/**
 * Scientific Ion Physics Particle System
 * Accurately represents gravitational ion separation and electric field generation
 * Based on the Tolman experiment and gravity-ion thermoelectric principles
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
            lightIonCount: Utils.Device.isMobile() ? 60 : 120,
            heavyIonCount: Utils.Device.isMobile() ? 40 : 80,
            electronCount: Utils.Device.isMobile() ? 20 : 40,
            lightIonColor: '#FFD700', // Yellow for light negative ions
            heavyIonColor: '#00BFFF', // Blue for heavy positive ions
            electronColor: '#FF4444', // Red for electrons
            electricFieldColor: '#00FF88', // Green for electric field lines
            animationSpeed: 0.8,
            gravityStrength: 0.15,
            electricFieldStrength: 0.08,
            thermalEnergy: 0.02,
            mouseInteraction: false, // Disabled for scientific accuracy
            enabled: !Utils.Device.prefersReducedMotion(),
            showElectricField: true,
            showElectronFlow: true,
            ...options
        };

        this.particles = [];
        this.electricField = [];
        this.electronFlow = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.animationId = null;
        this.isRunning = false;
        this.equilibriumTime = 0;

        if (this.options.enabled) {
            this.init();
        }
    }

    /**
     * Initialize canvas particle system
     */
    init() {
        this.setupCanvas();
        this.createIonSystem();
        this.createElectricFieldVisualization();
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
            this.createIonSystem(); // Recreate particles on resize
            this.createElectricFieldVisualization();
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
     * Create scientifically accurate ion system
     */
    createIonSystem() {
        this.particles = [];

        // Create light negative ions (electron-rich ions)
        for (let i = 0; i < this.options.lightIonCount; i++) {
            const particle = this.createLightIon();
            this.particles.push(particle);
        }

        // Create heavy positive ions
        for (let i = 0; i < this.options.heavyIonCount; i++) {
            const particle = this.createHeavyIon();
            this.particles.push(particle);
        }

        // Create free electrons for electron flow visualization
        for (let i = 0; i < this.options.electronCount; i++) {
            const particle = this.createElectron();
            this.particles.push(particle);
        }
    }

    /**
     * Create light negative ion (tends to rise due to lower mass)
     */
    createLightIon() {
        const y = Utils.MathUtils.random(0, this.canvas.height * 0.7); // Start distributed but bias toward top
        
        return {
            x: Utils.MathUtils.random(0, this.canvas.width),
            y,
            vx: Utils.MathUtils.random(-0.3, 0.3) * this.options.animationSpeed,
            vy: Utils.MathUtils.random(-0.2, 0.2) * this.options.animationSpeed,
            size: Utils.MathUtils.random(2, 4),
            mass: 0.5, // Light mass
            charge: -1, // Negative charge
            color: this.options.lightIonColor,
            type: 'light_ion',
            opacity: Utils.MathUtils.random(0.6, 0.9),
            equilibriumY: Utils.MathUtils.random(0, this.canvas.height * 0.4), // Prefer upper region
            thermalEnergy: Utils.MathUtils.random(0.8, 1.2)
        };
    }

    /**
     * Create heavy positive ion (tends to sink due to higher mass)
     */
    createHeavyIon() {
        const y = Utils.MathUtils.random(this.canvas.height * 0.3, this.canvas.height); // Start distributed but bias toward bottom
        
        return {
            x: Utils.MathUtils.random(0, this.canvas.width),
            y,
            vx: Utils.MathUtils.random(-0.2, 0.2) * this.options.animationSpeed,
            vy: Utils.MathUtils.random(-0.1, 0.1) * this.options.animationSpeed,
            size: Utils.MathUtils.random(4, 7),
            mass: 2.0, // Heavy mass
            charge: 1, // Positive charge
            color: this.options.heavyIonColor,
            type: 'heavy_ion',
            opacity: Utils.MathUtils.random(0.6, 0.9),
            equilibriumY: Utils.MathUtils.random(this.canvas.height * 0.6, this.canvas.height), // Prefer lower region
            thermalEnergy: Utils.MathUtils.random(0.8, 1.2)
        };
    }

    /**
     * Create electron for electron flow visualization
     */
    createElectron() {
        return {
            x: Utils.MathUtils.random(0, this.canvas.width),
            y: Utils.MathUtils.random(this.canvas.height * 0.7, this.canvas.height), // Start near bottom
            vx: Utils.MathUtils.random(-0.5, 0.5) * this.options.animationSpeed,
            vy: -Utils.MathUtils.random(0.5, 1.0) * this.options.animationSpeed, // Generally move upward
            size: Utils.MathUtils.random(1, 2),
            mass: 0.1, // Very light
            charge: -1, // Negative charge
            color: this.options.electronColor,
            type: 'electron',
            opacity: Utils.MathUtils.random(0.4, 0.8),
            flowDirection: 'upward', // Against electric field
            thermalEnergy: Utils.MathUtils.random(1.2, 1.8) // Higher thermal energy
        };
    }

    /**
     * Create electric field line visualization
     */
    createElectricFieldVisualization() {
        if (!this.options.showElectricField) {
            return;
        }
        
        this.electricField = [];
        const fieldLineCount = Utils.Device.isMobile() ? 8 : 12;
        
        for (let i = 0; i < fieldLineCount; i++) {
            const x = (this.canvas.width / (fieldLineCount + 1)) * (i + 1);
            
            this.electricField.push({
                x,
                startY: this.canvas.height * 0.9,
                endY: this.canvas.height * 0.1,
                opacity: 0.3,
                animated: true
            });
        }
    }

    /**
     * Setup mouse interaction listeners (disabled for scientific accuracy)
     */
    setupEventListeners() {
        // Scientific simulation should not be affected by mouse interaction
        // This maintains the accuracy of the physics demonstration
        console.info('Mouse interaction disabled for scientific accuracy');
    }

    /**
     * Start animation loop
     */
    start() {
        if (this.isRunning) {
            return;
        }
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
        if (!this.isRunning) {
            return;
        }

        this.updateIonPhysics();
        this.drawScientificVisualization();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Update ion physics based on scientific principles
     */
    updateIonPhysics() {
        this.equilibriumTime += 0.016; // Assume 60fps

        this.particles.forEach((particle) => {
            // Apply gravitational force (F = mg)
            const gravityForce = this.options.gravityStrength * particle.mass;
            particle.vy += gravityForce;

            // Calculate electric field strength based on charge distribution
            const electricFieldStrength = this.calculateElectricField(particle.y);
            
            // Apply electric force (F = qE)
            const electricForce = particle.charge * electricFieldStrength * this.options.electricFieldStrength;
            particle.vy -= electricForce; // Electric field points upward

            // Apply thermal vibration (Brownian motion)
            const thermalForceX = (Math.random() - 0.5) * this.options.thermalEnergy * particle.thermalEnergy;
            const thermalForceY = (Math.random() - 0.5) * this.options.thermalEnergy * particle.thermalEnergy;
            
            particle.vx += thermalForceX;
            particle.vy += thermalForceY;

            // Special behavior for electrons (electron flow against electric field)
            if (particle.type === 'electron') {
                // Electrons gain energy moving against electric field
                const energyGain = Math.abs(electricForce) * 0.1;
                particle.vy -= energyGain; // Additional upward force from thermal energy
                
                // Reset electrons at bottom when they reach top (continuous flow)
                if (particle.y < 0) {
                    particle.y = this.canvas.height;
                    particle.x = Utils.MathUtils.random(0, this.canvas.width);
                }
            }

            // Apply equilibrium force to maintain separation
            if (particle.type === 'light_ion' || particle.type === 'heavy_ion') {
                const equilibriumForce = (particle.equilibriumY - particle.y) * 0.001;
                particle.vy += equilibriumForce;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary conditions with realistic collisions
            if (particle.x <= particle.size || particle.x >= this.canvas.width - particle.size) {
                particle.vx *= -0.7; // Inelastic collision
                particle.x = Utils.MathUtils.clamp(particle.x, particle.size, this.canvas.width - particle.size);
            }

            if (particle.y <= particle.size || particle.y >= this.canvas.height - particle.size) {
                particle.vy *= -0.5; // More energy loss on vertical collision
                particle.y = Utils.MathUtils.clamp(particle.y, particle.size, this.canvas.height - particle.size);
            }

            // Apply drag force (simulates fluid resistance)
            particle.vx *= 0.995;
            particle.vy *= 0.998;

            // Limit velocity to prevent runaway acceleration
            const maxVelocity = 2.0;
            particle.vx = Utils.MathUtils.clamp(particle.vx, -maxVelocity, maxVelocity);
            particle.vy = Utils.MathUtils.clamp(particle.vy, -maxVelocity, maxVelocity);
        });
    }

    /**
     * Calculate electric field strength at given height
     * @param {number} y - Height position
     * @returns {number} Electric field strength
     */
    calculateElectricField(y) {
        // Electric field is stronger in the middle, representing the equilibrium state
        const normalizedY = y / this.canvas.height;
        const fieldStrength = Math.sin(normalizedY * Math.PI) * 0.5 + 0.5;
        
        // Field gradually builds up over time to show self-generation
        const timeBuildup = Math.min(1.0, this.equilibriumTime / 10.0);
        
        return fieldStrength * timeBuildup;
    }

    /**
     * Draw scientific visualization of ion separation and electric field
     */
    drawScientificVisualization() {
        // Clear canvas with subtle fade for motion trails
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw electric field lines first (background)
        if (this.options.showElectricField) {
            this.drawElectricFieldLines();
        }

        // Draw particles with scientific styling
        this.drawIons();

        // Draw electron flow visualization
        if (this.options.showElectronFlow) {
            this.drawElectronFlow();
        }

        // Draw scientific annotations
        this.drawScientificAnnotations();
    }

    /**
     * Draw electric field lines pointing upward
     */
    drawElectricFieldLines() {
        this.ctx.save();
        
        this.electricField.forEach((field, index) => {
            // Animated electric field lines
            const time = this.equilibriumTime * 2 + index * 0.5;
            const opacity = (Math.sin(time) * 0.2 + 0.3) * field.opacity;
            
            this.ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([4, 8]);
            this.ctx.lineDashOffset = -time * 10;

            // Draw field line
            this.ctx.beginPath();
            this.ctx.moveTo(field.x, field.startY);
            this.ctx.lineTo(field.x, field.endY);
            this.ctx.stroke();

            // Draw field direction arrows
            const arrowCount = 3;
            for (let i = 0; i < arrowCount; i++) {
                const arrowY = field.startY - (field.startY - field.endY) * (i + 1) / (arrowCount + 1);
                this.drawFieldArrow(field.x, arrowY, 'up', opacity);
            }
        });

        this.ctx.restore();
    }

    /**
     * Draw field direction arrow
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} direction - Arrow direction
     * @param {number} opacity - Arrow opacity
     */
    drawFieldArrow(x, y, direction, opacity) {
        this.ctx.save();
        this.ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
        
        const size = 4;
        this.ctx.beginPath();
        
        if (direction === 'up') {
            this.ctx.moveTo(x, y - size);
            this.ctx.lineTo(x - size/2, y);
            this.ctx.lineTo(x + size/2, y);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    /**
     * Draw ions with scientific representation
     */
    drawIons() {
        this.particles.forEach(particle => {
            if (particle.type === 'electron') {
                return; // Draw electrons separately
            }

            this.ctx.save();

            // Set particle style based on type
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            
            // Add charge indication with glow
            if (particle.charge > 0) {
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = particle.size * 1.5;
            } else {
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = particle.size;
            }

            // Draw main particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw charge symbol
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${particle.size * 1.2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            const chargeSymbol = particle.charge > 0 ? '+' : '−';
            this.ctx.fillText(chargeSymbol, particle.x, particle.y);

            this.ctx.restore();
        });
    }

    /**
     * Draw electron flow visualization
     */
    drawElectronFlow() {
        const electrons = this.particles.filter(p => p.type === 'electron');
        
        electrons.forEach((electron, index) => {
            this.ctx.save();
            
            // Pulsating effect for electrons
            const time = this.equilibriumTime * 5 + index;
            const pulse = Math.sin(time) * 0.3 + 0.7;
            
            this.ctx.globalAlpha = electron.opacity * pulse;
            this.ctx.fillStyle = electron.color;
            this.ctx.shadowColor = electron.color;
            this.ctx.shadowBlur = electron.size * 3;

            // Draw electron
            this.ctx.beginPath();
            this.ctx.arc(electron.x, electron.y, electron.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw motion trail
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = `rgba(255, 68, 68, ${electron.opacity * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(electron.x, electron.y);
            this.ctx.lineTo(electron.x - electron.vx * 5, electron.y - electron.vy * 5);
            this.ctx.stroke();

            this.ctx.restore();
        });
    }

    /**
     * Draw scientific annotations and labels
     */
    drawScientificAnnotations() {
        this.ctx.save();
        
        // Draw region labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';

        // Upper region (negative charge concentration)
        this.ctx.fillText('負離子集中區', 20, 30);
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
        this.ctx.fillText('(較輕的負離子)', 20, 50);

        // Lower region (positive charge concentration)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillText('正離子集中區', 20, this.canvas.height - 50);
        this.ctx.fillStyle = 'rgba(0, 191, 255, 0.6)';
        this.ctx.fillText('(較重的正離子)', 20, this.canvas.height - 30);

        // Electric field annotation
        if (this.options.showElectricField && this.equilibriumTime > 3) {
            this.ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
            this.ctx.fillText('自發電場 ↑', this.canvas.width - 120, this.canvas.height / 2);
            this.ctx.font = '12px Arial';
            this.ctx.fillText('E = (m₊ - m₋)G/2q', this.canvas.width - 150, this.canvas.height / 2 + 20);
        }

        // Electron flow annotation
        if (this.options.showElectronFlow && this.equilibriumTime > 5) {
            this.ctx.fillStyle = 'rgba(255, 68, 68, 0.8)';
            this.ctx.font = '12px Arial';
            this.ctx.fillText('電子逆電場流動', this.canvas.width - 140, this.canvas.height - 80);
            this.ctx.fillText('(熱振動驅動)', this.canvas.width - 130, this.canvas.height - 60);
        }

        this.ctx.restore();
    }

    /**
     * Destroy particle system
     */
    destroy() {
        this.stop();
        this.particles = [];
        this.electricField = [];
        this.electronFlow = [];
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
        // Initialize scientific ion particle system for hero section
        const particlesCanvas = Utils.DOM.select('#particles-canvas');
        if (particlesCanvas) {
            this.canvasParticleSystem = new CanvasParticleSystem(particlesCanvas, {
                lightIonCount: Utils.Device.isMobile() ? 60 : 120,
                heavyIonCount: Utils.Device.isMobile() ? 40 : 80,
                electronCount: Utils.Device.isMobile() ? 20 : 40,
                gravityStrength: 0.15,
                electricFieldStrength: 0.08,
                thermalEnergy: 0.02,
                showElectricField: true,
                showElectronFlow: true,
                mouseInteraction: false // Disabled for scientific accuracy
            });
        }

        // Initialize scroll animations
        this.scrollAnimations = new ScrollAnimations();

        // Initialize interactive animations
        this.interactiveAnimations = new InteractiveAnimations();

        // Initialize loading animations
        this.loadingAnimations = new LoadingAnimations();

        console.info('Scientific animation systems initialized');
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
