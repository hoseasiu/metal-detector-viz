/**
 * HeatMapRenderer
 * Renders the heat map layer showing signal intensity
 * Maintains a 2D grid of signal values that decay over time
 */

import { GRID, SIGNAL, COLORS, ACTIVE_COLOR_SCHEME, CANVAS } from './config.js';

export class HeatMapRenderer {
    constructor(p5Instance) {
        this.p = p5Instance;
        
        // Create 2D grid to store signal values
        this.grid = [];
        for (let i = 0; i < GRID.COLS; i++) {
            this.grid[i] = [];
            for (let j = 0; j < GRID.ROWS; j++) {
                this.grid[i][j] = 0;
            }
        }
        
        this.colorScheme = COLORS[ACTIVE_COLOR_SCHEME];
    }
    
    /**
     * Update the heat map with a new signal at a position
     * Spreads signal to nearby cells for more realistic visualization
     * Only updates if signal is above threshold (filters out background noise)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} strength - Signal strength (0-100)
     */
    update(x, y, strength) {
        // Only paint strong signals - combined with steep falloff, this creates localized hotspots
        const SIGNAL_THRESHOLD = 30; // Only paint meaningful signals
        if (strength < SIGNAL_THRESHOLD) {
            return; // Don't paint weak signals
        }
        
        // Convert position to grid coordinates
        const centerGridX = Math.floor(x / GRID.RESOLUTION);
        const centerGridY = Math.floor(y / GRID.RESOLUTION);
        
        // Check bounds
        if (centerGridX < 0 || centerGridX >= GRID.COLS || 
            centerGridY < 0 || centerGridY >= GRID.ROWS) {
            return;
        }
        
        // Spread signal to nearby cells (simulates detector cone)
        // The spread radius is proportional to signal strength
        const spreadRadius = Math.ceil(2 + (strength / 100) * 3); // 2-5 cells based on strength
        
        for (let dx = -spreadRadius; dx <= spreadRadius; dx++) {
            for (let dy = -spreadRadius; dy <= spreadRadius; dy++) {
                const targetX = centerGridX + dx;
                const targetY = centerGridY + dy;
                
                // Check bounds
                if (targetX < 0 || targetX >= GRID.COLS || 
                    targetY < 0 || targetY >= GRID.ROWS) {
                    continue;
                }
                
                // Calculate distance from center
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Apply Gaussian-like falloff
                const falloff = Math.exp(-(distance * distance) / (spreadRadius * spreadRadius));
                const adjustedStrength = strength * falloff;
                
                // Update grid cell - take maximum of current value or new signal
                this.grid[targetX][targetY] = Math.max(this.grid[targetX][targetY], adjustedStrength);
            }
        }
    }
    
    /**
     * Apply decay to all grid cells
     * Makes old signals fade over time (if enabled)
     */
    decay() {
        // Check if decay is enabled
        if (!SIGNAL.ENABLE_DECAY) {
            return; // Skip decay - heat map shows permanent maximum values
        }
        
        for (let i = 0; i < GRID.COLS; i++) {
            for (let j = 0; j < GRID.ROWS; j++) {
                this.grid[i][j] *= SIGNAL.DECAY_RATE;
                
                // Set very small values to zero to prevent floating point accumulation
                if (this.grid[i][j] < 0.5) {
                    this.grid[i][j] = 0;
                }
            }
        }
    }
    
    /**
     * Render the heat map
     */
    render() {
        this.p.noStroke();
        
        // Minimum value to render - filters out very weak signals
        const MIN_VISIBLE_VALUE = 10;
        
        for (let i = 0; i < GRID.COLS; i++) {
            for (let j = 0; j < GRID.ROWS; j++) {
                const value = this.grid[i][j];
                
                // Only draw if signal is strong enough to be visible
                if (value > MIN_VISIBLE_VALUE) {
                    const color = this.getColorForValue(value);
                    this.p.fill(color[0], color[1], color[2], this.getAlphaForValue(value));
                    
                    // Draw as circle for smoother appearance
                    const centerX = i * GRID.RESOLUTION + GRID.RESOLUTION / 2;
                    const centerY = j * GRID.RESOLUTION + GRID.RESOLUTION / 2;
                    const size = GRID.RESOLUTION * 1.5; // Slightly larger for overlap
                    
                    this.p.circle(centerX, centerY, size);
                }
            }
        }
    }
    
    /**
     * Get color for a signal value based on active color scheme
     * @param {number} value - Signal strength (0-100)
     * @returns {Array} RGB color array [r, g, b]
     */
    getColorForValue(value) {
        const normalized = value / SIGNAL.MAX_STRENGTH;
        
        if (ACTIVE_COLOR_SCHEME === 'THERMAL') {
            return this.getThermalColor(normalized);
        } else {
            return this.getSimpleColor(normalized);
        }
    }
    
    /**
     * Get thermal gradient color (blue -> cyan -> yellow -> red)
     * @param {number} t - Normalized value (0-1)
     * @returns {Array} RGB color
     */
    getThermalColor(t) {
        const colors = this.colorScheme;
        
        if (t < 0.33) {
            // Blue to Cyan
            return this.interpolateColor(colors.LOW, colors.MID_LOW, t / 0.33);
        } else if (t < 0.66) {
            // Cyan to Yellow
            return this.interpolateColor(colors.MID_LOW, colors.MID_HIGH, (t - 0.33) / 0.33);
        } else {
            // Yellow to Red
            return this.interpolateColor(colors.MID_HIGH, colors.HIGH, (t - 0.66) / 0.34);
        }
    }
    
    /**
     * Get simple gradient color (blue to red)
     * @param {number} t - Normalized value (0-1)
     * @returns {Array} RGB color
     */
    getSimpleColor(t) {
        return this.interpolateColor(this.colorScheme.LOW, this.colorScheme.HIGH, t);
    }
    
    /**
     * Interpolate between two RGB colors
     * @param {Array} color1 - Start color [r, g, b]
     * @param {Array} color2 - End color [r, g, b]
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Array} Interpolated color [r, g, b]
     */
    interpolateColor(color1, color2, t) {
        const r = color1[0] + (color2[0] - color1[0]) * t;
        const g = color1[1] + (color2[1] - color1[1]) * t;
        const b = color1[2] + (color2[2] - color1[2]) * t;
        return [r, g, b];
    }
    
    /**
     * Get alpha (opacity) value based on signal strength
     * Stronger signals are more opaque
     * @param {number} value - Signal strength (0-100)
     * @returns {number} Alpha value (0-255)
     */
    getAlphaForValue(value) {
        const normalized = value / SIGNAL.MAX_STRENGTH;
        // Map to 80-220 range for better visibility (was 50-200)
        return 80 + (normalized * 140);
    }
    
    /**
     * Clear the entire heat map
     */
    clear() {
        for (let i = 0; i < GRID.COLS; i++) {
            for (let j = 0; j < GRID.ROWS; j++) {
                this.grid[i][j] = 0;
            }
        }
    }
    
    /**
     * Get the maximum signal value in the grid (for debugging)
     * @returns {number} Maximum value
     */
    getMaxValue() {
        let max = 0;
        for (let i = 0; i < GRID.COLS; i++) {
            for (let j = 0; j < GRID.ROWS; j++) {
                max = Math.max(max, this.grid[i][j]);
            }
        }
        return max;
    }
}
