/**
 * Interactive Particle Simulator for Scientific Breakthrough Section
 * Provides real-time visualization of gravity-induced ion separation
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

/**
 * Interactive Scientific Particle Simulator
 * Allows users to adjust parameters and observe real-time changes
 */
class InteractiveParticleSimulator {
    constructor(canvasId, options = {}) {
        this.canvas = Utils.DOM.select(canvasId);
        if (!this.canvas) {
            console.warn('Canvas element not found for interactive particle simulator');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.options = {
            particleCount: Utils.Device.isMobile() ? 80 : 120,
            lightParticleRatio: 0.6, // 60% light particles, 40% heavy
            initialGravity: 1.0,
            initialTemperature: 1.0,
            maxGravity: 2.0,
            maxTemperature: 3.0,
            animationSpeed: 1.0,
            showElectricField: true,
            showTrails: true,
            ...options
        };

        // Simulation state
        this.particles = [];
        this.electricField = [];
        this.isRunning = false;
        this.animationId = null;
        this.simulationTime = 0;

        // Physics parameters (user-controllable)
        this.gravity = this.options.initialGravity;
        this.thermalEnergy = this.options.initialTemperature;

        // Physics engine integration
        this.physicsEngine = new PhysicsEngine();
        this.currentIonSystem = 'HI'; // Default to HI system

        // Real ion system configurations (based on Chen's paper)
        this.ionSystems = {
            'HI': {
                anion: 'I-',
                cation: 'H+',
                name: '氫碘酸 (HI)',
                maxPower: 72.23, // W/m³ from paper Table 1
                anionMass: 2.1092473836e-25,
                cationMass: 1.6737236191e-27,
                color: { anion: '#FFD700', cation: '#00BFFF' }
            },
            'LiCl': {
                anion: 'Cl-',
                cation: 'Li+',
                name: '氯化鋰 (LiCl)',
                maxPower: 4.514,
                anionMass: 5.8058934782e-26,
                cationMass: 1.1650544317e-26,
                color: { anion: '#32CD32', cation: '#FF69B4' }
            },
            'KCl': {
                anion: 'Cl-',
                cation: 'K+',
                name: '氯化鉀 (KCl)',
                maxPower: 0.2821,
                anionMass: 5.8058934782e-26,
                cationMass: 6.4659006555e-26,
                color: { anion: '#32CD32', cation: '#9370DB' }
            }
        };

        // Visualization modes
        this.visualizationMode = 'particles'; // particles, concentration, electric-field
        this.showFormulas = true;
        this.showScientificAnnotations = true;

        // Measurement data
        this.measurements = {
            electricFieldStrength: 0,
            separationDegree: 0,
            currentDensity: 0,
            averageHeight: { light: 0, heavy: 0 }
        };

        this.init();
    }

    /**
     * Initialize the particle simulator
     */
    init() {
        this.setupCanvas();
        this.createParticleSystem();
        this.setupControls();
        this.setupMeasurementDisplay();
        this.start();
    }

    /**
     * Switch ion system for different physics calculations
     * @param {string} systemKey - Key for ion system (HI, LiCl, KCl)
     */
    switchIonSystem(systemKey) {
        if (this.ionSystems[systemKey]) {
            this.currentIonSystem = systemKey;
            this.recreateParticleSystem();
            this.updateMeasurements();
        }
    }

    /**
     * Set visualization mode
     * @param {string} mode - Visualization mode (particles, concentration, electric-field)
     */
    setVisualizationMode(mode) {
        const validModes = ['particles', 'concentration', 'electric-field'];
        if (validModes.includes(mode)) {
            this.visualizationMode = mode;
            this.render(); // Immediate re-render
        }
    }

    /**
     * Recreate particle system with current ion system
     */
    recreateParticleSystem() {
        this.createParticleSystem();
    }

    /**
     * Setup canvas dimensions and styling
     */
    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        this.canvas.width = rect.width;
        this.canvas.height = 384; // Fixed height for consistent simulation

        // Handle resize
        window.addEventListener('resize', Utils.Performance.debounce(() => {
            this.setupCanvas();
            this.createParticleSystem();
        }, 250));
    }

    /**
     * Create the particle system
     */
    createParticleSystem() {
        this.particles = [];
        const totalParticles = this.options.particleCount;
        const lightCount = Math.floor(totalParticles * this.options.lightParticleRatio);
        const heavyCount = totalParticles - lightCount;

        // Create light particles (negative ions)
        for (let i = 0; i < lightCount; i++) {
            this.particles.push(this.createLightParticle());
        }

        // Create heavy particles (positive ions)
        for (let i = 0; i < heavyCount; i++) {
            this.particles.push(this.createHeavyParticle());
        }

        // Create electric field visualization
        this.createElectricFieldLines();
    }

    /**
     * Create a light particle (negative ion)
     */
    createLightParticle() {
        const system = this.ionSystems[this.currentIonSystem];
        
        return {
            x: Utils.MathUtils.random(5, this.canvas.width - 5),
            y: Utils.MathUtils.random(5, this.canvas.height - 5),
            vx: Utils.MathUtils.random(-0.5, 0.5),
            vy: Utils.MathUtils.random(-0.5, 0.5),
            mass: system.anionMass, // Real ion mass
            charge: -1, // Negative charge
            size: Utils.MathUtils.random(2, 4),
            baseSize: Utils.MathUtils.random(2, 4),
            color: system.color.anion,
            type: 'anion',
            ionType: system.anion,
            trail: [],
            opacity: Utils.MathUtils.random(0.7, 1.0),
            equilibriumReached: false
        };
    }

    /**
     * Create a heavy particle (positive ion)
     */
    createHeavyParticle() {
        const system = this.ionSystems[this.currentIonSystem];
        
        return {
            x: Utils.MathUtils.random(5, this.canvas.width - 5),
            y: Utils.MathUtils.random(5, this.canvas.height - 5),
            vx: Utils.MathUtils.random(-0.3, 0.3),
            vy: Utils.MathUtils.random(-0.3, 0.3),
            mass: system.cationMass, // Real ion mass
            charge: 1, // Positive charge
            size: Utils.MathUtils.random(4, 7),
            baseSize: Utils.MathUtils.random(4, 7),
            color: system.color.cation,
            type: 'cation',
            ionType: system.cation,
            trail: [],
            opacity: Utils.MathUtils.random(0.7, 1.0),
            equilibriumReached: false
        };
    }

    /**
     * Create electric field lines
     */
    createElectricFieldLines() {
        this.electricField = [];
        const lineCount = 8;

        for (let i = 0; i < lineCount; i++) {
            const x = (this.canvas.width / (lineCount + 1)) * (i + 1);
            this.electricField.push({
                x,
                strength: 0,
                direction: 1, // 1 for upward, -1 for downward
                opacity: 0.3
            });
        }
    }

    /**
     * Setup interactive controls
     */
    setupControls() {
        // Gravity slider
        const gravitySlider = Utils.DOM.select('#gravity-slider');
        const gravityValue = Utils.DOM.select('#gravity-value');

        if (gravitySlider && gravityValue) {
            Utils.DOM.on(gravitySlider, 'input', (e) => {
                this.gravity = parseFloat(e.target.value);
                gravityValue.textContent = `${this.gravity.toFixed(1)}g`;
                this.resetEquilibrium();
            });
        }

        // Temperature slider
        const temperatureSlider = Utils.DOM.select('#temperature-slider');
        const temperatureValue = Utils.DOM.select('#temperature-value');

        if (temperatureSlider && temperatureValue) {
            Utils.DOM.on(temperatureSlider, 'input', (e) => {
                this.thermalEnergy = parseFloat(e.target.value);
                temperatureValue.textContent = this.thermalEnergy.toFixed(1);
                this.resetEquilibrium();
            });
        }

        // Ion system selector
        const ionSystemSelect = Utils.DOM.select('#ion-system-select');
        if (ionSystemSelect) {
            Utils.DOM.on(ionSystemSelect, 'change', (e) => {
                this.switchIonSystem(e.target.value);
            });
        }

        // Visualization mode selector
        const visualizationModeSelect = Utils.DOM.select('#visualization-mode');
        if (visualizationModeSelect) {
            Utils.DOM.on(visualizationModeSelect, 'change', (e) => {
                this.setVisualizationMode(e.target.value);
            });
        }

        // Show formulas checkbox
        const showFormulasCheckbox = Utils.DOM.select('#show-formulas');
        if (showFormulasCheckbox) {
            Utils.DOM.on(showFormulasCheckbox, 'change', (e) => {
                this.showFormulas = e.target.checked;
                this.render(); // Immediate re-render
            });
        }

        // Reset button
        const resetButton = Utils.DOM.select('#reset-simulation');
        if (resetButton) {
            Utils.DOM.on(resetButton, 'click', () => {
                this.resetSimulation();
            });
        }
    }

    /**
     * Setup measurement display updates
     */
    setupMeasurementDisplay() {
        this.measurementElements = {
            electricField: Utils.DOM.select('#electric-field-value'),
            separation: Utils.DOM.select('#separation-value'),
            current: Utils.DOM.select('#current-value')
        };
    }

    /**
     * Reset particle equilibrium state
     */
    resetEquilibrium() {
        this.particles.forEach(particle => {
            particle.equilibriumReached = false;
        });
        this.simulationTime = 0;
    }

    /**
     * Reset entire simulation
     */
    resetSimulation() {
        this.stop();
        this.createParticleSystem();
        this.simulationTime = 0;

        // Reset sliders to default values
        const gravitySlider = Utils.DOM.select('#gravity-slider');
        const temperatureSlider = Utils.DOM.select('#temperature-slider');
        const gravityValue = Utils.DOM.select('#gravity-value');
        const temperatureValue = Utils.DOM.select('#temperature-value');

        if (gravitySlider) {
            gravitySlider.value = this.options.initialGravity;
            this.gravity = this.options.initialGravity;
            if (gravityValue) {gravityValue.textContent = `${this.gravity.toFixed(1)}g`;}
        }

        if (temperatureSlider) {
            temperatureSlider.value = this.options.initialTemperature;
            this.thermalEnergy = this.options.initialTemperature;
            if (temperatureValue) {temperatureValue.textContent = this.thermalEnergy.toFixed(1);}
        }

        this.start();
    }

    /**
     * Start simulation
     */
    start() {
        if (this.isRunning) {return;}
        this.isRunning = true;
        this.animate();
    }

    /**
     * Stop simulation
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

        this.updatePhysics();
        this.updateMeasurements();
        this.render();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Calculate particle distribution using real physics (Boltzmann distribution)
     * @param {Object} particle - The particle to calculate for
     * @returns {Object} Physics data including equilibrium force and concentration ratio
     */
    calculateParticleDistribution(particle) {
        const system = this.ionSystems[this.currentIonSystem];
        const ionMass = particle.type === 'anion' ? system.anionMass : system.cationMass;
        
        // Use Boltzmann distribution calculation
        // Formula: C(h+Δh)/C(h) = exp(-mGΔh/kT)
        const heightDifference = (this.canvas.height / 2 - particle.y) / 1000; // Convert to meters
        const acceleration = this.gravity * 9.81; // Convert to m/s²
        
        const concentrationRatio = this.physicsEngine.calculateBoltzmannRatio(
            ionMass, 
            acceleration, 
            heightDifference, 
            this.physicsEngine.temperature
        );
        
        // Calculate equilibrium force based on concentration gradient
        const equilibriumForce = Math.log(concentrationRatio) * this.thermalEnergy * 0.01;
        
        return {
            equilibriumForce,
            concentrationRatio,
            preferredHeight: this.calculatePreferredHeight(ionMass, acceleration)
        };
    }

    /**
     * Calculate preferred height for ion based on mass
     * @param {number} ionMass - Mass of the ion
     * @param {number} acceleration - Gravitational acceleration
     * @returns {number} Preferred height in canvas coordinates
     */
    calculatePreferredHeight(ionMass, acceleration) {
        // Lighter ions prefer higher positions, heavier ions prefer lower positions
        const massRatio = ionMass / (this.ionSystems[this.currentIonSystem].anionMass + this.ionSystems[this.currentIonSystem].cationMass);
        return this.canvas.height * (0.8 - massRatio * 0.6);
    }

    /**
     * Calculate electric field strength using real physics
     * @param {Object} position - Position to calculate field strength at
     * @returns {number} Electric field strength
     */
    calculateElectricFieldStrength(position) {
        const system = this.ionSystems[this.currentIonSystem];
        const massA = system.anionMass;
        const massC = system.cationMass;
        const acceleration = this.gravity * 9.81;
        
        // Formula: E = (m₁ - m₂)G / (2q)
        const electricField = this.physicsEngine.calculateElectricField(
            massA, massC, acceleration
        );
        
        // Calculate local charge distribution modifier
        const localModifier = this.calculateLocalChargeDistribution(position);
        
        return electricField * localModifier;
    }

    /**
     * Calculate local charge distribution at a position
     * @param {Object} position - Position to calculate at
     * @returns {number} Local charge distribution modifier
     */
    calculateLocalChargeDistribution(position) {
        // Count nearby particles to determine local charge density
        const radius = 50; // Search radius
        let localAnions = 0;
        let localCations = 0;
        
        this.particles.forEach(particle => {
            const distance = Math.sqrt(
                Math.pow(particle.x - position.x, 2) + 
                Math.pow(particle.y - position.y, 2)
            );
            
            if (distance <= radius) {
                if (particle.type === 'anion') {
                    localAnions++;
                } else {
                    localCations++;
                }
            }
        });
        
        // Return charge imbalance factor
        const totalLocal = localAnions + localCations;
        if (totalLocal === 0) return 1.0;
        
        return Math.abs(localAnions - localCations) / totalLocal;
    }

    /**
     * Update particle physics
     */
    updatePhysics() {
        this.simulationTime += 0.016; // Assume 60fps

        this.particles.forEach(particle => {
            // Get real physics data for this particle
            const physicsData = this.calculateParticleDistribution(particle);
            
            // Apply gravitational force based on real mass
            const gravityForce = this.gravity * particle.mass * 0.05 / 1e-26; // Normalize for visualization
            particle.vy += gravityForce;

            // Apply equilibrium force from Boltzmann distribution
            particle.vy += physicsData.equilibriumForce;

            // Calculate electric field at particle position
            const electricFieldStrength = this.calculateElectricFieldStrength(particle);

            // Apply electric force (F = qE)
            const electricForce = particle.charge * electricFieldStrength * 0.01; // Scale for visualization
            particle.vy -= electricForce; // Electric field points upward

            // Apply thermal motion (Brownian motion)
            const thermalForceX = (Math.random() - 0.5) * this.thermalEnergy * 0.1;
            const thermalForceY = (Math.random() - 0.5) * this.thermalEnergy * 0.1;

            particle.vx += thermalForceX;
            particle.vy += thermalForceY;

            // Update position
            particle.x += particle.vx * this.options.animationSpeed;
            particle.y += particle.vy * this.options.animationSpeed;

            // Boundary conditions
            this.handleBoundaryCollision(particle);

            // Apply damping
            particle.vx *= 0.995;
            particle.vy *= 0.998;

            // Limit velocity
            const maxVel = 3.0;
            particle.vx = Utils.MathUtils.clamp(particle.vx, -maxVel, maxVel);
            particle.vy = Utils.MathUtils.clamp(particle.vy, -maxVel, maxVel);

            // Update trail for visualization
            this.updateParticleTrail(particle);
        });

        // Update electric field based on particle distribution
        this.updateElectricField();
    }

    /**
     * Handle particle boundary collisions
     */
    handleBoundaryCollision(particle) {
        if (particle.x <= particle.size || particle.x >= this.canvas.width - particle.size) {
            particle.vx *= -0.8;
            particle.x = Utils.MathUtils.clamp(particle.x, particle.size, this.canvas.width - particle.size);
        }

        if (particle.y <= particle.size || particle.y >= this.canvas.height - particle.size) {
            particle.vy *= -0.6;
            particle.y = Utils.MathUtils.clamp(particle.y, particle.size, this.canvas.height - particle.size);
        }
    }

    /**
     * Update particle trail for visualization
     */
    updateParticleTrail(particle) {
        if (!this.options.showTrails) {return;}

        particle.trail.push({ x: particle.x, y: particle.y });

        // Limit trail length
        if (particle.trail.length > 10) {
            particle.trail.shift();
        }
    }

    /**
     * Calculate electric field strength at given height
     */
    calculateElectricFieldAt(y) {
        // Field strength depends on charge separation
        const normalizedY = y / this.canvas.height;
        const separationEffect = this.calculateChargeSeparation();

        // Electric field is stronger when there's more separation
        return separationEffect * Math.sin(normalizedY * Math.PI) * 0.5;
    }

    /**
     * Calculate charge separation degree
     */
    calculateChargeSeparation() {
        let lightCenterY = 0;
        let heavyCenterY = 0;
        let lightCount = 0;
        let heavyCount = 0;

        this.particles.forEach(particle => {
            if (particle.type === 'light') {
                lightCenterY += particle.y;
                lightCount++;
            } else {
                heavyCenterY += particle.y;
                heavyCount++;
            }
        });

        if (lightCount === 0 || heavyCount === 0) {return 0;}

        lightCenterY /= lightCount;
        heavyCenterY /= heavyCount;

        // Store for measurements
        this.measurements.averageHeight.light = lightCenterY;
        this.measurements.averageHeight.heavy = heavyCenterY;

        // Calculate separation as fraction of canvas height
        const separation = Math.abs(heavyCenterY - lightCenterY) / this.canvas.height;
        return Utils.MathUtils.clamp(separation, 0, 1);
    }

    /**
     * Update electric field visualization
     */
    updateElectricField() {
        const separationDegree = this.calculateChargeSeparation();

        this.electricField.forEach(field => {
            field.strength = separationDegree;
            field.opacity = 0.3 + separationDegree * 0.4;
        });
    }

    /**
     * Update measurement displays
     */
    updateMeasurements() {
        const separationDegree = this.calculateChargeSeparation();
        const system = this.ionSystems[this.currentIonSystem];

        // Calculate real electric field strength using physics engine
        const acceleration = this.gravity * 9.81; // Convert to m/s²
        const realElectricField = this.physicsEngine.calculateElectricField(
            system.anionMass, 
            system.cationMass, 
            acceleration
        );

        // Electric field strength (real physics)
        this.measurements.electricFieldStrength = realElectricField;

        // Separation degree based on actual particle positions
        this.measurements.separationDegree = separationDegree * 100;

        // Current density calculated from real power density
        const powerDensity = this.physicsEngine.calculatePowerDensity(
            system.anion, 
            system.cation
        );
        this.measurements.currentDensity = powerDensity.powerDensityCombined / 1000; // Convert to A/m²

        // Update average heights for visualization
        this.updateAverageHeights();

        // Update display elements
        if (this.measurementElements.electricField) {
            this.measurementElements.electricField.textContent =
                `${this.measurements.electricFieldStrength.toFixed(2)} V/m`;
        }

        if (this.measurementElements.separation) {
            this.measurementElements.separation.textContent =
                `${this.measurements.separationDegree.toFixed(0)}%`;
        }

        if (this.measurementElements.current) {
            this.measurementElements.current.textContent =
                `${this.measurements.currentDensity.toFixed(2)} A/m²`;
        }
    }

    /**
     * Update average particle heights for measurement display
     */
    updateAverageHeights() {
        let lightSum = 0, heavySum = 0;
        let lightCount = 0, heavyCount = 0;

        this.particles.forEach(particle => {
            if (particle.type === 'anion') {
                lightSum += particle.y;
                lightCount++;
            } else {
                heavySum += particle.y;
                heavyCount++;
            }
        });

        this.measurements.averageHeight.light = lightCount > 0 ? lightSum / lightCount : 0;
        this.measurements.averageHeight.heavy = heavyCount > 0 ? heavySum / heavyCount : 0;
    }

    /**
     * Render the simulation
     */
    render() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render based on visualization mode
        switch (this.visualizationMode) {
            case 'particles':
                this.renderParticleMode();
                break;
            case 'concentration':
                this.renderConcentrationMode();
                break;
            case 'electric-field':
                this.renderElectricFieldMode();
                break;
            default:
                this.renderParticleMode();
        }

        // Draw scientific annotations if enabled
        if (this.showScientificAnnotations) {
            this.drawScientificAnnotations();
        }
    }

    /**
     * Render particle visualization mode
     */
    renderParticleMode() {
        // Draw electric field lines
        if (this.options.showElectricField) {
            this.drawElectricField();
        }

        // Draw particle trails
        if (this.options.showTrails) {
            this.drawParticleTrails();
        }

        // Draw particles with enhanced physics-based appearance
        this.drawParticlesEnhanced();

        // Draw additional visual effects
        this.drawVisualEffects();
    }

    /**
     * Render concentration distribution mode
     */
    renderConcentrationMode() {
        this.drawConcentrationDistribution();
        this.drawConcentrationContours();
        
        // Draw particles with reduced opacity
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.drawParticlesEnhanced();
        this.ctx.restore();
    }

    /**
     * Render electric field visualization mode
     */
    renderElectricFieldMode() {
        this.drawElectricFieldLines();
        this.drawFieldStrengthIndicators();
        
        // Draw particles with reduced opacity
        this.ctx.save();
        this.ctx.globalAlpha = 0.2;
        this.drawParticlesEnhanced();
        this.ctx.restore();
    }

    /**
     * Draw electric field lines
     */
    drawElectricField() {
        this.ctx.save();

        this.electricField.forEach((field, index) => {
            if (field.strength > 0.1) {
                const time = this.simulationTime * 2 + index * 0.5;
                const opacity = field.opacity * (0.7 + 0.3 * Math.sin(time));

                this.ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                this.ctx.lineWidth = 1 + field.strength;
                this.ctx.setLineDash([4, 6]);
                this.ctx.lineDashOffset = -time * 8;

                // Draw field line
                this.ctx.beginPath();
                this.ctx.moveTo(field.x, this.canvas.height * 0.9);
                this.ctx.lineTo(field.x, this.canvas.height * 0.1);
                this.ctx.stroke();

                // Draw arrows
                this.drawFieldArrows(field.x, field.strength, opacity);
            }
        });

        this.ctx.restore();
    }

    /**
     * Draw field direction arrows
     */
    drawFieldArrows(x, strength, opacity) {
        const arrowCount = 3;
        const arrowSize = 4 + strength * 2;

        for (let i = 0; i < arrowCount; i++) {
            const y = this.canvas.height * (0.8 - i * 0.25);

            this.ctx.save();
            this.ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - arrowSize);
            this.ctx.lineTo(x - arrowSize/2, y);
            this.ctx.lineTo(x + arrowSize/2, y);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    /**
     * Draw particle trails
     */
    drawParticleTrails() {
        this.particles.forEach(particle => {
            if (particle.trail.length > 1) {
                this.ctx.save();
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.3;

                this.ctx.beginPath();
                this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);

                for (let i = 1; i < particle.trail.length; i++) {
                    this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }

                this.ctx.stroke();
                this.ctx.restore();
            }
        });
    }

    /**
     * Draw particles
     */
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;

            // Glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = particle.size * 1.5;

            // Main particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Charge symbol
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${particle.size * 1.2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            const symbol = particle.charge > 0 ? '+' : '−';
            this.ctx.fillText(symbol, particle.x, particle.y);

            this.ctx.restore();
        });
    }

    /**
     * Draw additional visual effects
     */
    drawVisualEffects() {
        // Draw separation visualization
        this.drawSeparationIndicator();

        // Draw energy flow arrows (if current is flowing)
        if (this.measurements.currentDensity > 0.1) {
            this.drawEnergyFlow();
        }
    }

    /**
     * Draw separation indicator
     */
    drawSeparationIndicator() {
        const lightY = this.measurements.averageHeight.light;
        const heavyY = this.measurements.averageHeight.heavy;

        if (Math.abs(lightY - heavyY) > 10) {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.setLineDash([2, 4]);
            this.ctx.lineWidth = 1;

            // Light particle center line
            this.ctx.beginPath();
            this.ctx.moveTo(10, lightY);
            this.ctx.lineTo(this.canvas.width - 10, lightY);
            this.ctx.stroke();

            // Heavy particle center line
            this.ctx.beginPath();
            this.ctx.moveTo(10, heavyY);
            this.ctx.lineTo(this.canvas.width - 10, heavyY);
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    /**
     * Draw energy flow visualization
     */
    drawEnergyFlow() {
        const time = this.simulationTime * 3;
        const flowCount = 5;

        for (let i = 0; i < flowCount; i++) {
            const x = this.canvas.width * 0.1 + i * (this.canvas.width * 0.8 / flowCount);
            const baseY = this.canvas.height * 0.8;
            const flowY = baseY + Math.sin(time + i) * 20;

            this.ctx.save();
            this.ctx.fillStyle = `rgba(255, 68, 68, ${0.6 + 0.4 * Math.sin(time + i)})`;
            this.ctx.beginPath();
            this.ctx.arc(x, flowY, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    /**
     * Draw particles with enhanced physics-based appearance
     */
    drawParticlesEnhanced() {
        const system = this.ionSystems[this.currentIonSystem];
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Calculate physics data for enhanced appearance
            const physicsData = this.calculateParticleDistribution(particle);
            const concentrationFactor = Math.abs(physicsData.concentrationRatio);
            
            // Adjust appearance based on concentration
            const alpha = 0.4 + (concentrationFactor * 0.6);
            const size = particle.baseSize * (0.8 + concentrationFactor * 0.4);
            
            this.ctx.globalAlpha = alpha;
            
            // Glow effect based on physics state
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = size * (1 + concentrationFactor);
            
            // Main particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Charge symbol with enhanced visibility
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1.0;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = `${size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            const chargeSymbol = particle.type === 'anion' ? '−' : '＋';
            this.ctx.fillText(chargeSymbol, particle.x, particle.y);
            
            this.ctx.restore();
            
            // Draw particle trails with physics-based opacity
            if (this.options.showTrails && particle.trail) {
                this.drawParticleTrail(particle, concentrationFactor);
            }
        });
    }

    /**
     * Draw particle trail with physics-based appearance
     */
    drawParticleTrail(particle, concentrationFactor) {
        if (particle.trail.length < 2) return;
        
        this.ctx.save();
        this.ctx.strokeStyle = particle.color;
        this.ctx.lineWidth = 1 + concentrationFactor;
        this.ctx.globalAlpha = 0.3 * (1 + concentrationFactor);
        
        this.ctx.beginPath();
        this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        
        for (let i = 1; i < particle.trail.length; i++) {
            this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draw concentration distribution heatmap
     */
    drawConcentrationDistribution() {
        const gridSize = 20;
        const cols = Math.ceil(this.canvas.width / gridSize);
        const rows = Math.ceil(this.canvas.height / gridSize);
        
        // Calculate concentration grid
        const concentrationGrid = this.calculateConcentrationGrid(cols, rows, gridSize);
        
        // Draw heatmap
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const anionConc = concentrationGrid[row][col].anion;
                const cationConc = concentrationGrid[row][col].cation;
                
                // Calculate net charge density
                const netCharge = anionConc - cationConc;
                const intensity = Math.abs(netCharge);
                const hue = netCharge > 0 ? 240 : 0; // Blue for negative, red for positive
                
                if (intensity > 0.1) {
                    this.ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${intensity * 0.3})`;
                    this.ctx.fillRect(
                        col * gridSize, 
                        row * gridSize, 
                        gridSize, 
                        gridSize
                    );
                }
            }
        }
    }

    /**
     * Calculate concentration grid for heatmap
     */
    calculateConcentrationGrid(cols, rows, gridSize) {
        const grid = Array(rows).fill().map(() => 
            Array(cols).fill().map(() => ({ anion: 0, cation: 0 }))
        );
        
        this.particles.forEach(particle => {
            const col = Math.floor(particle.x / gridSize);
            const row = Math.floor(particle.y / gridSize);
            
            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                const physicsData = this.calculateParticleDistribution(particle);
                const weight = Math.abs(physicsData.concentrationRatio);
                
                if (particle.type === 'anion') {
                    grid[row][col].anion += weight;
                } else {
                    grid[row][col].cation += weight;
                }
            }
        });
        
        return grid;
    }

    /**
     * Draw concentration contour lines
     */
    drawConcentrationContours() {
        // Implementation for contour lines would go here
        // This is a simplified version showing concentration gradients
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 4]);
        
        // Draw horizontal gradient lines
        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    /**
     * Draw electric field lines for field visualization mode
     */
    drawElectricFieldLines() {
        const fieldLineCount = 12;
        const stepSize = 5;
        
        for (let i = 0; i < fieldLineCount; i++) {
            const startX = (this.canvas.width / fieldLineCount) * i + 
                          (this.canvas.width / fieldLineCount) / 2;
            const startY = this.canvas.height - 10;
            
            this.traceFieldLine(startX, startY, stepSize);
        }
        
        // Draw field strength indicators
        this.drawFieldStrengthIndicators();
    }

    /**
     * Trace electric field line
     */
    traceFieldLine(startX, startY, stepSize) {
        let x = startX;
        let y = startY;
        const points = [{ x, y }];
        
        // Maximum steps to prevent infinite loops
        const maxSteps = Math.floor(this.canvas.height / stepSize);
        
        for (let step = 0; step < maxSteps; step++) {
            // Calculate field strength at current position
            const fieldStrength = this.calculateElectricFieldStrength({ x, y });
            const fieldDirection = fieldStrength > 0 ? -1 : 1; // Field direction
            
            // Move to next point
            y += stepSize * fieldDirection;
            
            if (y < 0 || y > this.canvas.height) break;
            
            points.push({ x, y });
        }
        
        // Draw field line
        if (points.length > 1) {
            this.ctx.strokeStyle = '#00FF88';
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.7;
            
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            
            this.ctx.stroke();
            
            // Draw arrow indicating direction
            this.drawFieldArrow(points);
        }
    }

    /**
     * Draw field arrow indicating direction
     */
    drawFieldArrow(points) {
        if (points.length < 3) return;
        
        const midIndex = Math.floor(points.length / 2);
        const point = points[midIndex];
        const nextPoint = points[midIndex + 1];
        
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
        const arrowLength = 8;
        
        this.ctx.save();
        this.ctx.translate(point.x, point.y);
        this.ctx.rotate(angle);
        
        this.ctx.fillStyle = '#00FF88';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-arrowLength, -arrowLength / 2);
        this.ctx.lineTo(-arrowLength, arrowLength / 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * Draw field strength indicators
     */
    drawFieldStrengthIndicators() {
        // Draw field strength visualization
        const indicatorCount = 6;
        
        for (let i = 0; i < indicatorCount; i++) {
            const x = this.canvas.width * 0.9;
            const y = (this.canvas.height / indicatorCount) * i + (this.canvas.height / indicatorCount) / 2;
            
            const fieldStrength = this.calculateElectricFieldStrength({ x, y });
            const normalizedStrength = Math.abs(fieldStrength) / 1000; // Normalize for visualization
            
            this.ctx.save();
            this.ctx.fillStyle = `rgba(0, 255, 136, ${normalizedStrength})`;
            this.ctx.fillRect(x - 10, y - 2, 20 * normalizedStrength, 4);
            this.ctx.restore();
        }
    }

    /**
     * Draw scientific annotations and formulas
     */
    drawScientificAnnotations() {
        this.ctx.save();
        
        // Draw region labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        
        // Current ion system info
        const system = this.ionSystems[this.currentIonSystem];
        this.ctx.fillText(`離子系統: ${system.name}`, 20, 30);
        this.ctx.fillText(`功率密度: ${system.maxPower.toFixed(2)} W/m³`, 20, 50);
        
        // Physics formulas
        if (this.showFormulas) {
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.fillText('波茲曼分布: C(h+Δh)/C(h) = exp(-mGΔh/kT)', 20, this.canvas.height - 60);
            this.ctx.fillText('電場強度: E = (m₊ - m₋)G/2q', 20, this.canvas.height - 40);
        }
        
        this.ctx.restore();
    }

    /**
     * Destroy the simulator
     */
    destroy() {
        this.stop();
        this.particles = [];
        this.electricField = [];

        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Initialize interactive particle simulator when DOM is ready
let interactiveSimulator;

const initInteractiveSimulator = () => {
    const canvas = Utils.DOM.select('#scientific-particle-canvas');
    if (canvas) {
        interactiveSimulator = new InteractiveParticleSimulator('#scientific-particle-canvas', {
            particleCount: Utils.Device.isMobile() ? 80 : 120,
            showElectricField: true,
            showTrails: true
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveSimulator);
} else {
    initInteractiveSimulator();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InteractiveParticleSimulator };
}

// Make available globally
window.ParticleSimulator = { InteractiveParticleSimulator, instance: interactiveSimulator };