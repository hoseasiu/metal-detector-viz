/**
 * Main P5.js Sketch
 * Integrates all components and handles the main draw loop
 */

import { CANVAS, PERFORMANCE, DEBUG, BURIED_OBJECTS, SIGNAL } from './js/config.js';
import { DetectorSimulator } from './js/DetectorSimulator.js';
import { HeatMapRenderer } from './js/HeatMapRenderer.js';
import { DetectorRenderer } from './js/DetectorRenderer.js';

// Global variables for P5.js
let detectorSim;
let heatMapRenderer;
let detectorRenderer;

/**
 * P5.js setup function - runs once at start
 */
window.setup = function() {
    // Create canvas and attach to container
    const canvas = createCanvas(CANVAS.WIDTH, CANVAS.HEIGHT);
    canvas.parent('canvas-container');
    
    // Set frame rate
    frameRate(PERFORMANCE.FRAME_RATE);
    
    // Initialize components
    detectorSim = new DetectorSimulator();
    heatMapRenderer = new HeatMapRenderer(window);
    detectorRenderer = new DetectorRenderer(window);
    
    // Set initial detector position to center
    detectorRenderer.updatePosition(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    
    console.log('Metal Detector Visualization initialized');
    console.log(`Canvas: ${CANVAS.WIDTH}x${CANVAS.HEIGHT}`);
    console.log(`Buried objects: ${BURIED_OBJECTS.length}`);
};

/**
 * P5.js draw function - runs every frame
 */
window.draw = function() {
    // Clear background
    background(CANVAS.BACKGROUND_COLOR);
    
    // Get current mouse/touch position
    let detectorX = mouseX;
    let detectorY = mouseY;
    
    // Clamp to canvas bounds
    detectorX = constrain(detectorX, 0, CANVAS.WIDTH);
    detectorY = constrain(detectorY, 0, CANVAS.HEIGHT);
    
    // Get signal at current position
    const signal = detectorSim.getSignal(detectorX, detectorY);
    
    // Update components
    if (mouseX >= 0 && mouseX <= CANVAS.WIDTH && mouseY >= 0 && mouseY <= CANVAS.HEIGHT) {
        // Only update if mouse is over canvas
        heatMapRenderer.update(detectorX, detectorY, signal.strength);
        detectorRenderer.updatePosition(detectorX, detectorY);
    }
    
    // Apply decay to heat map
    heatMapRenderer.decay();
    
    // Render layers (order matters for proper layering)
    // 1. Heat map (bottom layer)
    heatMapRenderer.render();
    
    // 2. Debug: Show buried object locations (if enabled)
    if (DEBUG.SHOW_OBJECT_LOCATIONS) {
        renderBuriedObjects();
    }
    
    // 3. Detector position (top layer)
    detectorRenderer.render(signal.strength);
    
    // 4. Debug information
    if (DEBUG.SHOW_FPS || DEBUG.LOG_SIGNALS) {
        detectorRenderer.renderDebug({
            x: Math.floor(detectorX),
            y: Math.floor(detectorY),
            strength: signal.strength,
            frequency: signal.frequency
        });
    }
    
    // 5. Update debug panel if available (for debug.html)
    if (typeof window.updateDebugPanel === 'function') {
        const gridX = Math.floor(detectorX / 10);
        const gridY = Math.floor(detectorY / 10);
        const heatMapValue = (gridX >= 0 && gridX < 80 && gridY >= 0 && gridY < 60) 
            ? heatMapRenderer.grid[gridX][gridY] 
            : 0;
        
        window.updateDebugPanel({
            x: Math.floor(detectorX),
            y: Math.floor(detectorY),
            strength: signal.strength,
            frequency: signal.frequency,
            objectName: signal.closestObject ? signal.closestObject.name : null,
            distance: signal.distance,
            heatMapValue: heatMapValue,
            maxValue: heatMapRenderer.getMaxValue(),
            fps: frameRate()
        });
    }
};

/**
 * Render buried object locations (for debugging/ground truth)
 */
function renderBuriedObjects() {
    const objects = detectorSim.getObjects();
    
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    
    for (let obj of objects) {
        // Draw X marker
        const size = 10;
        line(obj.x - size, obj.y - size, obj.x + size, obj.y + size);
        line(obj.x - size, obj.y + size, obj.x + size, obj.y - size);
        
        // Draw circle
        circle(obj.x, obj.y, 20);
        
        // Label
        fill(255, 0, 0);
        noStroke();
        textAlign(CENTER);
        textSize(10);
        text(obj.name, obj.x, obj.y + 25);
    }
    
    pop();
}

/**
 * Handle window resize (make canvas responsive)
 */
window.windowResized = function() {
    // For now, keep fixed size
    // In future versions, we could make this responsive
};

/**
 * Handle key presses for controls
 */
window.keyPressed = function() {
    // 'R' key - Reset heat map
    if (key === 'r' || key === 'R') {
        heatMapRenderer.clear();
        detectorRenderer.clearTrail();
        console.log('Heat map cleared');
    }
    
    // 'D' key - Toggle debug mode
    if (key === 'd' || key === 'D') {
        DEBUG.SHOW_OBJECT_LOCATIONS = !DEBUG.SHOW_OBJECT_LOCATIONS;
        console.log('Debug mode:', DEBUG.SHOW_OBJECT_LOCATIONS ? 'ON' : 'OFF');
    }
    
    // 'F' key - Toggle FPS display
    if (key === 'f' || key === 'F') {
        DEBUG.SHOW_FPS = !DEBUG.SHOW_FPS;
    }
    
    // 'M' key - Toggle decay mode (permanent vs fading heat map)
    if (key === 'm' || key === 'M') {
        SIGNAL.ENABLE_DECAY = !SIGNAL.ENABLE_DECAY;
        console.log('Heat map mode:', SIGNAL.ENABLE_DECAY ? 'FADING' : 'PERMANENT');
    }
    
    // Space bar - Clear trail
    if (key === ' ') {
        detectorRenderer.clearTrail();
    }
    
    // ESC key - Go to normal mode (if in debug mode)
    if (keyCode === ESCAPE) {
        if (window.location.pathname.includes('debug.html')) {
            window.location.href = 'index.html';
        }
    }
};

/**
 * Handle touch events for mobile support
 */
window.touchMoved = function() {
    // Prevent scrolling on mobile when touching canvas
    return false;
};
