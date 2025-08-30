/**
 * Physics Visualizer Module
 * Advanced visualization tools for gravity ion thermoelectric physics
 * Based on Chen's paper: "An Exception to Carnot's Theorem Inferred from Tolman's Experiment"
 */

/* global PhysicsEngine */

class PhysicsVisualizer {
    constructor() {
        this.physicsEngine = new PhysicsEngine();
        this.isActive = false;
        this.currentVisualization = null;
        this.animationId = null;

        // Visualization configuration
        this.config = {
            fieldLineCount: 12,
            concentrationGridSize: 20,
            particleTrailLength: 50,
            updateInterval: 100, // ms
            colors: {
                electricField: '#00FF88',
                positiveCharge: '#FF4444',
                negativeCharge: '#4488FF',
                equipotential: '#FFFF44',
                background: 'rgba(15, 23, 42, 0.8)'
            }
        };
    }

    /**
     * Initialize physics visualizer
     */
    init() {
        this.setupVisualizationMethods();
        console.log('Physics Visualizer initialized');
    }

    /**
     * Setup visualization methods for different physics phenomena
     */
    setupVisualizationMethods() {
        this.visualizations = {
            'boltzmann-distribution': this.renderBoltzmannDistribution.bind(this),
            'electric-field-3d': this.renderElectricField3D.bind(this),
            'ion-flow-dynamics': this.renderIonFlowDynamics.bind(this),
            'thermal-equilibrium': this.renderThermalEquilibrium.bind(this),
            'power-generation': this.renderPowerGeneration.bind(this)
        };
    }

    /**
     * Start a specific physics visualization
     * @param {string} type - Type of visualization
     * @param {HTMLCanvasElement} canvas - Target canvas
     * @param {Object} parameters - Physics parameters
     */
    startVisualization(type, canvas, parameters = {}) {
        if (this.isActive) {
            this.stopVisualization();
        }

        this.currentVisualization = type;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.parameters = { ...this.getDefaultParameters(), ...parameters };

        this.isActive = true;
        this.animate();

        console.log(`Started physics visualization: ${type}`);
    }

    /**
     * Stop current visualization
     */
    stopVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.isActive = false;
        this.currentVisualization = null;

        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Animation loop for physics visualization
     */
    animate() {
        if (!this.isActive) {return;}

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render current visualization
        if (this.visualizations[this.currentVisualization]) {
            this.visualizations[this.currentVisualization](this.ctx, this.parameters);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Get default physics parameters
     */
    getDefaultParameters() {
        return {
            temperature: 298, // K
            gravity: 9.81, // m/s²
            ionSystem: 'HI',
            electricField: 0,
            time: 0,
            concentration: {
                anion: 1.0,
                cation: 1.0
            }
        };
    }

    /**
     * Render Boltzmann distribution visualization
     */
    renderBoltzmannDistribution(ctx, params) {
        const { width, height } = this.canvas;
        const ionData = this.physicsEngine.calculateIonSystemPerformance()[0];

        // Draw concentration gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)'); // Gold for anions
        gradient.addColorStop(1, 'rgba(0, 191, 255, 0.8)'); // Blue for cations

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw distribution curve
        this.drawDistributionCurve(ctx, params);

        // Draw annotations
        this.drawBoltzmannAnnotations(ctx, params);
    }

    /**
     * Draw concentration distribution curve
     */
    drawDistributionCurve(ctx, params) {
        const { width, height } = this.canvas;
        const points = 100;

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);

        // Anion distribution (lighter ions, upper concentration)
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const y = (i / points) * height;
            const heightInMeters = ((height - y) / height) * 0.1; // 10cm scale

            const anionMass = this.physicsEngine.CONSTANTS.ION_MASSES['I-'];
            const ratio = this.physicsEngine.calculateBoltzmannRatio(
                anionMass, params.gravity, heightInMeters, params.temperature
            );

            const concentration = Math.exp(-ratio) * 0.5 + 0.1;
            const x = width * 0.2 + concentration * width * 0.3;

            if (i === 0) {ctx.moveTo(x, y);}
            else {ctx.lineTo(x, y);}
        }
        ctx.stroke();

        // Cation distribution (heavier ions, lower concentration)
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const y = (i / points) * height;
            const heightInMeters = ((height - y) / height) * 0.1;

            const cationMass = this.physicsEngine.CONSTANTS.ION_MASSES['H+'];
            const ratio = this.physicsEngine.calculateBoltzmannRatio(
                cationMass, params.gravity, heightInMeters, params.temperature
            );

            const concentration = Math.exp(-ratio) * 0.5 + 0.1;
            const x = width * 0.6 + concentration * width * 0.3;

            if (i === 0) {ctx.moveTo(x, y);}
            else {ctx.lineTo(x, y);}
        }
        ctx.stroke();
    }

    /**
     * Draw Boltzmann distribution annotations
     */
    drawBoltzmannAnnotations(ctx, params) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';

        // Title
        ctx.fillText('波茲曼分布 - 重力場中的離子濃度', 20, 30);

        // Formula
        ctx.font = '14px Arial';
        ctx.fillText('C(h+Δh)/C(h) = exp(-mGΔh/kT)', 20, 60);

        // Legend
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(20, 80, 20, 15);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('負離子 (I⁻) - 較輕', 50, 92);

        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(20, 100, 20, 15);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('正離子 (H⁺) - 較重', 50, 112);
    }

    /**
     * Render 3D electric field visualization
     */
    renderElectricField3D(ctx, params) {
        const { width, height } = this.canvas;

        // Clear background
        ctx.fillStyle = this.config.colors.background;
        ctx.fillRect(0, 0, width, height);

        // Calculate electric field strength
        const system = this.physicsEngine.calculateIonSystemPerformance()[0];
        const fieldStrength = system.electricField;

        // Draw 3D-style electric field lines
        this.drawElectricField3D(ctx, fieldStrength);

        // Draw field strength indicators
        this.drawFieldStrengthIndicators3D(ctx, fieldStrength);

        // Draw annotations
        this.drawElectricFieldAnnotations(ctx, fieldStrength);
    }

    /**
     * Draw 3D-style electric field lines
     */
    drawElectricField3D(ctx, fieldStrength) {
        const { width, height } = this.canvas;
        const lineCount = this.config.fieldLineCount;

        ctx.strokeStyle = this.config.colors.electricField;
        ctx.lineWidth = 2;

        for (let i = 0; i < lineCount; i++) {
            const startX = (width / lineCount) * i + (width / lineCount) / 2;
            const perspective = 0.8 + (i / lineCount) * 0.4; // Perspective effect

            ctx.save();
            ctx.globalAlpha = perspective;
            ctx.lineWidth = 2 * perspective;

            // Draw curved field line for 3D effect
            this.drawCurvedFieldLine(ctx, startX, height - 20, startX * 0.9, 20, fieldStrength);

            ctx.restore();
        }
    }

    /**
     * Draw curved field line with 3D perspective
     */
    drawCurvedFieldLine(ctx, startX, startY, endX, endY, fieldStrength) {
        const controlX = (startX + endX) / 2 + Math.sin(Date.now() * 0.001) * 20 * (fieldStrength / 1000);
        const controlY = (startY + endY) / 2;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();

        // Draw arrow at end
        this.drawArrow3D(ctx, endX, endY, Math.atan2(endY - controlY, endX - controlX));
    }

    /**
     * Draw 3D-style arrow
     */
    drawArrow3D(ctx, x, y, angle) {
        const arrowLength = 12;
        const arrowWidth = 6;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = this.config.colors.electricField;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowLength, -arrowWidth);
        ctx.lineTo(-arrowLength * 0.6, 0);
        ctx.lineTo(-arrowLength, arrowWidth);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    /**
     * Draw 3D field strength indicators
     */
    drawFieldStrengthIndicators3D(ctx, fieldStrength) {
        const { width, height } = this.canvas;
        const indicatorCount = 8;

        for (let i = 0; i < indicatorCount; i++) {
            const x = width * 0.9;
            const y = (height / indicatorCount) * i + (height / indicatorCount) / 2;
            const intensity = Math.abs(fieldStrength) / 1000;
            const size = intensity * 30 + 5;

            ctx.save();
            ctx.globalAlpha = intensity;
            ctx.fillStyle = this.config.colors.electricField;

            // Draw 3D-style indicator
            ctx.fillRect(x - size/2, y - 3, size, 6);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(x - size/2, y - 3, size, 2);

            ctx.restore();
        }
    }

    /**
     * Draw electric field annotations
     */
    drawElectricFieldAnnotations(ctx, fieldStrength) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';

        ctx.fillText('電場可視化 - 3D 透視圖', 20, 30);
        ctx.font = '14px Arial';
        ctx.fillText(`電場強度: ${fieldStrength.toFixed(2)} V/m`, 20, 55);
        ctx.fillText('E = (m₊ - m₋)G / 2q', 20, 80);
    }

    /**
     * Render ion flow dynamics visualization
     */
    renderIonFlowDynamics(ctx, params) {
        const { width, height } = this.canvas;

        // Clear background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, 0, width, height);

        // Draw flowing ions with physics-based movement
        this.drawFlowingIons(ctx, params);

        // Draw flow vectors
        this.drawFlowVectors(ctx, params);

        // Draw annotations
        this.drawFlowAnnotations(ctx, params);

        // Update time for animation
        params.time += 0.05;
    }

    /**
     * Draw flowing ions with realistic physics
     */
    drawFlowingIons(ctx, params) {
        const ionCount = 50;

        for (let i = 0; i < ionCount; i++) {
            const x = (i % 10) * (this.canvas.width / 10) + Math.sin(params.time + i) * 30;
            const y = (Math.floor(i / 10) * (this.canvas.height / 5)) +
                     Math.cos(params.time * 0.5 + i) * 20;

            const isAnion = i % 2 === 0;
            const velocity = this.calculateIonVelocity(x, y, isAnion, params);

            // Draw ion with trail
            this.drawIonWithTrail(ctx, x, y, velocity, isAnion);
        }
    }

    /**
     * Calculate ion velocity based on physics
     */
    calculateIonVelocity(x, y, isAnion, params) {
        const electricForce = isAnion ? -params.electricField : params.electricField;
        const thermalVelocity = Math.sqrt(params.temperature / 298) * 100;
        const gravityEffect = isAnion ? -9.81 : 9.81;

        return {
            vx: thermalVelocity * Math.cos(params.time) + electricForce * 0.1,
            vy: gravityEffect * 0.01 + thermalVelocity * Math.sin(params.time) * 0.1
        };
    }

    /**
     * Draw ion with motion trail
     */
    drawIonWithTrail(ctx, x, y, velocity, isAnion) {
        const color = isAnion ? this.config.colors.negativeCharge : this.config.colors.positiveCharge;
        const size = isAnion ? 4 : 6;

        // Draw trail
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - velocity.vx * 5, y - velocity.vy * 5);
        ctx.stroke();

        // Draw ion
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw charge symbol
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${size * 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isAnion ? '−' : '＋', x, y);
    }

    /**
     * Draw flow vectors
     */
    drawFlowVectors(ctx, params) {
        const vectorGrid = 8;
        const { width, height } = this.canvas;

        ctx.strokeStyle = '#FFFFFF';
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 2;

        for (let i = 0; i < vectorGrid; i++) {
            for (let j = 0; j < vectorGrid; j++) {
                const x = (width / vectorGrid) * i + (width / vectorGrid) / 2;
                const y = (height / vectorGrid) * j + (height / vectorGrid) / 2;

                const velocity = this.calculateIonVelocity(x, y, true, params);
                const length = Math.sqrt(velocity.vx * velocity.vx + velocity.vy * velocity.vy) * 0.5;
                const angle = Math.atan2(velocity.vy, velocity.vx);

                // Draw vector
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
                ctx.stroke();

                // Draw arrowhead
                this.drawArrow3D(ctx, x + Math.cos(angle) * length, y + Math.sin(angle) * length, angle);
            }
        }
    }

    /**
     * Draw flow annotations
     */
    drawFlowAnnotations(ctx, params) {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';

        ctx.fillText('離子流動動態學', 20, 30);
        ctx.font = '12px Arial';
        ctx.fillText('白色箭頭：流動方向', 20, 55);
        ctx.fillText('粒子軌跡：熱振動 + 電場 + 重力', 20, 75);
    }

    /**
     * Export current visualization as image
     */
    exportVisualization(filename = 'physics-visualization') {
        if (!this.canvas) {return null;}

        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = this.canvas.toDataURL();
        link.click();

        return link.href;
    }

    /**
     * Get visualization statistics
     */
    getVisualizationStats() {
        return {
            isActive: this.isActive,
            currentVisualization: this.currentVisualization,
            frameRate: this.animationId ? 60 : 0,
            parameters: this.parameters
        };
    }
}

// Initialize and export
window.PhysicsVisualizer = PhysicsVisualizer;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.physicsVisualizer = new PhysicsVisualizer();
        window.physicsVisualizer.init();
    });
} else {
    window.physicsVisualizer = new PhysicsVisualizer();
    window.physicsVisualizer.init();
}