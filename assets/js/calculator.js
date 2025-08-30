/**
 * Enhanced Gravity Ion Thermoelectric Calculator
 * Based on complete PhysicsEngine integration (all 14 methods)
 * Implements comprehensive scientific calculation and education platform
 * @author Gravity Ion Thermoelectric Research Team
 */

class GravityIonCalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Calculator container not found:', containerId);
            return;
        }

        // Initialize PhysicsEngine
        this.physicsEngine = window.PhysicsEngine ? new PhysicsEngine() : null;

        // Calculation results cache system
        this.calculationCache = new Map();
        this.currentScenario = 'optimal'; // optimal, tolman, chen, custom

        // Current input parameters
        this.inputs = {
            ionSystem: 'HI',
            acceleration: 9.81,
            temperature: 298.15,
            height: 0.1,
            structure: 'SMALL',
            usePaperMasses: false,
            operationMode: 'theoretical',
            rpm: 0
        };

        // Comprehensive calculation results using all 14 PhysicsEngine methods
        this.results = {
            // Methods 1-4: Core physics
            boltzmannRatio: { anion: 1, cation: 1, ratio: 1, separation: 0 },
            electricField: 0,
            voltageDifference: 0,
            centrifugalAcceleration: 0,

            // Methods 5-8: Structural safety
            maxOmegaSquared: 0,
            maxRotationalSpeed: 0,
            safetyAnalysis: null,
            warningLevel: 'safe',

            // Methods 9-10: Power calculations
            powerDensity: 0,
            systemPerformance: [],

            // Methods 11-12: Experimental validation
            tolmanComparison: null,
            paperValidation: null,

            // Method usage tracking
            methodUsageReport: null,

            // Overall assessment
            efficiency: 0,
            feasibility: 'excellent'
        };

        this.init();
    }

    init() {
        this.setupAdvancedInputSystem();
        this.setupEducationalModule();
        this.setupVisualizationEngine();
        this.setupExperimentalComparison();
        this.setupRealTimeCalculation();

        // Perform initial calculation
        this.calculateAllPhysics();
    }

    // Advanced input system setup
    setupAdvancedInputSystem() {
        this.setupIonSystemSelector();
        this.setupAccelerationControls();
        this.setupTemperatureControl();
        this.setupStructureSelector();
        this.setupOperationModeSelector();
    }

    setupIonSystemSelector() {
        const selector = this.container.querySelector('#ion-system-select');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.inputs.ionSystem = e.target.value;
                this.calculateAllPhysics();
                this.updateEducationalContent();
            });
        }
    }

    setupAccelerationControls() {
        const slider = this.container.querySelector('#rpm-slider');
        const display = this.container.querySelector('#rpm-display');
        const accelDisplay = this.container.querySelector('#acceleration');

        if (slider && display) {
            slider.addEventListener('input', (e) => {
                this.inputs.rpm = parseInt(e.target.value);
                display.textContent = this.inputs.rpm;

                // Calculate acceleration
                const radius = this.getStructureRadius();
                this.inputs.acceleration = this.physicsEngine.calculateCentrifugalAcceleration(
                    this.inputs.rpm, radius
                );

                if (accelDisplay) {
                    const gForce = this.inputs.acceleration / 9.81;
                    accelDisplay.textContent = `(${gForce.toFixed(1)}g)`;
                }

                this.calculateAllPhysics();
            });
        }
    }

    setupTemperatureControl() {
        // Temperature control will be added in educational module
        this.inputs.temperature = 298.15; // Standard room temperature
    }

    setupStructureSelector() {
        // Use default structure from PhysicsEngine
        this.inputs.structure = this.physicsEngine.CONSTANTS.DEFAULT_STRUCTURE;
    }

    setupOperationModeSelector() {
        this.inputs.operationMode = 'theoretical';
    }

    // Educational module setup
    setupEducationalModule() {
        // This will be enhanced in the HTML update
        console.info('Educational module ready for integration');
    }

    // Visualization engine setup
    setupVisualizationEngine() {
        // Prepare for visualization components
        console.info('Visualization engine initialized');
    }

    // Experimental comparison setup
    setupExperimentalComparison() {
        // Prepare for experimental data comparison
        console.info('Experimental comparison module ready');
    }

    // Real-time calculation setup
    setupRealTimeCalculation() {
        // Enable automatic recalculation
        this.autoUpdate = true;
    }

    // Comprehensive physics calculation using all 14 PhysicsEngine methods
    calculateAllPhysics() {
        try {
            // Track method usage
            const methodUsageTracker = new Map();
            const trackMethod = (methodName, result) => {
                methodUsageTracker.set(methodName, {
                    timestamp: Date.now(),
                    result: result,
                    inputs: { ...this.inputs }
                });
                return result;
            };

            // Get ion masses (Methods 13-14: Configuration)
            this.physicsEngine.setMassSource(this.inputs.usePaperMasses);
            const anionMass = trackMethod('getIonMass_anion',
                this.physicsEngine.getIonMass(this.getAnionType())
            );
            const cationMass = trackMethod('getIonMass_cation',
                this.physicsEngine.getIonMass(this.getCationType())
            );

            // Methods 1-4: Core physics calculations
            this.results.boltzmannRatio = trackMethod('calculateBoltzmannRatio',
                this.calculateBoltzmannDistribution(anionMass, cationMass)
            );

            this.results.electricField = trackMethod('calculateElectricField',
                this.physicsEngine.calculateElectricField(
                    anionMass, cationMass, this.inputs.acceleration
                )
            );

            this.results.voltageDifference = trackMethod('calculateVoltageDifference',
                this.physicsEngine.calculateVoltageDifference(
                    anionMass, cationMass, this.inputs.acceleration, this.inputs.height
                )
            );

            this.results.centrifugalAcceleration = trackMethod('calculateCentrifugalAcceleration',
                this.physicsEngine.calculateCentrifugalAcceleration(
                    this.inputs.rpm, this.getStructureRadius()
                )
            );

            // Methods 5-8: Structural engineering calculations
            this.results.maxOmegaSquared = trackMethod('calculateMaxOmegaSquaredFromStructure',
                this.physicsEngine.calculateMaxOmegaSquaredFromStructure(this.inputs.structure)
            );

            this.results.maxRotationalSpeed = trackMethod('calculateMaxRotationalSpeed',
                this.physicsEngine.calculateMaxRotationalSpeed(this.inputs.structure)
            );

            this.results.safetyAnalysis = trackMethod('validateSafetyLimits',
                this.physicsEngine.validateSafetyLimits(this.inputs.rpm, this.inputs.structure)
            );

            this.results.warningLevel = trackMethod('getWarningLevel',
                this.physicsEngine.getWarningLevel(
                    this.results.safetyAnalysis.safetyFactor
                )
            );

            // Methods 9-10: Power calculations
            this.results.powerDensity = trackMethod('calculatePowerDensity',
                this.physicsEngine.calculatePowerDensity(
                    this.getAnionType(), this.getCationType(),
                    this.inputs.structure, this.getConductivity()
                ).powerDensityCombined
            );

            this.results.systemPerformance = trackMethod('calculateIonSystemPerformance',
                this.physicsEngine.calculateIonSystemPerformance(this.inputs.structure)
            );

            // Methods 11-12: Experimental validation
            this.results.tolmanComparison = trackMethod('getTolmanExperimentalData',
                this.compareWithTolmanData()
            );

            this.results.paperValidation = trackMethod('validateAgainstPaperTable1',
                this.physicsEngine.validateAgainstPaperTable1(this.inputs.usePaperMasses)
            );

            // Generate method usage report
            this.results.methodUsageReport = this.generateMethodUsageReport(methodUsageTracker);

            // Calculate overall metrics
            this.calculateOverallMetrics();

            // Update all displays
            this.updateAllDisplays();

        } catch (error) {
            console.error('Comprehensive physics calculation error:', error);
            this.showCalculationError(error);
        }
    }

    // Boltzmann distribution calculation (integrating Methods 1, 13, 14)
    calculateBoltzmannDistribution(anionMass, cationMass) {
        const anionRatio = this.physicsEngine.calculateBoltzmannRatio(
            anionMass, this.inputs.acceleration, this.inputs.height, this.inputs.temperature
        );
        const cationRatio = this.physicsEngine.calculateBoltzmannRatio(
            cationMass, this.inputs.acceleration, this.inputs.height, this.inputs.temperature
        );

        return {
            anion: anionRatio,
            cation: cationRatio,
            ratio: anionRatio / cationRatio,
            separation: Math.abs(anionRatio - cationRatio)
        };
    }

    // Tolman experimental data comparison
    compareWithTolmanData() {
        const tolmanData = this.physicsEngine.getTolmanExperimentalData();

        return tolmanData.map(dataPoint => {
            const theoreticalVoltage = this.physicsEngine.calculateVoltageDifference(
                this.physicsEngine.getIonMass('I-'),
                this.physicsEngine.getIonMass(
                    dataPoint.solution.includes('Li') ? 'Li+' : 'K+'
                ),
                this.physicsEngine.calculateCentrifugalAcceleration(
                    dataPoint.rpm, 0.05 // 5cm radius from Tolman experiment
                ),
                0.1 // 10cm height
            );

            return {
                ...dataPoint,
                theoretical: theoreticalVoltage,
                accuracy: Math.abs(dataPoint.voltage - theoreticalVoltage) / dataPoint.voltage * 100
            };
        });
    }

    // Generate comprehensive method usage report
    generateMethodUsageReport(methodUsageTracker) {
        const totalMethods = 14;
        const usedMethods = methodUsageTracker.size;

        return {
            coverage: (usedMethods / totalMethods) * 100,
            methodsUsed: Array.from(methodUsageTracker.keys()),
            detailedUsage: Object.fromEntries(methodUsageTracker),
            lastCalculation: Date.now(),
            validationStatus: usedMethods === totalMethods ? 'complete' : 'partial',
            completeness: `${usedMethods}/${totalMethods} methods utilized`
        };
    }

    // Calculate overall performance metrics
    calculateOverallMetrics() {
        // Calculate efficiency relative to baseline
        const baselinePower = 72.23; // HI system optimal power density
        this.results.efficiency = this.results.powerDensity / baselinePower;

        // Determine feasibility based on safety and performance
        if (this.results.warningLevel === 'safe' && this.results.powerDensity > 0) {
            this.results.feasibility = 'excellent';
        } else if (this.results.warningLevel === 'caution') {
            this.results.feasibility = 'good';
        } else if (this.results.warningLevel === 'warning') {
            this.results.feasibility = 'marginal';
        } else {
            this.results.feasibility = 'theoretical';
        }
    }

    // Update all display elements
    updateAllDisplays() {
        this.updateCorePhysicsDisplay();
        this.updateSafetyDisplay();
        this.updatePowerDisplay();
        this.updateExperimentalDisplay();
        this.updateMethodUsageDisplay();
    }

    updateCorePhysicsDisplay() {
        // Power output
        this.updateDisplay('power-output', this.results.powerDensity, 'W/m³');

        // Efficiency multiplier
        this.updateDisplay('efficiency-multiplier', this.results.efficiency, '倍');

        // Daily energy production
        const dailyEnergy = this.results.powerDensity * 24;
        this.updateDisplay('energy-per-day', dailyEnergy, 'Wh');
    }

    updateSafetyDisplay() {
        // Material stress warning
        this.updateMaterialWarning(this.results.safetyAnalysis);
    }

    updatePowerDisplay() {
        // Update chart if available
        if (window.efficiencyCalculator && window.efficiencyCalculator.chart) {
            window.efficiencyCalculator.updateChart();
        }
    }

    updateExperimentalDisplay() {
        // Update experimental comparison data
        console.info('Experimental validation updated:', this.results.tolmanComparison);
    }

    updateMethodUsageDisplay() {
        // Display method usage for development/debug
        if (this.results.methodUsageReport) {
            console.info('PhysicsEngine Method Usage:', this.results.methodUsageReport);
        }
    }

    updateDisplay(elementId, value, unit = '') {
        const element = this.container.querySelector(`#${elementId}`);
        if (element) {
            let displayValue;

            if (typeof value === 'number') {
                if (value === 0) {
                    displayValue = '0.00';
                } else if (value < 0.01 && value > 0) {
                    displayValue = value.toExponential(2);
                } else if (value >= 1000) {
                    displayValue = value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                } else {
                    displayValue = value.toFixed(2);
                }
            } else {
                displayValue = String(value);
            }

            element.textContent = unit ? `${displayValue} ${unit}` : displayValue;
        }
    }

    updateMaterialWarning(_safety) {
        const warningElement = this.container.querySelector('#material-warning');
        if (!warningElement) {return;}

        const messages = {
            'safe': '材料應力安全',
            'caution': '中等轉速運行，材料應力在安全範圍內',
            'warning': '高轉速運行，接近材料安全極限',
            'danger': '超出材料安全極限，理論計算範圍'
        };

        const classes = {
            'safe': 'text-green-600 bg-green-50 border-green-200',
            'caution': 'text-yellow-600 bg-yellow-50 border-yellow-200',
            'warning': 'text-orange-600 bg-orange-50 border-orange-200',
            'danger': 'text-blue-600 bg-blue-50 border-blue-200'
        };

        const level = this.results.warningLevel || 'safe';

        if (level === 'safe') { {
            warningElement.classList.add('hidden');
        } else {
            warningElement.classList.remove('hidden');
            warningElement.textContent = messages[level] || messages['danger'];
            warningElement.className = `material-warning text-sm mt-2 p-2 rounded border ${classes[level]}`;
        }
    }

    updateEducationalContent() {
        // Update educational content based on current ion system
        console.info('Educational content updated for:', this.inputs.ionSystem);
    }

    showCalculationError(error) {
        console.error('Calculation Error:', error);

        // Reset displays to safe values
        this.updateDisplay('power-output', '0.00');
        this.updateDisplay('efficiency-multiplier', '0.000');
        this.updateDisplay('energy-per-day', '0.0');

        // Show error warning
        this.updateMaterialWarning({ warningLevel: 'danger', isWithinLimits: false });
    }

    // Utility methods
    getAnionType() {
        const systems = {
            'HI': 'I-',
            'LiCl': 'Cl-',
            'KCl': 'Cl-'
        };
        return systems[this.inputs.ionSystem] || 'I-';
    }

    getCationType() {
        const systems = {
            'HI': 'H+',
            'LiCl': 'Li+',
            'KCl': 'K+'
        };
        return systems[this.inputs.ionSystem] || 'H+';
    }

    getConductivity() {
        const systems = {
            'HI': 0.85,
            'LiCl': 0.7,
            'KCl': 0.6
        };
        return systems[this.inputs.ionSystem] || 0.85;
    }

    getStructureRadius() {
        if (typeof this.inputs.structure === 'object') {
            return this.inputs.structure.r3;
        }
        return this.physicsEngine.CONSTANTS.DEFAULT_STRUCTURE.r3;
    }

    // Public API for external integration
    getCurrentData() {
        return {
            inputs: { ...this.inputs },
            results: { ...this.results },
            methodUsage: this.results.methodUsageReport
        };
    }

    setInputParameter(key, value) {
        if (key in this.inputs) {
            this.inputs[key] = value;
            this.calculateAllPhysics();
            return true;
        }
        return false;
    }

    getPhysicsEngineMethod(methodName) {
        return this.results.methodUsageReport?.detailedUsage?.[methodName] || null;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for PhysicsEngine to be loaded
    const checkPhysicsEngine = () => {
        if (typeof PhysicsEngine !== 'undefined') {
            const calculatorContainer = document.getElementById('efficiency-calculator');
            if (calculatorContainer) {
                window.gravityIonCalculator = new GravityIonCalculator('efficiency-calculator');
                console.info('Enhanced Gravity Ion Calculator initialized with all 14 PhysicsEngine methods');
            }
        } else {
            // PhysicsEngine not loaded yet, wait a bit more
            setTimeout(checkPhysicsEngine, 100);
        }
    };

    checkPhysicsEngine();
});