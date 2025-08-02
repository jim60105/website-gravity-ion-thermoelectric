/**
 * Efficiency Calculator for Centrifugal Force Amplification
 * Handles interactive calculations of power output vs rotation speed
 * @author Gravity Ion Thermoelectric Research Team
 */

class EfficiencyCalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentRPM = 0;
        this.baseEfficiency = 72; // 72W/m³ base power density
        this.chart = null;

        this.init();
    }

    init() {
        if (!this.container) {return;}

        this.setupSlider();
        this.setupChart();
        this.updateCalculation(0);
    }

    setupSlider() {
        const slider = this.container.querySelector('#rpm-slider');
        const rpmDisplay = this.container.querySelector('#rpm-display');

        if (!slider || !rpmDisplay) {return;}

        slider.addEventListener('input', (e) => {
            this.currentRPM = parseInt(e.target.value);
            rpmDisplay.textContent = this.currentRPM;
            this.updateCalculation(this.currentRPM);
        });
    }

    setupChart() {
        const chartCanvas = this.container.querySelector('#efficiency-chart');
        if (!chartCanvas) {return;}

        const ctx = chartCanvas.getContext('2d');

        // Generate data points for the chart
        const dataPoints = [];
        for (let rpm = 0; rpm <= 1000; rpm += 50) {
            dataPoints.push({
                x: rpm,
                y: this.calculatePowerOutput(rpm)
            });
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: '功率輸出 (W/m³)',
                    data: dataPoints,
                    borderColor: '#0EA5E9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: '當前設定',
                    data: [{x: 0, y: this.calculatePowerOutput(0)}],
                    borderColor: '#EA580C',
                    backgroundColor: '#EA580C',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                }]
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
                        }
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
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} W/m³`;
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

    calculatePowerOutput(rpm) {
        // Formula: Power increases exponentially with rotational speed
        // Based on centrifugal force equation F = mω²r
        // Where ω = 2πf, and f = rpm/60
        const baseRPM = 100; // Reference RPM
        if (rpm === 0) {return this.baseEfficiency;}

        const speedRatio = rpm / baseRPM;
        // Power increases as square of speed ratio (approximately)
        const powerMultiplier = Math.pow(speedRatio, 2);
        return this.baseEfficiency * powerMultiplier;
    }

    updateCalculation(rpm) {
        const powerOutput = this.calculatePowerOutput(rpm);
        const efficiency = rpm > 0 ? (powerOutput / this.baseEfficiency) : 1;

        // Update display values
        this.updateDisplay('power-output', powerOutput.toFixed(1));
        this.updateDisplay('efficiency-multiplier', efficiency.toFixed(2));
        this.updateDisplay('energy-per-day', (powerOutput * 24).toFixed(1));

        // Update material stress warning
        this.updateMaterialWarning(rpm);

        // Update chart current point
        if (this.chart) {
            this.chart.data.datasets[1].data = [{x: rpm, y: powerOutput}];
            this.chart.update('none');
        }
    }

    updateDisplay(elementId, value) {
        const element = this.container.querySelector(`#${elementId}`);
        if (element) {
            element.textContent = value;
        }
    }

    updateMaterialWarning(rpm) {
        const warningElement = this.container.querySelector('#material-warning');
        if (!warningElement) {return;}

        if (rpm > 800) {
            warningElement.classList.remove('hidden');
            warningElement.textContent = '高轉速運行，建議使用強化材料';
            warningElement.className = 'material-warning text-orange-600 text-sm mt-2 p-2 bg-orange-50 rounded border border-orange-200';
        } else if (rpm > 600) {
            warningElement.classList.remove('hidden');
            warningElement.textContent = '中等轉速運行，材料應力在安全範圍內';
            warningElement.className = 'material-warning text-yellow-600 text-sm mt-2 p-2 bg-yellow-50 rounded border border-yellow-200';
        } else {
            warningElement.classList.add('hidden');
        }
    }

    // Public method to get current efficiency data
    getCurrentData() {
        return {
            rpm: this.currentRPM,
            powerOutput: this.calculatePowerOutput(this.currentRPM),
            efficiency: this.calculatePowerOutput(this.currentRPM) / this.baseEfficiency
        };
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculatorContainer = document.getElementById('efficiency-calculator');
    if (calculatorContainer) {
        window.efficiencyCalculator = new EfficiencyCalculator('efficiency-calculator');
    }
});