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
        return {
            x: Utils.MathUtils.random(5, this.canvas.width - 5),
            y: Utils.MathUtils.random(5, this.canvas.height - 5),
            vx: Utils.MathUtils.random(-0.5, 0.5),
            vy: Utils.MathUtils.random(-0.5, 0.5),
            mass: 0.3, // Light mass
            charge: -1, // Negative charge
            size: Utils.MathUtils.random(2, 4),
            color: '#FFD700', // Gold for light particles
            type: 'light',
            trail: [],
            opacity: Utils.MathUtils.random(0.7, 1.0),
            equilibriumReached: false
        };
    }

    /**
     * Create a heavy particle (positive ion)
     */
    createHeavyParticle() {
        return {
            x: Utils.MathUtils.random(5, this.canvas.width - 5),
            y: Utils.MathUtils.random(5, this.canvas.height - 5),
            vx: Utils.MathUtils.random(-0.3, 0.3),
            vy: Utils.MathUtils.random(-0.3, 0.3),
            mass: 1.5, // Heavy mass
            charge: 1, // Positive charge
            size: Utils.MathUtils.random(4, 7),
            color: '#00BFFF', // Blue for heavy particles
            type: 'heavy',
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
     * Update particle physics
     */
    updatePhysics() {
        this.simulationTime += 0.016; // Assume 60fps

        this.particles.forEach(particle => {
            // Apply gravitational force
            const gravityForce = this.gravity * particle.mass * 0.05;
            particle.vy += gravityForce;

            // Calculate electric field at particle position
            const electricFieldStrength = this.calculateElectricFieldAt(particle.y);

            // Apply electric force (F = qE)
            const electricForce = particle.charge * electricFieldStrength * 0.03;
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
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw electric field lines
        if (this.options.showElectricField) {
            this.drawElectricField();
        }

        // Draw particle trails
        if (this.options.showTrails) {
            this.drawParticleTrails();
        }

        // Draw particles
        this.drawParticles();

        // Draw additional visual effects
        this.drawVisualEffects();
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