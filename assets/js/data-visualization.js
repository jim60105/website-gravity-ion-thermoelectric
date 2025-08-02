/**
 * Data Visualization for Experimental Evidence
 * Handles interactive charts and data displays
 */

class DataVisualization {
  constructor() {
    this.chart = null;
    this.chartData = this.generateExperimentalData();
    this.currentPeriod = '1month';
    this.init();
  }

  init() {
    this.createVoltageChart();
    this.bindChartControls();
  }

  generateExperimentalData() {
    // Generate realistic experimental data based on the research
    const data = {
      '1month': {
        labels: [],
        voltage: [],
        current: []
      },
      '3months': {
        labels: [],
        voltage: [],
        current: []
      },
      'detailed': {
        labels: [],
        voltage: [],
        current: []
      }
    };

    // 1 month data (daily measurements)
    for (let day = 1; day <= 30; day++) {
      data['1month'].labels.push(`第${day}天`);
      // Stable voltage around 1.2V with small variations
      const baseVoltage = 1.2;
      const variation = (Math.random() - 0.5) * 0.04; // ±2% variation
      data['1month'].voltage.push(baseVoltage + variation);

      // Corresponding current (using Ohm's law with resistance variations)
      const resistance = 1000000 + (Math.random() - 0.5) * 50000; // ~1MΩ with variation
      data['1month'].current.push((baseVoltage + variation) / resistance * 1000000); // µA
    }

    // 3 months data (weekly measurements)
    for (let week = 1; week <= 12; week++) {
      data['3months'].labels.push(`第${week}週`);
      const baseVoltage = 1.2;
      const variation = (Math.random() - 0.5) * 0.04;
      data['3months'].voltage.push(baseVoltage + variation);

      const resistance = 1000000 + (Math.random() - 0.5) * 50000;
      data['3months'].current.push((baseVoltage + variation) / resistance * 1000000);
    }

    // Detailed data (hourly for 24 hours)
    for (let hour = 0; hour < 24; hour++) {
      data['detailed'].labels.push(`${hour}:00`);
      const baseVoltage = 1.2;
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation for detailed view
      data['detailed'].voltage.push(baseVoltage + variation);

      const resistance = 1000000 + (Math.random() - 0.5) * 25000;
      data['detailed'].current.push((baseVoltage + variation) / resistance * 1000000);
    }

    return data;
  }

  createVoltageChart() {
    const ctx = document.getElementById('voltage-time-chart');
    if (!ctx) {return;}

    const data = this.chartData[this.currentPeriod];

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: '電壓 (V)',
          data: data.voltage,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#374151',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#2563eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return `時間點: ${context[0].label}`;
              },
              label: function(context) {
                return `電壓: ${context.parsed.y.toFixed(3)}V`;
              },
              afterLabel: function(context) {
                const currentData = this.chartData[this.currentPeriod];
                const current = currentData.current[context.dataIndex];
                return `電流: ${current.toFixed(2)}µA`;
              }.bind(this)
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: '時間',
              color: '#374151',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: '#e5e7eb',
              lineWidth: 1
            },
            ticks: {
              color: '#6b7280',
              maxTicksLimit: 10
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: '電壓 (V)',
              color: '#374151',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: '#e5e7eb',
              lineWidth: 1
            },
            ticks: {
              color: '#6b7280',
              callback: function(value) {
                return value.toFixed(2) + 'V';
              }
            },
            min: 1.1,
            max: 1.3
          }
        },
        elements: {
          point: {
            hoverBorderWidth: 3
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  bindChartControls() {
    const controls = document.querySelectorAll('.chart-control-btn');
    controls.forEach(control => {
      control.addEventListener('click', (e) => {
        // Remove active class from all controls
        controls.forEach(c => c.classList.remove('active'));
        // Add active class to clicked control
        e.target.classList.add('active');

        // Update chart data
        this.currentPeriod = e.target.dataset.period;
        this.updateChart();
      });
    });
  }

  updateChart() {
    if (!this.chart) {return;}

    const data = this.chartData[this.currentPeriod];

    this.chart.data.labels = data.labels;
    this.chart.data.datasets[0].data = data.voltage;

    // Update scale limits based on data
    const voltages = data.voltage;
    const min = Math.min(...voltages) - 0.05;
    const max = Math.max(...voltages) + 0.05;

    this.chart.options.scales.y.min = min;
    this.chart.options.scales.y.max = max;

    this.chart.update('active');
  }

  // Method to update real-time data (can be called from other modules)
  updateRealTimeData(voltage, current, fieldDirection) {
    const voltageElement = document.getElementById('voltage-diff');
    const fieldElement = document.getElementById('field-direction');

    if (voltageElement) {
      voltageElement.textContent = `${voltage.toFixed(1)}V`;
      voltageElement.style.color = voltage > 0 ? '#2563eb' : '#dc2626';
    }

    if (fieldElement) {
      fieldElement.textContent = fieldDirection;
      fieldElement.style.color = fieldDirection === '向上' ? '#059669' : '#dc2626';
    }
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dataVisualization = new DataVisualization();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataVisualization;
}