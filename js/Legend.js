/**
 * Legend.js
 * Displays a legend showing metal type colors and VDI ranges
 * Helps users understand what different colors mean
 */

import { METAL_TYPES } from './MetalTypes.js';
import { CANVAS } from './config.js';

export class Legend {
    constructor(p5Instance) {
        this.p = p5Instance;
        this.visible = true;
        
        // Position and sizing - now at bottom-right
        this.padding = 10;
        this.lineHeight = 25;
        this.width = 200;
        
        // Calculate height based on number of metal types
        const numTypes = Object.keys(METAL_TYPES).length;
        this.height = this.padding * 2 + this.lineHeight * (numTypes + 2); // +2 for title and strength scale
        
        // Position at bottom-right (will be set in render based on canvas size)
        this.x = CANVAS.WIDTH - this.width - 10;  // 10px from right edge
        this.y = CANVAS.HEIGHT - this.height - 10; // 10px from bottom edge
        
        // Colors
        this.backgroundColor = [255, 255, 255, 230];  // Semi-transparent white
        this.textColor = [0, 0, 0];
        this.borderColor = [100, 100, 100];
    }
    
    /**
     * Render the legend
     */
    render() {
        if (!this.visible) return;
        
        const p = this.p;
        
        // Draw background
        p.stroke(this.borderColor[0], this.borderColor[1], this.borderColor[2]);
        p.strokeWeight(1);
        p.fill(this.backgroundColor[0], this.backgroundColor[1], 
               this.backgroundColor[2], this.backgroundColor[3]);
        p.rect(this.x, this.y, this.width, this.height, 5);
        
        // Draw title
        p.noStroke();
        p.fill(this.textColor[0], this.textColor[1], this.textColor[2]);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(14);
        p.textStyle(p.BOLD);
        p.text('Metal Types', this.x + this.padding, this.y + this.padding);
        
        // Draw each metal type
        p.textStyle(p.NORMAL);
        p.textSize(12);
        let yOffset = this.y + this.padding + this.lineHeight;
        
        for (let typeName in METAL_TYPES) {
            const metalType = METAL_TYPES[typeName];
            
            // Draw color sample (circle)
            const sampleX = this.x + this.padding + 8;
            const sampleY = yOffset + 8;
            const sampleSize = 12;
            
            p.fill(metalType.color[0], metalType.color[1], metalType.color[2]);
            p.noStroke();
            p.circle(sampleX, sampleY, sampleSize);
            
            // Draw metal name and VDI range
            p.fill(this.textColor[0], this.textColor[1], this.textColor[2]);
            const text = `${metalType.shortName} (VDI ${metalType.vdiRange[0]}-${metalType.vdiRange[1]})`;
            p.text(text, sampleX + sampleSize + 5, yOffset);
            
            yOffset += this.lineHeight;
        }
        
        // Draw signal strength indicator
        yOffset += 5;  // Small gap
        p.textSize(11);
        p.text('Signal Strength:', this.x + this.padding, yOffset);
        
        // Draw strength gradient bar
        yOffset += this.lineHeight - 5;
        const barX = this.x + this.padding;
        const barY = yOffset;
        const barWidth = this.width - this.padding * 2;
        const barHeight = 10;
        
        // Draw gradient
        for (let i = 0; i < barWidth; i++) {
            const t = i / barWidth;
            const alpha = 80 + (t * 140);  // Match heat map alpha range
            p.stroke(200, 100, 100, alpha);
            p.line(barX + i, barY, barX + i, barY + barHeight);
        }
        
        // Labels for gradient
        p.noStroke();
        p.fill(this.textColor[0], this.textColor[1], this.textColor[2]);
        p.textSize(10);
        p.textAlign(p.LEFT, p.TOP);
        p.text('Weak', barX, barY + barHeight + 2);
        p.textAlign(p.RIGHT, p.TOP);
        p.text('Strong', barX + barWidth, barY + barHeight + 2);
    }
    
    /**
     * Toggle legend visibility
     */
    toggle() {
        this.visible = !this.visible;
    }
    
    /**
     * Set legend visibility
     * @param {boolean} visible - Whether legend should be visible
     */
    setVisible(visible) {
        this.visible = visible;
    }
    
    /**
     * Check if legend is visible
     * @returns {boolean} True if legend is visible
     */
    isVisible() {
        return this.visible;
    }
    
    /**
     * Set legend position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Check if a point is inside the legend (for click detection)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if point is inside legend
     */
    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
}
