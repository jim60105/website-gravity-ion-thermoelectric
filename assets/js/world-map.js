/**
 * World Map Visualization for Academic Recognition Section
 * Shows global distribution of professor responses
 */

class WorldMapVisualization {
  constructor() {
    this.mapContainer = null;
    this.mapData = [];
    this.init();
  }

  init() {
    this.mapContainer = document.getElementById('world-map');
    if (!this.mapContainer) {return;}

    this.generateMockData();
    this.createSVGMap();
    this.addInteractivity();
  }

  generateMockData() {
    // Mock data for professor responses by region
    this.mapData = [
      // North America
      { region: 'usa', x: 25, y: 45, responses: 89, type: 'mixed', name: 'United States' },
      { region: 'canada', x: 20, y: 35, responses: 23, type: 'positive', name: 'Canada' },

      // Europe
      { region: 'uk', x: 50, y: 40, responses: 45, type: 'constructive', name: 'United Kingdom' },
      { region: 'germany', x: 55, y: 42, responses: 67, type: 'mixed', name: 'Germany' },
      { region: 'france', x: 52, y: 45, responses: 34, type: 'constructive', name: 'France' },
      { region: 'sweden', x: 57, y: 32, responses: 12, type: 'positive', name: 'Sweden' },

      // Asia
      { region: 'china', x: 75, y: 50, responses: 156, type: 'mixed', name: 'China' },
      { region: 'japan', x: 82, y: 48, responses: 78, type: 'constructive', name: 'Japan' },
      { region: 'india', x: 72, y: 60, responses: 43, type: 'mixed', name: 'India' },
      { region: 'taiwan', x: 78, y: 58, responses: 28, type: 'positive', name: 'Taiwan' },

      // Australia
      { region: 'australia', x: 82, y: 78, responses: 19, type: 'constructive', name: 'Australia' },

      // South America
      { region: 'brazil', x: 35, y: 70, responses: 14, type: 'positive', name: 'Brazil' },

      // Africa
      { region: 'south-africa', x: 58, y: 75, responses: 8, type: 'constructive', name: 'South Africa' }
    ];
  }

  createSVGMap() {
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.classList.add('world-map-svg');

    // Add background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '100');
    bg.setAttribute('height', '100');
    bg.setAttribute('fill', '#1a1a2e');
    bg.setAttribute('rx', '4');
    svg.appendChild(bg);

    // Add continent outlines (simplified)
    this.addContinentOutlines(svg);

    // Add data points
    this.mapData.forEach(point => {
      this.addDataPoint(svg, point);
    });

    // Clear container and add SVG
    this.mapContainer.innerHTML = '';
    this.mapContainer.appendChild(svg);
  }

  addContinentOutlines(svg) {
    const continents = [
      // North America (simplified)
      { d: 'M15,35 Q20,30 30,35 L35,50 Q30,55 25,50 L20,45 Q15,40 15,35', fill: '#2a2a3e' },
      // Europe
      { d: 'M50,35 Q55,32 60,35 L62,45 Q58,47 54,45 L50,40 Q48,37 50,35', fill: '#2a2a3e' },
      // Asia
      { d: 'M62,35 Q75,30 85,40 L88,55 Q80,60 70,55 L65,45 Q62,38 62,35', fill: '#2a2a3e' },
      // Africa
      { d: 'M50,50 Q58,48 62,55 L60,75 Q55,78 50,75 L48,60 Q48,52 50,50', fill: '#2a2a3e' },
      // South America
      { d: 'M30,60 Q35,58 38,65 L36,80 Q32,82 28,78 L26,68 Q28,62 30,60', fill: '#2a2a3e' },
      // Australia
      { d: 'M78,75 Q85,73 88,78 L86,82 Q82,84 78,82 L76,78 Q76,76 78,75', fill: '#2a2a3e' }
    ];

    continents.forEach(continent => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', continent.d);
      path.setAttribute('fill', continent.fill);
      path.setAttribute('stroke', '#3a3a4e');
      path.setAttribute('stroke-width', '0.2');
      svg.appendChild(path);
    });
  }

  addDataPoint(svg, point) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('map-point');
    group.setAttribute('data-region', point.region);

    // Determine color based on response type
    const colors = {
      positive: '#10b981',
      constructive: '#f59e0b',
      negative: '#ef4444',
      mixed: '#8b5cf6'
    };

    // Calculate size based on response count
    const baseSize = 0.8;
    const maxSize = 2.5;
    const size = baseSize + (point.responses / 200) * (maxSize - baseSize);

    // Create pulsing circle
    const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulseCircle.setAttribute('cx', point.x);
    pulseCircle.setAttribute('cy', point.y);
    pulseCircle.setAttribute('r', size * 1.5);
    pulseCircle.setAttribute('fill', colors[point.type]);
    pulseCircle.setAttribute('opacity', '0.3');
    pulseCircle.classList.add('pulse-animation');

    // Create main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', size);
    circle.setAttribute('fill', colors[point.type]);
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '0.2');
    circle.classList.add('interactive-point');

    group.appendChild(pulseCircle);
    group.appendChild(circle);

    // Add interaction
    this.addPointInteraction(group, point);

    svg.appendChild(group);
  }

  addPointInteraction(group, point) {
    const tooltip = this.createTooltip();

    group.addEventListener('mouseenter', (e) => {
      this.showTooltip(tooltip, point, e);
      group.style.transform = 'scale(1.2)';
      group.style.transformOrigin = 'center';
    });

    group.addEventListener('mouseleave', () => {
      this.hideTooltip(tooltip);
      group.style.transform = 'scale(1)';
    });

    group.addEventListener('mousemove', (e) => {
      this.updateTooltipPosition(tooltip, e);
    });
  }

  createTooltip() {
    let tooltip = document.getElementById('map-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'map-tooltip';
      tooltip.className = 'map-tooltip absolute bg-black/90 text-white p-3 rounded-lg shadow-lg pointer-events-none z-50 text-sm';
      tooltip.style.display = 'none';
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  showTooltip(tooltip, point, event) {
    const responseTypes = {
      positive: '正面回應',
      constructive: '建設性質疑',
      negative: '反對意見',
      mixed: '多元回應'
    };

    tooltip.innerHTML = `
      <div class="font-semibold text-yellow-400 mb-2">${point.name}</div>
      <div class="space-y-1">
        <div>回應數量: <span class="text-blue-400 font-bold">${point.responses}</span></div>
        <div>主要類型: <span class="text-green-400">${responseTypes[point.type]}</span></div>
      </div>
    `;

    tooltip.style.display = 'block';
    this.updateTooltipPosition(tooltip, event);
  }

  hideTooltip(tooltip) {
    tooltip.style.display = 'none';
  }

  updateTooltipPosition(tooltip, event) {
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY - 10}px`;
  }

  addInteractivity() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      .pulse-animation {
        animation: map-pulse 2s ease-in-out infinite;
      }
      
      @keyframes map-pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
      }
      
      .interactive-point {
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .map-point {
        transition: transform 0.3s ease;
      }
      
      .map-tooltip {
        transition: opacity 0.2s ease;
      }
    `;
    document.head.appendChild(style);
  }

  // Method to update data (for future use)
  updateData(newData) {
    this.mapData = newData;
    this.createSVGMap();
  }

  // Get statistics summary
  getStatsSummary() {
    const total = this.mapData.reduce((sum, point) => sum + point.responses, 0);
    const countries = this.mapData.length;
    const avgResponses = Math.round(total / countries);

    return {
      totalResponses: total,
      countries: countries,
      averagePerCountry: avgResponses
    };
  }
}

// Initialize world map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const worldMap = new WorldMapVisualization();

  // Make it globally accessible
  window.worldMap = worldMap;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorldMapVisualization;
}