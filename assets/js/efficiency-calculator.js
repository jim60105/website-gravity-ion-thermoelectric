/**
 * Scientific Efficiency Calculator for Gravity Ion Thermoelectric Technology
 * Based on Chen's paper: "An Exception to Carnot's Theorem Inferred from Tolman's Experiment"
 * Implements real physics formulas for ion distribution and power calculation
 * @author Gravity Ion Thermoelectric Research Team
 */

class EfficiencyCalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentRPM = 0;
        this.currentIonSystem = 'HI'; // Default to hydrogen iodide (most efficient)
        this.physicsEngine = new PhysicsEngine();
        this.chart = null;
        
        // Current structural parameters (can be adjusted)
        this.structure = {
            r1: 0.0025,    // Inner radius (m)
            r2: 0.00355,   // Outer radius (m)
            r3: 0.005,     // Distance to rotation axis (m)
            d: 0.0021      // Material thickness (m)
        };

        this.init();
    }

    init() {
        if (!this.container) {
            return;
        }

        this.setupControls();
        this.setupChart();
        this.updateCalculation(0);
    }

    setupControls() {
        // RPM slider
        const slider = this.container.querySelector('#rpm-slider');
        const rpmDisplay = this.container.querySelector('#rpm-display');

        if (slider && rpmDisplay) {
            slider.addEventListener('input', (e) => {
                this.currentRPM = parseInt(e.target.value);
                rpmDisplay.textContent = this.currentRPM;
                this.updateCalculation(this.currentRPM);
            });
        }

        // Ion system selector (if available)
        const ionSelector = this.container.querySelector('#ion-system-select');
        if (ionSelector) {
            ionSelector.addEventListener('change', (e) => {
                this.currentIonSystem = e.target.value;
                this.updateCalculation(this.currentRPM);
                this.updateChart();
            });
        }
    }

    setupChart() {
        const chartCanvas = this.container.querySelector('#efficiency-chart');
        if (!chartCanvas) {
            return;
        }

        const ctx = chartCanvas.getContext('2d');

        // Generate scientifically accurate data points
        const datasets = this.generateDatasets();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '轉速 (RPM)',
                            color: '#374151'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.3)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '功率密度 (W/m³)',
                            color: '#374151'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.3)'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                if (value < 0.01) {
                                    return `${context.dataset.label}: ${(value * 1000).toFixed(2)} mW/m³`;
                                }
                                return `${context.dataset.label}: ${value.toFixed(2)} W/m³`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    generateDatasets() {
        const maxRpm = 1000;
        const step = 25;
        
        // Generate data for different ion systems
        const ionSystems = [
            { anion: 'I-', cation: 'H+', name: 'HI (氫碘酸)', color: '#059669', conductivity: 0.85 },
            { anion: 'Cl-', cation: 'Li+', name: 'LiCl (氯化鋰)', color: '#0EA5E9', conductivity: 0.7 },
            { anion: 'Cl-', cation: 'K+', name: 'KCl (氯化鉀)', color: '#8B5CF6', conductivity: 0.6 }
        ];

        const datasets = ionSystems.map(system => {
            const dataPoints = [];
            
            for (let rpm = 0; rpm <= maxRpm; rpm += step) {
                try {
                    const power = this.calculateScientificPowerOutput(rpm, system);
                    dataPoints.push({ x: rpm, y: power });
                } catch (error) {
                    // If calculation fails (e.g., exceeds material limits), stop
                    break;
                }
            }

            return {
                label: system.name,
                data: dataPoints,
                borderColor: system.color,
                backgroundColor: system.color + '20',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            };
        });

        // Add current setting point
        datasets.push({
            label: '當前設定',
            data: [{ x: 0, y: 0 }],
            borderColor: '#EA580C',
            backgroundColor: '#EA580C',
            pointRadius: 8,
            pointHoverRadius: 10,
            showLine: false
        });

        // Add Tolman experimental data points
        const tolmanData = this.physicsEngine.getTolmanExperimentalData()
            .filter(point => point.rpm > 0)
            .map(point => ({
                x: point.rpm,
                y: this.estimatePowerFromTolmanData(point)
            }));

        if (tolmanData.length > 0) {
            datasets.push({
                label: 'Tolman 1910 實驗數據',
                data: tolmanData,
                borderColor: '#DC2626',
                backgroundColor: '#DC2626',
                pointRadius: 6,
                pointStyle: 'triangle',
                showLine: false
            });
        }

        return datasets;
    }

    calculateScientificPowerOutput(rpm, ionSystem = null) {
        if (rpm === 0) {
            return 0;
        }

        // Use current ion system if not specified
        if (!ionSystem) {
            const systems = {
                'HI': { anion: 'I-', cation: 'H+', conductivity: 0.85 },
                'LiCl': { anion: 'Cl-', cation: 'Li+', conductivity: 0.7 },
                'KCl': { anion: 'Cl-', cation: 'K+', conductivity: 0.6 }
            };
            ionSystem = systems[this.currentIonSystem] || systems['HI'];
        }

        // Check safety limits first
        const safety = this.physicsEngine.validateSafetyLimits(rpm, this.structure);
        if (!safety.isWithinLimits) {
            throw new Error('Exceeds material safety limits');
        }

        // Calculate centrifugal acceleration
        const acceleration = this.physicsEngine.calculateCentrifugalAcceleration(rpm, this.structure.r3);
        
        // Use effective height (inner radius for electrolyte column)
        const height = this.structure.r1;
        
        // Calculate power density using real physics
        const powerData = this.physicsEngine.calculatePowerDensity(
            ionSystem.anion,
            ionSystem.cation,
            acceleration,
            height,
            ionSystem.conductivity
        );

        return powerData.powerDensity;
    }

    estimatePowerFromTolmanData(tolmanPoint) {
        // Estimate power from Tolman's voltage measurements
        // This is a rough approximation based on V²/R
        const voltage = tolmanPoint.voltage;
        const estimatedConductivity = 0.5; // Approximate for solutions used in 1910
        const resistance = 1 / estimatedConductivity;
        return (voltage * voltage) / resistance;
    }

    updateCalculation(rpm) {
        try {
            // Get current ion system configuration
            const systems = {
                'HI': { anion: 'I-', cation: 'H+', conductivity: 0.85, name: '氫碘酸' },
                'LiCl': { anion: 'Cl-', cation: 'Li+', conductivity: 0.7, name: '氯化鋰' },
                'KCl': { anion: 'Cl-', cation: 'K+', conductivity: 0.6, name: '氯化鉀' }
            };
            
            const currentSystem = systems[this.currentIonSystem] || systems['HI'];
            
            // Calculate power output
            const powerOutput = this.calculateScientificPowerOutput(rpm, currentSystem);
            
            // Calculate additional metrics
            const acceleration = this.physicsEngine.calculateCentrifugalAcceleration(rpm, this.structure.r3);
            const safety = this.physicsEngine.validateSafetyLimits(rpm, this.structure);
            
            // Calculate efficiency relative to baseline (72 W/m³ at optimal conditions)
            const baselinePower = 72; // HI system at optimal conditions
            const efficiency = powerOutput / baselinePower;
            
            // Update display values
            this.updateDisplay('power-output', powerOutput.toFixed(2));
            this.updateDisplay('efficiency-multiplier', efficiency.toFixed(3));
            this.updateDisplay('energy-per-day', (powerOutput * 24).toFixed(1));
            
            // Update acceleration display if element exists
            this.updateDisplay('acceleration', `${(acceleration / 9.81).toFixed(1)}g`);
            
            // Update material stress warning with real physics
            this.updateMaterialWarning(safety);
            
            // Update chart current point
            if (this.chart) {
                const currentPointDataset = this.chart.data.datasets.find(ds => ds.label === '當前設定');
                if (currentPointDataset) {
                    currentPointDataset.data = [{ x: rpm, y: powerOutput }];
                    this.chart.update('none');
                }
            }
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.updateDisplay('power-output', '0.00');
            this.updateDisplay('efficiency-multiplier', '0.000');
            this.updateDisplay('energy-per-day', '0.0');
            this.updateMaterialWarning({ warningLevel: 'danger', isWithinLimits: false });
        }
    }

    updateDisplay(elementId, value) {
        const element = this.container.querySelector(`#${elementId}`);
        if (element) {
            element.textContent = value;
        }
    }

    updateMaterialWarning(safety) {
        const warningElement = this.container.querySelector('#material-warning');
        if (!warningElement) {
            return;
        }

        const messages = {
            'safe': '材料應力安全',
            'caution': '中等轉速運行，材料應力在安全範圍內',
            'warning': '高轉速運行，接近材料安全極限',
            'danger': '超出材料安全極限，可能導致結構失效'
        };

        const classes = {
            'safe': 'text-green-600 bg-green-50 border-green-200',
            'caution': 'text-yellow-600 bg-yellow-50 border-yellow-200',
            'warning': 'text-orange-600 bg-orange-50 border-orange-200',
            'danger': 'text-red-600 bg-red-50 border-red-200'
        };

        const level = safety.warningLevel || 'danger';
        
        if (level === 'safe') {
            warningElement.classList.add('hidden');
        } else {
            warningElement.classList.remove('hidden');
            warningElement.textContent = messages[level] || messages['danger'];
            warningElement.className = `material-warning text-sm mt-2 p-2 rounded border ${classes[level]}`;
        }
    }

    updateChart() {
        if (this.chart) {
            const newDatasets = this.generateDatasets();
            this.chart.data.datasets = newDatasets;
            this.chart.update();
        }
    }

    // Public method to get current scientific data
    getCurrentData() {
        try {
            const powerOutput = this.calculateScientificPowerOutput(this.currentRPM);
            const acceleration = this.physicsEngine.calculateCentrifugalAcceleration(this.currentRPM, this.structure.r3);
            const safety = this.physicsEngine.validateSafetyLimits(this.currentRPM, this.structure);
            
            return {
                rpm: this.currentRPM,
                powerOutput: powerOutput,
                acceleration: acceleration,
                gravitationalMultiple: acceleration / 9.81,
                ionSystem: this.currentIonSystem,
                safety: safety,
                structure: this.structure
            };
        } catch (error) {
            return {
                rpm: this.currentRPM,
                powerOutput: 0,
                acceleration: 0,
                gravitationalMultiple: 0,
                ionSystem: this.currentIonSystem,
                safety: { isWithinLimits: false, warningLevel: 'danger' },
                structure: this.structure,
                error: error.message
            };
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculatorContainer = document.getElementById('efficiency-calculator');
    if (calculatorContainer) {
        window.efficiencyCalculator = new EfficiencyCalculator('efficiency-calculator');
    }
});