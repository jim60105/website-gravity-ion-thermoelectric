/**
 * PhysicsEngine-Based Interactive Particle Simulator
 * Scientific-accurate visualization of gravity-induced ion separation
 * Based on Chen's paper and validated PhysicsEngine calculations
 * @author Gravity Ion Thermoelectric Research Team
 * @version 2.0.0
 */

/**
 * Physics-Based Interactive Particle Simulator
 * Integrates completely with PhysicsEngine for scientific accuracy
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
            animationSpeed: 1.0,
            showElectricField: true,
            showBoltzmannDistribution: true,
            showSafetyWarnings: true,
            ...options
        };

        // Initialize PhysicsEngine
        this.physicsEngine = window.PhysicsEngine ? new window.PhysicsEngine() : null;

        // Simulation state
        this.particles = [];
        this.electricFieldLines = [];
        this.concentrationLayers = [];
        this.isRunning = false;
        this.animationId = null;
        this.simulationTime = 0;

        // Physics parameters matching PhysicsEngine inputs
        this.acceleration = 9.81; // m/s² (1g default)
        this.temperature = 298.15; // K (room temperature)
        this.currentIonSystem = 'HI'; // Default to best performance system

        // Ion systems supported by PhysicsEngine
        this.ionSystems = {
            'HI': {
                anion: 'I-',
                cation: 'H+',
                name: '氫碘酸 (HI)',
                description: '最佳效能系統'
            },
            'LiCl': {
                anion: 'Cl-',
                cation: 'Li+',
                name: '氯化鋰 (LiCl)',
                description: 'Tolman 經典系統'
            },
            'KCl': {
                anion: 'Cl-',
                cation: 'K+',
                name: '氯化鉀 (KCl)',
                description: '穩定性佳'
            }
        };

        // Real-time measurements from PhysicsEngine
        this.measurements = {
            electricFieldStrength: 0,
            separationDegree: 0,
            currentDensity: 0,
            powerDensity: 0,
            safetyFactor: 0,
            isInSafeRange: true,
            boltzmannRatios: { anion: 1.0, cation: 1.0 }
        };

        this.init();
    }

    /**
     * Initialize the particle simulator
     */
    init() {
        this.setupCanvas();
        this.createPhysicsBasedParticleSystem();
        this.setupPhysicsEngineControls();
        this.setupMeasurementDisplay();
        this.start();
    }

    /**
     * Setup canvas dimensions and styling
     */
    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        this.canvas.width = rect.width;
        this.canvas.height = 384; // Fixed height for consistent simulation

        // Handle resize with physics recalculation
        window.addEventListener('resize', Utils.Performance.debounce(() => {
            this.setupCanvas();
            this.createPhysicsBasedParticleSystem();
            this.recalculatePhysics();
        }, 250));
    }

    /**
     * Create particle system based on PhysicsEngine calculations
     */
    createPhysicsBasedParticleSystem() {
        this.particles = [];
        const totalParticles = this.options.particleCount;

        // Get current ion system properties
        const system = this.ionSystems[this.currentIonSystem];
        const anionMass = this.physicsEngine.getIonMass(system.anion);
        const cationMass = this.physicsEngine.getIonMass(system.cation);

        // Create particles with realistic mass ratio
        const anionCount = Math.floor(totalParticles * 0.5);
        const cationCount = totalParticles - anionCount;

        // Create anions (lighter, negative charge)
        for (let i = 0; i < anionCount; i++) {
            this.particles.push(this.createIonParticle(system.anion, anionMass, -1));
        }

        // Create cations (heavier, positive charge)
        for (let i = 0; i < cationCount; i++) {
            this.particles.push(this.createIonParticle(system.cation, cationMass, +1));
        }

        // Calculate initial distribution using PhysicsEngine
        this.calculateInitialDistribution();

        // Create electric field visualization
        this.createElectricFieldVisualization();
    }

    /**
     * Create an ion particle with realistic physics properties
     */
    createIonParticle(ionType, mass, charge) {
        const particle = {
            ionType,
            mass,
            charge,
            x: Utils.MathUtils.random(5, this.canvas.width - 5),
            y: Utils.MathUtils.random(5, this.canvas.height - 5),
            vx: Utils.MathUtils.random(-0.5, 0.5),
            vy: Utils.MathUtils.random(-0.5, 0.5),
            size: charge > 0 ? 6 : 4, // Cations slightly larger for visibility
            color: charge > 0 ? '#00BFFF' : '#FFD700', // Blue for cations, gold for anions
            type: charge > 0 ? 'cation' : 'anion',
            trail: [],
            opacity: Utils.MathUtils.random(0.7, 1.0),
            equilibriumY: 0, // Will be calculated by PhysicsEngine
            concentrationRatio: 1.0,
            equilibriumReached: false
        };

        return particle;
    }

    /**
     * Calculate initial particle distribution using Boltzmann distribution
     */
    calculateInitialDistribution() {
        const heightRange = this.canvas.height;
        const centerY = heightRange / 2;

        this.particles.forEach(particle => {
            // Convert canvas position to height difference (meters)
            const heightDiff = (centerY - particle.y) / 100; // 100px = 1m scale

            // Calculate concentration ratio using PhysicsEngine
            particle.concentrationRatio = this.physicsEngine.calculateBoltzmannRatio(
                particle.mass,
                this.acceleration,
                heightDiff,
                this.temperature
            );

            // Calculate equilibrium position based on mass and acceleration
            const massRatio = particle.mass / 1e-26; // Normalize to typical ion mass
            const gravityEffect = this.acceleration / 9.81; // Relative to earth gravity

            if (particle.charge > 0) {
                // Heavier cations settle toward bottom
                particle.equilibriumY = centerY + (massRatio * gravityEffect * 50);
            } else {
                // Lighter anions rise toward top
                particle.equilibriumY = centerY - (massRatio * gravityEffect * 30);
            }

            // Clamp to canvas bounds
            particle.equilibriumY = Utils.MathUtils.clamp(
                particle.equilibriumY,
                particle.size,
                this.canvas.height - particle.size
            );
        });
    }

    /**
     * Create electric field visualization based on PhysicsEngine calculations
     */
    createElectricFieldVisualization() {
        this.electricFieldLines = [];

        // Get current ion system
        const system = this.ionSystems[this.currentIonSystem];
        const anionMass = this.physicsEngine.getIonMass(system.anion);
        const cationMass = this.physicsEngine.getIonMass(system.cation);

        // Calculate electric field strength using PhysicsEngine
        const fieldStrength = this.physicsEngine.calculateElectricField(
            cationMass, // heavier ion
            anionMass,  // lighter ion
            this.acceleration
        );

        // Create field lines for visualization
        const lineCount = Math.max(5, Math.min(12, Math.floor(fieldStrength / 10) + 5));

        for (let i = 0; i < lineCount; i++) {
            const x = (this.canvas.width / (lineCount + 1)) * (i + 1);
            this.electricFieldLines.push({
                x,
                strength: fieldStrength,
                direction: 1, // Electric field points upward (from + to -)
                opacity: Math.min(1.0, fieldStrength / 100),
                startY: this.canvas.height * 0.8, // Start from positive region
                endY: this.canvas.height * 0.2    // End at negative region
            });
        }
    }

    /**
     * Setup PhysicsEngine-based interactive controls
     */
    setupPhysicsEngineControls() {
        // Acceleration multiple slider (replacing gravity slider)
        const accelerationSlider = Utils.DOM.select('#gravity-slider');
        const accelerationValue = Utils.DOM.select('#gravity-value');

        if (accelerationSlider && accelerationValue) {
            // Update slider to handle acceleration multiples (1-100g)
            accelerationSlider.min = '1';
            accelerationSlider.max = '100';
            accelerationSlider.step = '1';
            accelerationSlider.value = '1';

            Utils.DOM.on(accelerationSlider, 'input', (e) => {
                const gMultiple = parseFloat(e.target.value);
                this.acceleration = gMultiple * 9.81; // Convert to m/s²
                accelerationValue.textContent = `${gMultiple}g (${this.acceleration.toFixed(1)} m/s²)`;
                this.recalculatePhysics();
                this.validateSafety();
            });
        }

        // Temperature slider (replacing thermal vibration)
        const temperatureSlider = Utils.DOM.select('#temperature-slider');
        const temperatureValue = Utils.DOM.select('#temperature-value');

        if (temperatureSlider && temperatureValue) {
            // Update slider for temperature range (200-400K)
            temperatureSlider.min = '200';
            temperatureSlider.max = '400';
            temperatureSlider.step = '5';
            temperatureSlider.value = '298.15';

            Utils.DOM.on(temperatureSlider, 'input', (e) => {
                this.temperature = parseFloat(e.target.value);
                const celsius = this.temperature - 273.15;
                temperatureValue.textContent = `${this.temperature}K (${celsius.toFixed(1)}°C)`;
                this.recalculatePhysics();
            });
        }

        // Ion system selector (new control)
        this.setupIonSystemSelector();

        // Reset button
        const resetButton = Utils.DOM.select('#reset-simulation');
        if (resetButton) {
            Utils.DOM.on(resetButton, 'click', () => {
                this.resetSimulation();
            });
        }
    }

    /**
     * Setup ion system selector
     */
    setupIonSystemSelector() {
        // This will be handled by HTML update later
        // For now, create a simple method to change ion systems
        this.changeIonSystem = (systemKey) => {
            if (this.ionSystems[systemKey]) {
                this.currentIonSystem = systemKey;
                this.recalculatePhysics();
                this.createPhysicsBasedParticleSystem();
            }
        };
    }

    /**
     * Recalculate physics based on current parameters
     */
    recalculatePhysics() {
        // Recalculate particle distributions
        this.calculateInitialDistribution();

        // Update electric field visualization
        this.createElectricFieldVisualization();

        // Update measurements using PhysicsEngine
        this.updatePhysicsEngineMeasurements();

        // Reset equilibrium state
        this.resetEquilibrium();
    }

    /**
     * Validate safety limits using PhysicsEngine
     */
    validateSafety() {
        // Convert acceleration to RPM for safety validation
        const rpm = this.accelerationToRPM(this.acceleration);
        const safetyResult = this.physicsEngine.validateSafetyLimits(rpm);

        this.measurements.safetyFactor = safetyResult.safetyFactor;
        this.measurements.isInSafeRange = safetyResult.isWithinLimits;

        // Show safety warnings if needed
        if (!safetyResult.isWithinLimits && this.options.showSafetyWarnings) {
            this.showSafetyWarning(safetyResult);
        }
    }

    /**
     * Convert acceleration to RPM (rough estimation for safety validation)
     */
    accelerationToRPM(acceleration) {
        // Assuming average radius of 0.005m (from default structure)
        const radius = 0.005;
        const omegaSquared = acceleration / radius;
        const omega = Math.sqrt(omegaSquared);
        return (omega * 60) / (2 * Math.PI);
    }

    /**
     * Show safety warning
     */
    showSafetyWarning(safetyResult) {
        // This could be enhanced with a proper warning UI
        console.warn(`Safety limit exceeded! Current safety factor: ${safetyResult.safetyFactor.toFixed(2)}`);
    }

    /**
     * Update measurements using PhysicsEngine calculations
     */
    updatePhysicsEngineMeasurements() {
        const system = this.ionSystems[this.currentIonSystem];
        const anionMass = this.physicsEngine.getIonMass(system.anion);
        const cationMass = this.physicsEngine.getIonMass(system.cation);

        // Calculate electric field strength
        this.measurements.electricFieldStrength = this.physicsEngine.calculateElectricField(
            cationMass,
            anionMass,
            this.acceleration
        );

        // Calculate power density for current system
        const powerResult = this.physicsEngine.calculatePowerDensity(
            system.anion,
            system.cation
        );
        this.measurements.powerDensity = powerResult.powerDensityCombined;

        // Calculate Boltzmann ratios for different heights
        const heightDiff = 0.1; // 10cm reference height
        this.measurements.boltzmannRatios.anion = this.physicsEngine.calculateBoltzmannRatio(
            anionMass,
            this.acceleration,
            heightDiff,
            this.temperature
        );
        this.measurements.boltzmannRatios.cation = this.physicsEngine.calculateBoltzmannRatio(
            cationMass,
            this.acceleration,
            heightDiff,
            this.temperature
        );

        // Calculate separation degree based on Boltzmann ratios
        const ratioForce = Math.abs(this.measurements.boltzmannRatios.cation - this.measurements.boltzmannRatios.anion);
        this.measurements.separationDegree = Math.min(100, ratioForce * 100);

        // Estimate current density based on electric field and separation
        this.measurements.currentDensity = this.measurements.electricFieldStrength *
                                         this.measurements.separationDegree * 0.01;
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

        // Reset to default values
        this.acceleration = 9.81;     // 1g
        this.temperature = 298.15;    // Room temperature
        this.currentIonSystem = 'HI'; // Best performance system

        // Recreate particle system with default parameters
        this.createPhysicsBasedParticleSystem();
        this.simulationTime = 0;

        // Reset sliders to default values
        const accelerationSlider = Utils.DOM.select('#gravity-slider');
        const temperatureSlider = Utils.DOM.select('#temperature-slider');
        const accelerationValue = Utils.DOM.select('#gravity-value');
        const temperatureValue = Utils.DOM.select('#temperature-value');

        if (accelerationSlider) {
            accelerationSlider.value = '1';
            if (accelerationValue) {
                accelerationValue.textContent = '1g (9.81 m/s²)';
            }
        }

        if (temperatureSlider) {
            temperatureSlider.value = '298.15';
            if (temperatureValue) {
                temperatureValue.textContent = '298.15K (25.0°C)';
            }
        }

        // Restart simulation
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
     * Update particle physics using PhysicsEngine calculations
     */
    updatePhysics() {
        this.simulationTime += 0.016; // Assume 60fps

        this.particles.forEach(particle => {
            // Calculate height difference from center for Boltzmann distribution
            const centerY = this.canvas.height / 2;
            const heightDiff = (centerY - particle.y) / 100; // Convert pixels to meters (100px = 1m)

            // Use PhysicsEngine to calculate concentration ratio at current position
            const concentrationRatio = this.physicsEngine.calculateBoltzmannRatio(
                particle.mass,
                this.acceleration,
                heightDiff,
                this.temperature
            );

            particle.concentrationRatio = concentrationRatio;

            // Calculate forces based on physics

            // 1. Gravitational/centrifugal force (normalized for visualization)
            const gravityForce = (this.acceleration / 9.81) * particle.mass * 0.02;
            particle.vy += gravityForce;

            // 2. Electric force based on PhysicsEngine electric field calculation
            const system = this.ionSystems[this.currentIonSystem];
            const anionMass = this.physicsEngine.getIonMass(system.anion);
            const cationMass = this.physicsEngine.getIonMass(system.cation);

            const electricFieldStrength = this.physicsEngine.calculateElectricField(
                cationMass,
                anionMass,
                this.acceleration
            );

            // Apply electric force (F = qE) - normalized for visualization
            const electricForce = particle.charge * electricFieldStrength * 0.0001;
            particle.vy -= electricForce; // Electric field points upward

            // 3. Thermal motion based on temperature (Brownian motion)
            const thermalFactor = Math.sqrt(this.temperature / 298.15); // Normalize to room temperature
            const thermalForceX = (Math.random() - 0.5) * thermalFactor * 0.08;
            const thermalForceY = (Math.random() - 0.5) * thermalFactor * 0.08;

            particle.vx += thermalForceX;
            particle.vy += thermalForceY;

            // 4. Apply equilibrium-seeking force (simulates settling to Boltzmann distribution)
            const equilibriumForce = (particle.equilibriumY - particle.y) * 0.001;
            particle.vy += equilibriumForce;

            // Update position
            particle.x += particle.vx * this.options.animationSpeed;
            particle.y += particle.vy * this.options.animationSpeed;

            // Boundary conditions
            this.handleBoundaryCollision(particle);

            // Apply damping (fluid resistance)
            particle.vx *= 0.995;
            particle.vy *= 0.998;

            // Limit velocity to prevent runaway motion
            const maxVel = 2.5;
            particle.vx = Utils.MathUtils.clamp(particle.vx, -maxVel, maxVel);
            particle.vy = Utils.MathUtils.clamp(particle.vy, -maxVel, maxVel);

            // Update trail for visualization
            this.updateParticleTrail(particle);

            // Check if particle reached equilibrium
            if (Math.abs(particle.y - particle.equilibriumY) < 5) {
                particle.equilibriumReached = true;
            }
        });

        // Update electric field visualization
        this.updateElectricFieldVisualization();

        // Update measurements using PhysicsEngine
        this.updatePhysicsEngineMeasurements();
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
        // For PhysicsEngine-based simulation, we always show some trail for educational purposes
        particle.trail.push({ x: particle.x, y: particle.y });

        // Limit trail length
        const maxTrailLength = Utils.Device.isMobile() ? 5 : 8;
        if (particle.trail.length > maxTrailLength) {
            particle.trail.shift();
        }
    }

    /**
     * Update electric field visualization
     */
    updateElectricFieldVisualization() {
        // Recalculate electric field lines based on current conditions
        this.createElectricFieldVisualization();
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

        // Electric field strength (simulated)
        this.measurements.electricFieldStrength = separationDegree * 100 * this.gravity;

        // Separation degree as percentage
        this.measurements.separationDegree = separationDegree * 100;

        // Current density (simulated based on electron flow)
        this.measurements.currentDensity = separationDegree * this.thermalEnergy * 0.5;

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
     * Render the simulation
     */
    render() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Boltzmann distribution background if enabled
        if (this.options.showBoltzmannDistribution) {
            this.drawBoltzmannDistribution();
        }

        // Draw electric field lines based on PhysicsEngine calculations
        if (this.options.showElectricField) {
            this.drawPhysicsEngineElectricField();
        }

        // Draw particle trails
        this.drawParticleTrails();

        // Draw particles with physics-based properties
        this.drawPhysicsBasedParticles();

        // Draw real-time measurements and annotations
        this.drawPhysicsAnnotations();

        // Draw safety warnings if needed
        if (!this.measurements.isInSafeRange && this.options.showSafetyWarnings) {
            this.drawSafetyWarning();
        }
    }

    /**
     * Draw Boltzmann distribution background
     */
    drawBoltzmannDistribution() {
        this.ctx.save();

        const centerY = this.canvas.height / 2;
        const steps = 20;

        for (let i = 0; i < steps; i++) {
            const y = (this.canvas.height / steps) * i;
            const heightDiff = (centerY - y) / 100; // Convert to meters

            const system = this.ionSystems[this.currentIonSystem];
            const anionMass = this.physicsEngine.getIonMass(system.anion);
            const cationMass = this.physicsEngine.getIonMass(system.cation);

            // Calculate concentration ratios
            const anionRatio = this.physicsEngine.calculateBoltzmannRatio(
                anionMass, this.acceleration, heightDiff, this.temperature
            );
            const cationRatio = this.physicsEngine.calculateBoltzmannRatio(
                cationMass, this.acceleration, heightDiff, this.temperature
            );

            // Create gradient based on ion concentration
            const anionIntensity = Math.min(0.3, anionRatio * 0.2);
            const cationIntensity = Math.min(0.3, cationRatio * 0.2);

            this.ctx.fillStyle = `rgba(255, 215, 0, ${anionIntensity})`; // Gold for anions
            this.ctx.fillRect(0, y, this.canvas.width / 2, this.canvas.height / steps);

            this.ctx.fillStyle = `rgba(0, 191, 255, ${cationIntensity})`; // Blue for cations
            this.ctx.fillRect(this.canvas.width / 2, y, this.canvas.width / 2, this.canvas.height / steps);
        }

        this.ctx.restore();
    }

    /**
     * Draw electric field lines based on PhysicsEngine calculations
     */
    drawPhysicsEngineElectricField() {
        this.ctx.save();

        this.electricFieldLines.forEach((fieldLine, index) => {
            if (fieldLine.strength > 0.1) {
                const time = this.simulationTime * 2 + index * 0.5;
                const opacity = fieldLine.opacity * (0.7 + 0.3 * Math.sin(time));

                // Field strength determines color intensity and line width
                const colorIntensity = Math.min(255, fieldLine.strength * 2);
                this.ctx.strokeStyle = `rgba(0, ${colorIntensity}, 136, ${opacity})`;
                this.ctx.lineWidth = 1 + Math.min(3, fieldLine.strength / 50);

                // Animated dashed line to show field direction
                this.ctx.setLineDash([6, 8]);
                this.ctx.lineDashOffset = -time * 10;

                // Draw field line from positive to negative region
                this.ctx.beginPath();
                this.ctx.moveTo(fieldLine.x, fieldLine.startY);
                this.ctx.lineTo(fieldLine.x, fieldLine.endY);
                this.ctx.stroke();

                // Draw arrows to indicate direction
                this.drawElectricFieldArrows(fieldLine.x, fieldLine.strength, opacity);
            }
        });

        this.ctx.restore();
    }

    /**
     * Draw arrows on electric field lines
     */
    drawElectricFieldArrows(x, strength, opacity) {
        const arrowCount = Math.floor(strength / 20) + 2;
        const arrowSize = 4 + strength / 50;

        for (let i = 1; i <= arrowCount; i++) {
            const y = this.canvas.height * (0.8 - (i / (arrowCount + 1)) * 0.6);

            this.ctx.fillStyle = `rgba(0, 255, 136, ${opacity * 0.8})`;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - arrowSize, y + arrowSize * 2);
            this.ctx.lineTo(x + arrowSize, y + arrowSize * 2);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    /**
     * Draw particles with physics-based properties
     */
    drawPhysicsBasedParticles() {
        this.ctx.save();

        this.particles.forEach(particle => {
            // Particle size varies with concentration ratio
            const sizeMultiplier = 0.8 + (particle.concentrationRatio * 0.4);
            const displaySize = particle.size * sizeMultiplier;

            // Opacity based on equilibrium state and concentration
            const baseOpacity = particle.equilibriumReached ? 0.9 : 0.7;
            const concentrationOpacity = Math.min(1.0, particle.concentrationRatio);
            const finalOpacity = baseOpacity * concentrationOpacity;

            // Draw particle with glow effect
            this.ctx.globalAlpha = finalOpacity;

            // Glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = displaySize * 2;

            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, displaySize, 0, Math.PI * 2);
            this.ctx.fill();

            // Reset shadow
            this.ctx.shadowBlur = 0;

            // Draw ion symbol
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${Math.max(8, displaySize)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            const symbol = particle.ionType.includes('+') ? '+' : '-';
            this.ctx.fillText(symbol, particle.x, particle.y);
        });

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

    /**
     * Draw particle trails
     */
    drawParticleTrails() {
        this.ctx.save();

        this.particles.forEach(particle => {
            if (particle.trail.length > 1) {
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.4;

                this.ctx.beginPath();
                this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);

                for (let i = 1; i < particle.trail.length; i++) {
                    this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }

                this.ctx.stroke();
            }
        });

        this.ctx.restore();
    }

    /**
     * Draw physics annotations and real-time data
     */
    drawPhysicsAnnotations() {
        this.ctx.save();

        // Draw system information
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';

        const system = this.ionSystems[this.currentIonSystem];
        this.ctx.fillText(`離子系統: ${system.name}`, 10, 20);
        this.ctx.fillText(`加速度: ${(this.acceleration / 9.81).toFixed(1)}g`, 10, 35);
        this.ctx.fillText(`溫度: ${this.temperature.toFixed(1)}K`, 10, 50);

        // Draw electric field strength
        this.ctx.fillText(`電場強度: ${this.measurements.electricFieldStrength.toFixed(2)} V/m`, 10, 70);

        // Draw safety status
        const safetyColor = this.measurements.isInSafeRange ? '#00ff88' : '#ff4444';
        this.ctx.fillStyle = safetyColor;
        this.ctx.fillText(
            `安全狀態: ${this.measurements.isInSafeRange ? '安全' : '警告'}`,
            10,
            85
        );

        this.ctx.restore();
    }

    /**
     * Draw safety warning
     */
    drawSafetyWarning() {
        this.ctx.save();

        // Draw warning background
        this.ctx.fillStyle = 'rgba(255, 68, 68, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw warning text
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillText(
            '⚠️ 安全限制超出 - 降低加速度!',
            this.canvas.width / 2,
            this.canvas.height / 2
        );

        this.ctx.restore();
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
            showBoltzmannDistribution: true,
            showSafetyWarnings: true
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