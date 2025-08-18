# GitHub Copilot Instructions for Gravity Ion Thermoelectric Website

## Project Overview

This is a modern promotional website showcasing revolutionary gravity ion thermoelectric conversion technology. The project demonstrates breakthrough research that challenges traditional thermodynamic principles by converting heat to electricity under gravitational effects using ion-containing fluids.

**Key Features:**

- Scientific research presentation with academic credibility
- Interactive data visualizations and simulations
- Responsive design optimized for all devices
- Accessibility-first approach following WCAG AA standards
- Performance-optimized with lazy loading and resource optimization

## Technical Architecture

### Frontend Technology Stack

- **HTML5**: Semantic markup with comprehensive accessibility attributes
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Vanilla JavaScript (ES6+)**: Modular architecture with component-based design
- **Chart.js**: For scientific data visualization and interactive charts
- **WebP Images**: Optimized format for enhanced loading performance

### Development Tools

- **http-server**: Local development server via npm package
- **ESLint**: Code quality enforcement with ES2021 standards
- **Prettier**: Code formatting for consistent style
- **Git**: Version control with conventional commit format

## Project Structure

```text
/
├── index.html                    # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css           # Custom CSS styles complementing Tailwind
│   ├── js/
│   │   ├── main.js              # Main application logic and initialization
│   │   ├── utils.js             # Utility functions for DOM and performance
│   │   ├── animations.js        # Animation system and particle effects
│   │   ├── *-charts.js          # Various chart and visualization modules
│   │   └── *.js                 # Component-specific JavaScript files
│   ├── images/                  # Research diagrams and illustrations (.webp)
│   └── docs/                    # Research papers and documentation (.md)
├── package.json                 # Project configuration and scripts
├── eslint.config.js            # ESLint configuration
└── .github/copilot-instructions.md
```

## Development Guidelines

### Code Style and Standards

- **JavaScript**: Use ES6+ syntax with modular design patterns
- **CSS**: Prioritize Tailwind utilities; minimize custom CSS
- **HTML**: Use semantic elements with proper ARIA attributes
- **Comments**: Write in English for all code documentation

### JavaScript Conventions

- Use `const` and `let`; avoid `var`
- Implement modules using ES6 import/export when applicable
- Prefer arrow functions for callbacks and short functions
- Use meaningful variable and function names following camelCase
- Apply JSDoc comments for complex functions and classes

### CSS and Styling

- Use Tailwind utility classes as primary styling method
- Custom CSS should be in `assets/css/styles.css` only when Tailwind utilities are insufficient
- Follow mobile-first responsive design approach
- Implement CSS custom properties for theming and consistent spacing

### Performance Requirements

- Implement lazy loading for images using `loading="lazy"`
- Use debouncing and throttling for scroll and resize events
- Minimize DOM manipulation; batch updates when possible
- Preload critical resources for above-the-fold content
- Optimize animations with `will-change` and `transform3d`

### Accessibility Standards

- Maintain WCAG AA compliance for contrast ratios
- Provide alt text for all images
- Implement proper heading hierarchy (h1-h6)
- Use semantic HTML elements (`<main>`, `<section>`, `<article>`, etc.)
- Support keyboard navigation for all interactive elements
- Include skip links and proper focus management

### Browser Compatibility

- Target Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Provide graceful degradation for older browsers
- Test responsive design across mobile, tablet, and desktop viewports

## Development Workflow

### Available Scripts

> Note: Use #runTasks to run tasks.

- `#runTasks install`: Install project dependencies
- `#runTasks start`: Start development server

NEVER START THE HTTP-SERVER WITH NPX COMMAND!!!  
NEVER START THE HTTP-SERVER WITH NPX COMMAND!!!  
NEVER START THE HTTP-SERVER WITH NPX COMMAND!!!

### Key Components

#### Main Application (`main.js`)

- Central application class `GravityIonApp`
- Component lifecycle management
- Event handling and performance monitoring
- Mobile menu and navigation functionality

#### Utility System (`utils.js`)

- DOM manipulation helpers
- Performance optimization utilities (debounce, throttle)
- Scroll and animation helpers

#### Animation System (`animations.js`)

- Particle effects and scientific animations
- Canvas-based visualizations
- Performance-aware animation controls

### Content Guidelines

- All user-facing text should be in Traditional Chinese (正體中文)
- Technical terms can remain in English when appropriate
- Maintain scientific accuracy in all research-related content
- Use respectful and professional tone throughout

## Specific Project Context

### Scientific Theme

This website presents research on gravity ion thermoelectric technology, which demonstrates exceptions to traditional thermodynamic laws. The content should maintain scientific credibility while being accessible to both academic and general audiences.

### Visual Design

- Color scheme emphasizes deep space gradients (blues, purples) with energy accents (gold, electric blue)
- Typography uses modern sans-serif fonts for readability
- Interactive elements provide visual feedback with smooth transitions
- Charts and visualizations support the scientific narrative

### Interactive Features

- Real-time efficiency calculations and comparisons
- Interactive roadmap timeline for development milestones
- Academic recognition displays and university carousels
- Contact forms and engagement tracking
- Avoid listening to the scroll event because it greatly affects the user experience on our long single-page website.

## Common Patterns and Best Practices

### Event Handling

```javascript
// Use utility functions for event management
Utils.DOM.on(element, 'click', handler);

// Implement proper cleanup
Utils.DOM.off(element, 'click', handler);
```

### Performance Optimization

```javascript
// Use throttling for scroll events
const throttledHandler = Utils.Performance.throttle(handler, 100);

// Implement intersection observer for lazy loading
const observer = new IntersectionObserver(callback, options);
```

### Component Structure

```javascript
class ComponentName {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }
    
    init() {
        // Initialization logic
    }
    
    // Public methods for external interaction
}
```

When working on this project, prioritize maintainable, accessible, and performant code that aligns with the scientific and professional nature of the content while ensuring an excellent user experience across all devices and user capabilities.
