/**
 * TechniqueAnalyzer
 * Analyzes user's metal detecting technique and provides real-time feedback
 * Tracks sweep speed, search patterns, and coverage efficiency
 */

export class TechniqueAnalyzer {
    constructor() {
        // Position history for analyzing movement
        this.positionHistory = [];
        this.maxPositionHistory = 60; // Keep last 60 positions (~1 second at 60fps)

        // Technique metrics
        this.sweepSpeed = 0;          // pixels per frame
        this.averageSweepSpeed = 0;   // running average
        this.searchPattern = 'RANDOM'; // RANDOM, GRID, SWEEP
        this.efficiency = 0;           // 0-100

        // Feedback messages
        this.feedbackMessages = [];
        this.lastFeedbackTime = 0;
        this.feedbackCooldown = 3000; // 3 seconds between feedback

        // Optimal parameters (based on real metal detecting practice)
        this.optimalSweepSpeed = {
            min: 3,  // pixels per frame (~180 px/sec at 60fps)
            max: 8   // pixels per frame (~480 px/sec at 60fps)
        };

        // Coverage tracking for pattern analysis
        this.coveredCells = new Set();
        this.lastCellX = null;
        this.lastCellY = null;
    }

    /**
     * Update analyzer with current detector position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    update(x, y) {
        // Add position to history
        this.addPositionToHistory(x, y);

        // Calculate sweep speed
        this.calculateSweepSpeed();

        // Analyze search pattern
        this.analyzeSearchPattern(x, y);

        // Generate feedback (with cooldown)
        this.generateFeedback();
    }

    /**
     * Add position to history
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    addPositionToHistory(x, y) {
        const timestamp = Date.now();

        this.positionHistory.push({ x, y, timestamp });

        // Trim history
        if (this.positionHistory.length > this.maxPositionHistory) {
            this.positionHistory.shift();
        }
    }

    /**
     * Calculate current sweep speed
     */
    calculateSweepSpeed() {
        if (this.positionHistory.length < 2) {
            this.sweepSpeed = 0;
            return;
        }

        // Get last two positions
        const current = this.positionHistory[this.positionHistory.length - 1];
        const previous = this.positionHistory[this.positionHistory.length - 2];

        // Calculate distance moved
        const dx = current.x - previous.x;
        const dy = current.y - previous.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // This is pixels per frame
        this.sweepSpeed = distance;

        // Update running average
        this.updateAverageSweepSpeed();
    }

    /**
     * Update average sweep speed (smoothed)
     */
    updateAverageSweepSpeed() {
        // Exponential moving average
        const alpha = 0.1; // Smoothing factor
        this.averageSweepSpeed = alpha * this.sweepSpeed + (1 - alpha) * this.averageSweepSpeed;
    }

    /**
     * Analyze search pattern
     * @param {number} x - Current X position
     * @param {number} y - Current Y position
     */
    analyzeSearchPattern(x, y) {
        // Convert to grid cells (10x10 pixel cells)
        const cellX = Math.floor(x / 10);
        const cellY = Math.floor(y / 10);

        // Track coverage
        const cellKey = `${cellX},${cellY}`;
        this.coveredCells.add(cellKey);

        // Analyze pattern type
        if (this.positionHistory.length < 30) {
            this.searchPattern = 'STARTING';
            return;
        }

        // Check for systematic sweeping (horizontal or vertical movement)
        const recentPositions = this.positionHistory.slice(-30);
        const horizontalMovement = this.calculateHorizontalMovement(recentPositions);
        const verticalMovement = this.calculateVerticalMovement(recentPositions);

        if (horizontalMovement > 0.7 || verticalMovement > 0.7) {
            this.searchPattern = 'SYSTEMATIC';
        } else if (horizontalMovement > 0.4 && verticalMovement < 0.3) {
            this.searchPattern = 'SWEEP';
        } else {
            this.searchPattern = 'RANDOM';
        }

        this.lastCellX = cellX;
        this.lastCellY = cellY;
    }

    /**
     * Calculate horizontal movement dominance
     * @param {Array} positions - Array of position objects
     * @returns {number} 0-1 score for horizontal dominance
     */
    calculateHorizontalMovement(positions) {
        if (positions.length < 2) return 0;

        let totalHorizontal = 0;
        let totalMovement = 0;

        for (let i = 1; i < positions.length; i++) {
            const dx = Math.abs(positions[i].x - positions[i - 1].x);
            const dy = Math.abs(positions[i].y - positions[i - 1].y);

            totalHorizontal += dx;
            totalMovement += dx + dy;
        }

        return totalMovement > 0 ? totalHorizontal / totalMovement : 0;
    }

    /**
     * Calculate vertical movement dominance
     * @param {Array} positions - Array of position objects
     * @returns {number} 0-1 score for vertical dominance
     */
    calculateVerticalMovement(positions) {
        if (positions.length < 2) return 0;

        let totalVertical = 0;
        let totalMovement = 0;

        for (let i = 1; i < positions.length; i++) {
            const dx = Math.abs(positions[i].x - positions[i - 1].x);
            const dy = Math.abs(positions[i].y - positions[i - 1].y);

            totalVertical += dy;
            totalMovement += dx + dy;
        }

        return totalMovement > 0 ? totalVertical / totalMovement : 0;
    }

    /**
     * Generate technique feedback messages
     */
    generateFeedback() {
        const now = Date.now();

        // Only generate feedback every few seconds
        if (now - this.lastFeedbackTime < this.feedbackCooldown) {
            return;
        }

        this.feedbackMessages = [];

        // Check sweep speed
        if (this.averageSweepSpeed > this.optimalSweepSpeed.max) {
            this.feedbackMessages.push('⚠ Sweeping too fast! Slow down for better detection.');
        } else if (this.averageSweepSpeed > 0 && this.averageSweepSpeed < this.optimalSweepSpeed.min) {
            this.feedbackMessages.push('ℹ Moving very slowly. You can sweep a bit faster.');
        } else if (this.averageSweepSpeed >= this.optimalSweepSpeed.min &&
                   this.averageSweepSpeed <= this.optimalSweepSpeed.max) {
            this.feedbackMessages.push('✓ Good sweep speed!');
        }

        // Check search pattern
        if (this.searchPattern === 'SYSTEMATIC') {
            this.feedbackMessages.push('✓ Excellent systematic search pattern!');
        } else if (this.searchPattern === 'SWEEP') {
            this.feedbackMessages.push('✓ Good sweeping technique.');
        } else if (this.searchPattern === 'RANDOM' && this.positionHistory.length > 60) {
            this.feedbackMessages.push('ℹ Try using systematic horizontal sweeps for better coverage.');
        }

        // Check for hovering (not moving much)
        if (this.averageSweepSpeed < 1 && this.positionHistory.length > 20) {
            this.feedbackMessages.push('ℹ Keep the detector moving for best results.');
        }

        this.lastFeedbackTime = now;
    }

    /**
     * Get current sweep speed in readable format
     * @returns {string} Speed description
     */
    getSweepSpeedDescription() {
        if (this.averageSweepSpeed < 1) return 'STOPPED';
        if (this.averageSweepSpeed < this.optimalSweepSpeed.min) return 'TOO SLOW';
        if (this.averageSweepSpeed <= this.optimalSweepSpeed.max) return 'OPTIMAL';
        if (this.averageSweepSpeed <= this.optimalSweepSpeed.max * 1.5) return 'TOO FAST';
        return 'WAY TOO FAST';
    }

    /**
     * Get search pattern description
     * @returns {string} Pattern description
     */
    getPatternDescription() {
        switch (this.searchPattern) {
            case 'SYSTEMATIC':
                return 'Systematic grid search (excellent!)';
            case 'SWEEP':
                return 'Horizontal sweeping';
            case 'RANDOM':
                return 'Random movement';
            case 'STARTING':
                return 'Just starting...';
            default:
                return 'Unknown';
        }
    }

    /**
     * Calculate search efficiency (0-100)
     * Based on coverage vs. distance traveled
     * @returns {number} Efficiency score
     */
    calculateEfficiency() {
        if (this.positionHistory.length < 10) return 0;

        // Calculate total distance traveled
        let totalDistance = 0;
        for (let i = 1; i < this.positionHistory.length; i++) {
            const dx = this.positionHistory[i].x - this.positionHistory[i - 1].x;
            const dy = this.positionHistory[i].y - this.positionHistory[i - 1].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }

        // Number of unique cells covered
        const cellsCovered = this.coveredCells.size;

        // Efficiency: coverage per unit distance
        // Optimal is covering new ground without backtracking
        if (totalDistance === 0) return 0;

        // Each cell is 10 pixels, ideal path covers 1 cell per 10 pixels
        const idealCells = totalDistance / 10;
        const efficiency = Math.min(100, (cellsCovered / idealCells) * 100);

        return Math.round(efficiency);
    }

    /**
     * Get all feedback messages
     * @returns {Array} Array of feedback strings
     */
    getFeedback() {
        if (this.feedbackMessages.length === 0) {
            return ['Keep sweeping detector to search for targets...'];
        }
        return this.feedbackMessages;
    }

    /**
     * Get comprehensive technique report
     * @returns {Object} Technique metrics
     */
    getReport() {
        return {
            sweepSpeed: Math.round(this.averageSweepSpeed * 60), // Convert to pixels/sec
            speedDescription: this.getSweepSpeedDescription(),
            searchPattern: this.searchPattern,
            patternDescription: this.getPatternDescription(),
            efficiency: this.calculateEfficiency(),
            cellsCovered: this.coveredCells.size,
            feedback: this.getFeedback()
        };
    }

    /**
     * Check if technique is good
     * @returns {boolean} True if technique is good
     */
    isGoodTechnique() {
        const speed = this.averageSweepSpeed;
        const pattern = this.searchPattern;

        const goodSpeed = speed >= this.optimalSweepSpeed.min &&
                         speed <= this.optimalSweepSpeed.max;
        const goodPattern = pattern === 'SYSTEMATIC' || pattern === 'SWEEP';

        return goodSpeed && goodPattern;
    }

    /**
     * Reset analyzer
     */
    reset() {
        this.positionHistory = [];
        this.sweepSpeed = 0;
        this.averageSweepSpeed = 0;
        this.searchPattern = 'RANDOM';
        this.efficiency = 0;
        this.feedbackMessages = [];
        this.lastFeedbackTime = 0;
        this.coveredCells.clear();
        this.lastCellX = null;
        this.lastCellY = null;
    }
}
