/**
 * Main P5.js Sketch
 * Integrates all components and handles the main draw loop
 */

import { CANVAS, PERFORMANCE, DEBUG, BURIED_OBJECTS, SIGNAL, DETECTOR } from './js/config.js';
import { DetectorSimulator } from './js/DetectorSimulator.js';
import { HeatMapRenderer } from './js/HeatMapRenderer.js';
import { DetectorRenderer } from './js/DetectorRenderer.js';
import { CoverageRenderer } from './js/CoverageRenderer.js';
import { Legend } from './js/Legend.js';

// Global variables for P5.js
let detectorSim;
let heatMapRenderer;
let detectorRenderer;
let coverageRenderer;
let legend;

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
    coverageRenderer = new CoverageRenderer();
    legend = new Legend(window);
    
    // Set initial detector position to center
    detectorRenderer.updatePosition(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    
    console.log('Metal Detector Visualization initialized');
    console.log(`Canvas: ${CANVAS.WIDTH}x${CANVAS.HEIGHT}`);
    console.log(`Buried objects: ${BURIED_OBJECTS.length}`);
    console.log('Week 2 Features: Metal type discrimination, coverage tracking, legend');
    console.log('Controls:');
    console.log('  R - Reset heat map and coverage');
    console.log('  L - Toggle legend');
    console.log('  D - Toggle debug/ground truth');
    console.log('  M - Toggle heat map mode (fading/permanent)');
    console.log('  C - Toggle metal type colors');
    console.log('  G - Toggle grid overlay');
    console.log('  V - Toggle value display');
    console.log('  F - Toggle FPS display');
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
        
        // Update coverage tracker
        coverageRenderer.update(detectorX, detectorY, DETECTOR.RADIUS);
        
        // Update heat map with metal type information
        heatMapRenderer.update(detectorX, detectorY, signal.strength, signal.metalType);
        
        // Update detector position
        detectorRenderer.updatePosition(detectorX, detectorY);
    }
    
    // Apply decay to heat map
    heatMapRenderer.decay();
    
    // Render layers (order matters for proper layering)
    // 1. Coverage map (bottom layer - subtle background)
    coverageRenderer.render(window);
    
    // 2. Grid overlay (if enabled)
    if (DEBUG.SHOW_GRID) {
        renderGrid();
    }
    
    // 3. Heat map (middle layer - shows signal strength with metal type colors)
    heatMapRenderer.render();
    
    // 4. Debug: Show buried object locations (if enabled)
    if (DEBUG.SHOW_OBJECT_LOCATIONS) {
        renderBuriedObjects();
    }
    
    // 5. Detector position (top layer)
    detectorRenderer.render(signal.strength);
    
    // 6. Legend (overlay)
    legend.render();
    
    // 7. Value display (if enabled)
    if (DEBUG.SHOW_VALUES && signal.metalType) {
        renderValueDisplay(signal, detectorX, detectorY);
    }
    
    // 8. Debug information (FPS counter)
    if (DEBUG.SHOW_FPS || DEBUG.LOG_SIGNALS) {
        detectorRenderer.renderDebug({
            x: Math.floor(detectorX),
            y: Math.floor(detectorY),
            strength: signal.strength,
            frequency: signal.frequency,
            vdi: signal.vdi,
            phase: signal.phase,
            metalType: signal.metalType ? signal.metalType.shortName : 'NONE',
            coverage: coverageRenderer.getCoveragePercentage().toFixed(1)
        });
    }
    
    // 7. Update debug panel if available (for debug.html)
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
            vdi: signal.vdi,
            phase: signal.phase,
            metalType: signal.metalType ? signal.metalType.name : 'None',
            objectName: signal.closestObject ? signal.closestObject.name : null,
            distance: signal.distance,
            heatMapValue: heatMapValue,
            maxValue: heatMapRenderer.getMaxValue(),
            coverage: coverageRenderer.getCoveragePercentage().toFixed(1),
            fps: frameRate()
        });
    }
};

/**
 * Render grid overlay (for debugging/visualization)
 */
function renderGrid() {
    push();
    stroke(150, 150, 150, 80);  // Light gray, semi-transparent
    strokeWeight(1);
    
    // Vertical lines
    for (let x = 0; x <= CANVAS.WIDTH; x += GRID.RESOLUTION) {
        line(x, 0, x, CANVAS.HEIGHT);
    }
    
    // Horizontal lines
    for (let y = 0; y <= CANVAS.HEIGHT; y += GRID.RESOLUTION) {
        line(0, y, CANVAS.WIDTH, y);
    }
    
    pop();
}

/**
 * Render value display showing current readings
 */
function renderValueDisplay(signal, x, y) {
    push();
    
    // Position display near detector but not overlapping
    const displayX = x + 60;
    const displayY = y - 40;
    
    // Background
    fill(0, 0, 0, 180);
    noStroke();
    rectMode(CORNER);
    rect(displayX, displayY, 140, 70, 5);
    
    // Text
    fill(255, 255, 255);
    textAlign(LEFT, TOP);
    textSize(11);
    
    text(`Metal: ${signal.metalType.shortName}`, displayX + 5, displayY + 5);
    text(`VDI: ${signal.vdi}`, displayX + 5, displayY + 20);
    text(`Phase: ${signal.phase}°`, displayX + 5, displayY + 35);
    text(`Signal: ${Math.floor(signal.strength)}`, displayX + 5, displayY + 50);
    
    pop();
}

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
        
        // Label with name and metal type
        fill(255, 0, 0);
        noStroke();
        textAlign(CENTER);
        textSize(10);
        text(obj.name, obj.x, obj.y + 25);
        text(`(${obj.metalType})`, obj.x, obj.y + 37);
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
    // 'R' key - Reset heat map and coverage
    if (key === 'r' || key === 'R') {
        heatMapRenderer.clear();
        detectorRenderer.clearTrail();
        coverageRenderer.reset();
        console.log('Heat map and coverage cleared');
    }
    
    // 'L' key - Toggle legend
    if (key === 'l' || key === 'L') {
        legend.toggle();
        console.log('Legend:', legend.isVisible() ? 'VISIBLE' : 'HIDDEN');
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
    
    // 'C' key - Toggle metal type colors
    if (key === 'c' || key === 'C') {
        heatMapRenderer.useMetalTypeColors = !heatMapRenderer.useMetalTypeColors;
        console.log('Metal type colors:', heatMapRenderer.useMetalTypeColors ? 'ON' : 'OFF');
    }
    
    // 'G' key - Toggle grid overlay
    if (key === 'g' || key === 'G') {
        DEBUG.SHOW_GRID = !DEBUG.SHOW_GRID;
        console.log('Grid overlay:', DEBUG.SHOW_GRID ? 'ON' : 'OFF');
    }
    
    // 'V' key - Toggle value display
    if (key === 'v' || key === 'V') {
        DEBUG.SHOW_VALUES = !DEBUG.SHOW_VALUES;
        console.log('Value display:', DEBUG.SHOW_VALUES ? 'ON' : 'OFF');
    }
    
    // Space bar - Clear trail
    if (key === ' ') {
        detectorRenderer.clearTrail();
    }
};

/**
 * Handle touch events for mobile support
 */
window.touchMoved = function() {
    // Prevent scrolling on mobile when touching canvas
    return false;
};
