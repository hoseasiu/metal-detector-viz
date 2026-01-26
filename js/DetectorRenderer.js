/**
 * DetectorRenderer
 * Renders the detector position, scan cone, and movement trail
 */

import { DETECTOR, DEBUG } from './config.js';

export class DetectorRenderer {
    constructor(p5Instance) {
        this.p = p5Instance;
        this.currentX = 0;
        this.currentY = 0;
        this.trail = []; // Store recent positions for trail effect
    }
    
    /**
     * Update detector position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    updatePosition(x, y) {
        this.currentX = x;
        this.currentY = y;
        
        // Add to trail
        this.trail.push({ x, y });
        
        // Keep trail length limited
        if (this.trail.length > DETECTOR.TRAIL_LENGTH) {
            this.trail.shift();
        }
    }
    
    /**
     * Render the detector visualization
     * @param {number} signalStrength - Current signal strength (0-100) for visual feedback
     */
    render(signalStrength = 0) {
        // Render in layers: trail -> cone -> position marker
        
        // 1. Render trail (fading path)
        this.renderTrail();
        
        // 2. Render scan cone
        this.renderScanCone();
        
        // 3. Render detector position
        this.renderPosition(signalStrength);
    }
    
    /**
     * Render the trail showing recent detector movement
     */
    renderTrail() {
        if (this.trail.length < 2) return;
        
        this.p.noFill();
        const col = this.p.color(DETECTOR.POSITION_COLOR);
        
        for (let i = 0; i < this.trail.length - 1; i++) {
            const alpha = (i / this.trail.length) * 255; // Fade older positions (0-255)
            this.p.stroke(this.p.red(col), this.p.green(col), this.p.blue(col), alpha);
            this.p.strokeWeight(2);
            
            const current = this.trail[i];
            const next = this.trail[i + 1];
            this.p.line(current.x, current.y, next.x, next.y);
        }
    }
    
    /**
     * Render the scan cone showing detection area
     */
    renderScanCone() {
        this.p.push();
        
        // Semi-transparent cone
        const col = this.p.color(DETECTOR.POSITION_COLOR);
        this.p.fill(this.p.red(col), this.p.green(col), this.p.blue(col), DETECTOR.CONE_OPACITY);
        this.p.noStroke();
        
        // Draw circle representing detection radius
        this.p.circle(this.currentX, this.currentY, DETECTOR.RADIUS * 2);
        
        this.p.pop();
    }
    
    /**
     * Render the main detector position marker
     * Visual feedback changes based on signal strength
     * @param {number} signalStrength - Current signal strength (0-100)
     */
    renderPosition(signalStrength) {
        this.p.push();
        
        // Outer ring
        this.p.noFill();
        this.p.stroke(DETECTOR.POSITION_COLOR);
        this.p.strokeWeight(3);
        this.p.circle(this.currentX, this.currentY, 30);
        
        // Inner dot - changes size based on signal strength
        const innerSize = 8 + (signalStrength / 100) * 12; // 8-20px based on signal
        this.p.fill(DETECTOR.POSITION_COLOR);
        this.p.noStroke();
        this.p.circle(this.currentX, this.currentY, innerSize);
        
        // Crosshair
        this.p.stroke(DETECTOR.POSITION_COLOR);
        this.p.strokeWeight(2);
        const crossSize = 15;
        
        // Horizontal line
        this.p.line(this.currentX - crossSize, this.currentY, 
                   this.currentX + crossSize, this.currentY);
        
        // Vertical line
        this.p.line(this.currentX, this.currentY - crossSize, 
                   this.currentX, this.currentY + crossSize);
        
        // If strong signal, add pulsing effect
        if (signalStrength > 50) {
            this.renderSignalPulse(signalStrength);
        }
        
        this.p.pop();
    }
    
    /**
     * Render a pulsing effect for strong signals
     * @param {number} signalStrength - Signal strength (0-100)
     */
    renderSignalPulse(signalStrength) {
        // Animate based on frame count
        const pulse = this.p.sin(this.p.frameCount * 0.1) * 0.5 + 0.5; // 0-1
        
        const pulseSize = 40 + (pulse * 20);
        const pulseAlpha = (1 - pulse) * (signalStrength / 100) * 100;
        
        const col = this.p.color(DETECTOR.POSITION_COLOR);
        this.p.noFill();
        this.p.stroke(this.p.red(col), this.p.green(col), this.p.blue(col), pulseAlpha);
        this.p.strokeWeight(2);
        this.p.circle(this.currentX, this.currentY, pulseSize);
    }
    
    /**
     * Get current detector position
     * @returns {Object} Position { x, y }
     */
    getPosition() {
        return {
            x: this.currentX,
            y: this.currentY
        };
    }
    
    /**
     * Clear the trail
     */
    clearTrail() {
        this.trail = [];
    }
    
    /**
     * Render debug information (if enabled)
     * @param {Object} debugInfo - Debug information to display
     */
    renderDebug(debugInfo) {
        if (!DEBUG.SHOW_FPS && !DEBUG.LOG_SIGNALS) return;
        
        this.p.push();
        this.p.fill(0);
        this.p.noStroke();
        this.p.textSize(12);
        this.p.textAlign(this.p.LEFT, this.p.TOP);
        
        let y = 10;
        const lineHeight = 15;
        
        if (DEBUG.SHOW_FPS) {
            this.p.text(`FPS: ${this.p.frameRate().toFixed(1)}`, 10, y);
            y += lineHeight;
        }
        
        if (DEBUG.LOG_SIGNALS && debugInfo) {
            this.p.text(`Pos: (${debugInfo.x}, ${debugInfo.y})`, 10, y);
            y += lineHeight;
            this.p.text(`Signal: ${debugInfo.strength.toFixed(1)}`, 10, y);
            y += lineHeight;
            this.p.text(`Freq: ${debugInfo.frequency.toFixed(0)} Hz`, 10, y);
        }
        
        this.p.pop();
    }
}
