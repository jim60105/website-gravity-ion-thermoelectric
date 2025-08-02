/**
 * Impact Charts for Environmental and Economic Analysis
 * Renders charts for CO2 reduction, economic benefits, and energy comparison
 * @author Gravity Ion Thermoelectric Research Team
 */

class ImpactCharts {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.initializeEnvironmentalChart();
        this.initializeEconomicChart();
        this.initializeEnergyComparisonChart();
        this.initializeCO2ReductionChart();
    }

    initializeEnvironmentalChart() {
        const canvas = document.getElementById('environmental-impact-chart');
        if (!canvas) {return;}

        const ctx = canvas.getContext('2d');

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['重力熱電', '太陽能', '風能', '核能', '化石燃料'],
                datasets: [{
                    data: [25, 20, 15, 20, 20],
                    backgroundColor: [
                        '#059669', // 環保綠
                        '#F59E0B', // 太陽橙
                        '#0EA5E9', // 天空藍
                        '#8B5CF6', // 紫色
                        '#EF4444'  // 警示紅
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}% 清潔度評分`;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('environmental', chart);
    }

    initializeEconomicChart() {
        const canvas = document.getElementById('economic-analysis-chart');
        if (!canvas) {return;}

        const ctx = canvas.getContext('2d');

        const years = ['2025', '2027', '2030', '2035', '2040'];
        const gravityThermal = [100, 85, 70, 55, 45];
        const solar = [80, 75, 70, 65, 60];
        const wind = [90, 85, 80, 75, 70];

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: '重力熱電',
                    data: gravityThermal,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: '太陽能',
                    data: solar,
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }, {
                    label: '風能',
                    data: wind,
                    borderColor: '#0EA5E9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
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
                            text: '年份',
                            color: '#374151'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '成本指數 (以2025年太陽能為100)',
                            color: '#374151'
                        },
                        min: 40,
                        max: 110
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });

        this.charts.set('economic', chart);
    }

    initializeEnergyComparisonChart() {
        const canvas = document.getElementById('energy-comparison-chart');
        if (!canvas) {return;}

        const ctx = canvas.getContext('2d');

        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    '穩定性', '效率', '環保性',
                    '成本效益', '維護簡易', '擴展性'
                ],
                datasets: [{
                    label: '重力熱電',
                    data: [95, 85, 98, 90, 95, 88],
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#059669',
                    pointBorderColor: '#ffffff',
                    pointRadius: 5
                }, {
                    label: '太陽能',
                    data: [60, 75, 90, 70, 80, 85],
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#F59E0B',
                    pointBorderColor: '#ffffff',
                    pointRadius: 5
                }, {
                    label: '風能',
                    data: [50, 70, 85, 65, 60, 80],
                    borderColor: '#0EA5E9',
                    backgroundColor: 'rgba(14, 165, 233, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#0EA5E9',
                    pointBorderColor: '#ffffff',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.3)'
                        },
                        angleLines: {
                            color: 'rgba(156, 163, 175, 0.3)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        this.charts.set('comparison', chart);
    }

    initializeCO2ReductionChart() {
        const canvas = document.getElementById('co2-reduction-chart');
        if (!canvas) {return;}

        const ctx = canvas.getContext('2d');

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2025', '2027', '2030', '2035'],
                datasets: [{
                    label: 'CO₂ 減排量 (億噸)',
                    data: [0.5, 2.1, 8.5, 25.3],
                    backgroundColor: 'rgba(5, 150, 105, 0.8)',
                    borderColor: '#059669',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.5,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '年份',
                            color: '#374151'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'CO₂ 減排量 (億噸/年)',
                            color: '#374151'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `預計減排: ${context.parsed.y} 億噸 CO₂`;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('co2', chart);
    }

    // Method to update charts with new data
    updateChart(chartName, newData) {
        const chart = this.charts.get(chartName);
        if (chart && newData) {
            chart.data = { ...chart.data, ...newData };
            chart.update();
        }
    }

    // Method to animate charts on scroll
    animateChartsOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chartCanvas = entry.target.querySelector('canvas');
                    if (chartCanvas) {
                        const chartId = chartCanvas.id;
                        const chart = this.getChartByCanvasId(chartId);
                        if (chart) {
                            chart.update('active');
                        }
                    }
                }
            });
        }, {
            threshold: 0.3
        });

        // Observe all chart containers
        document.querySelectorAll('[id$="-chart-container"]').forEach(container => {
            observer.observe(container);
        });
    }

    getChartByCanvasId(canvasId) {
        const mapping = {
            'environmental-impact-chart': 'environmental',
            'economic-analysis-chart': 'economic',
            'energy-comparison-chart': 'comparison',
            'co2-reduction-chart': 'co2'
        };
        return this.charts.get(mapping[canvasId]);
    }

    // Public method to get all chart instances
    getAllCharts() {
        return this.charts;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.impactCharts = new ImpactCharts();

    // Setup scroll-based animations
    setTimeout(() => {
        if (window.impactCharts) {
            window.impactCharts.animateChartsOnScroll();
        }
    }, 1000);
});
