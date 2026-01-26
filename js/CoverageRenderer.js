/**
 * CoverageRenderer.js
 * Tracks and visualizes areas that have been searched by the detector
 * Provides coverage statistics and visual feedback
 */

import { GRID, CANVAS } from './config.js';

export class CoverageRenderer {
    constructor() {
        // Create grid to track coverage
        this.cols = GRID.COLS;
        this.rows = GRID.ROWS;
        this.cellSize = GRID.RESOLUTION;
        
        // Coverage grid: 0 = not searched, timestamp = last search time
        this.coverageGrid = [];
        for (let i = 0; i < this.cols; i++) {
            this.coverageGrid[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.coverageGrid[i][j] = 0;
            }
        }
        
        // Visual settings
        this.coverageColor = [100, 200, 100];  // Green tint
        this.coverageOpacity = 40;  // Low opacity so it doesn't obscure heat map
        this.fadeTime = 5000;  // Time in ms for coverage to fade (0 = no fade)
    }
    
    /**
     * Update coverage at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} radius - Radius of detector coverage (optional)
     */
    update(x, y, radius = 50) {
        // Mark cells within the detector's radius as searched
        const currentTime = Date.now();
        
        // Calculate grid bounds to update
        const minCol = Math.max(0, Math.floor((x - radius) / this.cellSize));
        const maxCol = Math.min(this.cols - 1, Math.floor((x + radius) / this.cellSize));
        const minRow = Math.max(0, Math.floor((y - radius) / this.cellSize));
        const maxRow = Math.min(this.rows - 1, Math.floor((y + radius) / this.cellSize));
        
        // Update grid cells within radius
        for (let i = minCol; i <= maxCol; i++) {
            for (let j = minRow; j <= maxRow; j++) {
                // Calculate cell center
                const cellCenterX = (i + 0.5) * this.cellSize;
                const cellCenterY = (j + 0.5) * this.cellSize;
                
                // Check if cell center is within detector radius
                const dx = cellCenterX - x;
                const dy = cellCenterY - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= radius) {
                    // Mark cell as searched with current timestamp
                    this.coverageGrid[i][j] = currentTime;
                }
            }
        }
    }
    
    /**
     * Render the coverage layer
     * @param {Object} p5 - P5.js instance
     */
    render(p5) {
        const currentTime = Date.now();
        
        // Set drawing mode
        p5.noStroke();
        
        // Draw each cell that has been searched
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                const lastSearchTime = this.coverageGrid[i][j];
                
                if (lastSearchTime > 0) {
                    // Calculate opacity based on time since last search
                    let opacity = this.coverageOpacity;
                    
                    if (this.fadeTime > 0) {
                        const timeSinceSearch = currentTime - lastSearchTime;
                        const fadeFactor = Math.max(0, 1 - (timeSinceSearch / this.fadeTime));
                        opacity = this.coverageOpacity * fadeFactor;
                    }
                    
                    if (opacity > 0) {
                        // Draw cell with coverage color
                        p5.fill(this.coverageColor[0], this.coverageColor[1], this.coverageColor[2], opacity);
                        p5.rect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
                    }
                }
            }
        }
    }
    
    /**
     * Calculate coverage percentage
     * @returns {number} Percentage of area searched (0-100)
     */
    getCoveragePercentage() {
        let searchedCells = 0;
        const totalCells = this.cols * this.rows;
        
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.coverageGrid[i][j] > 0) {
                    searchedCells++;
                }
            }
        }
        
        return (searchedCells / totalCells) * 100;
    }
    
    /**
     * Get number of cells searched
     * @returns {number} Number of cells that have been searched
     */
    getSearchedCells() {
        let count = 0;
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.coverageGrid[i][j] > 0) {
                    count++;
                }
            }
        }
        return count;
    }
    
    /**
     * Check if a specific position has been searched
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if position has been searched
     */
    isSearched(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            return this.coverageGrid[col][row] > 0;
        }
        return false;
    }
    
    /**
     * Reset coverage grid
     */
    reset() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.coverageGrid[i][j] = 0;
            }
        }
    }
    
    /**
     * Set coverage color
     * @param {Array} color - RGB color array [r, g, b]
     */
    setCoverageColor(color) {
        this.coverageColor = color;
    }
    
    /**
     * Set coverage opacity
     * @param {number} opacity - Opacity value (0-255)
     */
    setCoverageOpacity(opacity) {
        this.coverageOpacity = opacity;
    }
    
    /**
     * Set fade time
     * @param {number} fadeTime - Time in ms for coverage to fade (0 = no fade)
     */
    setFadeTime(fadeTime) {
        this.fadeTime = fadeTime;
    }
}
