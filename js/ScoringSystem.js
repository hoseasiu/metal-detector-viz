/**
 * ScoringSystem
 * Tracks performance metrics and calculates scores for training scenarios
 * Monitors targets found, false alarms, search efficiency, and technique
 */

export class ScoringSystem {
    constructor() {
        this.reset();
    }

    /**
     * Reset all scoring metrics
     */
    reset() {
        // Target tracking
        this.targetsFound = new Set();
        this.valuableTargetsFound = new Set();
        this.trashTargetsFound = new Set();
        this.totalTargets = 0;
        this.valuableTargets = 0;
        this.trashTargets = 0;

        // Time tracking
        this.startTime = Date.now();
        this.endTime = null;
        this.timeElapsed = 0;
        this.timeLimit = null;

        // Coverage and efficiency
        this.coveragePercentage = 0;
        this.searchEfficiency = 0;

        // Technique scores
        this.techniqueScore = 0;
        this.sweepSpeedScore = 0;
        this.patternScore = 0;

        // Signal quality
        this.averageSignalConfidence = 0;
        this.totalSignalReadings = 0;
        this.confidenceSum = 0;

        // Final scores
        this.finalScore = 0;
        this.passed = false;
        this.grade = null;

        // Status
        this.scenarioComplete = false;
        this.timeExpired = false;
    }

    /**
     * Initialize scoring for a scenario
     * @param {number} totalTargets - Total number of targets in scenario
     * @param {number} valuableTargets - Number of valuable (non-iron) targets
     * @param {number} trashTargets - Number of trash (iron) targets
     * @param {number} timeLimit - Time limit in seconds (null for unlimited)
     */
    initializeScenario(totalTargets, valuableTargets, trashTargets, timeLimit = null) {
        this.reset();
        this.totalTargets = totalTargets;
        this.valuableTargets = valuableTargets;
        this.trashTargets = trashTargets;
        this.timeLimit = timeLimit;
        this.startTime = Date.now();

        console.log(`Scoring initialized: ${totalTargets} targets (${valuableTargets} valuable, ${trashTargets} trash)`);
    }

    /**
     * Record a target found
     * @param {Object} target - Target object
     * @param {number} signalConfidence - Confidence level (0-100)
     */
    recordTargetFound(target, signalConfidence = 0) {
        const targetKey = `${target.name}_${target.x}_${target.y}`;

        if (!this.targetsFound.has(targetKey)) {
            this.targetsFound.add(targetKey);

            // Track valuable vs trash
            if (target.metalType === 'IRON') {
                this.trashTargetsFound.add(targetKey);
            } else {
                this.valuableTargetsFound.add(targetKey);
            }

            console.log(`Target found: ${target.name} (${target.metalType})`);
            console.log(`Progress: ${this.targetsFound.size}/${this.totalTargets}`);
        }
    }

    /**
     * Update coverage percentage
     * @param {number} coverage - Coverage percentage (0-100)
     */
    updateCoverage(coverage) {
        this.coveragePercentage = coverage;
    }

    /**
     * Update technique scores
     * @param {Object} techniqueReport - Report from TechniqueAnalyzer
     */
    updateTechnique(techniqueReport) {
        // Sweep speed score
        const speedDesc = techniqueReport.speedDescription;
        if (speedDesc === 'OPTIMAL') {
            this.sweepSpeedScore = 100;
        } else if (speedDesc === 'TOO SLOW' || speedDesc === 'TOO FAST') {
            this.sweepSpeedScore = 60;
        } else if (speedDesc === 'WAY TOO FAST') {
            this.sweepSpeedScore = 30;
        } else {
            this.sweepSpeedScore = 0;
        }

        // Pattern score
        const pattern = techniqueReport.searchPattern;
        if (pattern === 'SYSTEMATIC') {
            this.patternScore = 100;
        } else if (pattern === 'SWEEP') {
            this.patternScore = 75;
        } else if (pattern === 'RANDOM') {
            this.patternScore = 40;
        } else {
            this.patternScore = 50;
        }

        // Overall technique score (average of speed and pattern)
        this.techniqueScore = Math.round((this.sweepSpeedScore + this.patternScore) / 2);
    }

    /**
     * Update signal confidence tracking
     * @param {number} confidence - Confidence level (0-100)
     */
    updateSignalConfidence(confidence) {
        if (confidence > 0) {
            this.confidenceSum += confidence;
            this.totalSignalReadings++;
            this.averageSignalConfidence = Math.round(this.confidenceSum / this.totalSignalReadings);
        }
    }

    /**
     * Calculate search efficiency
     * Coverage divided by time taken
     * @returns {number} Efficiency score (0-100)
     */
    calculateSearchEfficiency() {
        const timeElapsedSeconds = this.getTimeElapsed() / 1000;

        if (timeElapsedSeconds < 10) {
            return 0; // Not enough time to calculate
        }

        // Efficiency = coverage per minute
        const minutes = timeElapsedSeconds / 60;
        const coveragePerMinute = this.coveragePercentage / minutes;

        // Scale to 0-100 (assume 30% coverage per minute is excellent)
        const efficiency = Math.min(100, (coveragePerMinute / 30) * 100);

        this.searchEfficiency = Math.round(efficiency);
        return this.searchEfficiency;
    }

    /**
     * Calculate final score
     * @returns {number} Final score (0-100)
     */
    calculateFinalScore() {
        // Component scores with weights
        const targetScore = this.calculateTargetScore(); // 40%
        const coverageScore = this.coveragePercentage; // 20%
        const techniqueScore = this.techniqueScore; // 20%
        const efficiencyScore = this.calculateSearchEfficiency(); // 10%
        const timeBonus = this.calculateTimeBonus(); // 10%

        this.finalScore = Math.round(
            (targetScore * 0.40) +
            (coverageScore * 0.20) +
            (techniqueScore * 0.20) +
            (efficiencyScore * 0.10) +
            (timeBonus * 0.10)
        );

        return this.finalScore;
    }

    /**
     * Calculate target finding score
     * Rewards finding valuable targets, penalizes missing them
     * @returns {number} Target score (0-100)
     */
    calculateTargetScore() {
        if (this.totalTargets === 0) return 0;

        // Points for finding targets
        const foundPercentage = (this.targetsFound.size / this.totalTargets) * 100;

        // Bonus for finding valuable targets
        let bonusPoints = 0;
        if (this.valuableTargets > 0) {
            const valuableFoundPercentage = (this.valuableTargetsFound.size / this.valuableTargets) * 100;
            bonusPoints = (valuableFoundPercentage - foundPercentage) * 0.2; // 20% bonus weight
        }

        return Math.min(100, Math.round(foundPercentage + bonusPoints));
    }

    /**
     * Calculate time bonus
     * Faster completion = higher bonus (if time limit exists)
     * @returns {number} Time bonus (0-100)
     */
    calculateTimeBonus() {
        if (!this.timeLimit) return 50; // Default bonus for no time limit

        const timeElapsedSeconds = this.getTimeElapsed() / 1000;
        const timeUsedPercentage = (timeElapsedSeconds / this.timeLimit) * 100;

        // Faster = better bonus
        if (timeUsedPercentage < 50) return 100;
        if (timeUsedPercentage < 75) return 75;
        if (timeUsedPercentage < 90) return 50;
        if (timeUsedPercentage < 100) return 25;
        return 0; // Over time
    }

    /**
     * Determine letter grade
     * @returns {string} Letter grade
     */
    calculateGrade() {
        const score = this.finalScore;

        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'A-';
        if (score >= 80) return 'B+';
        if (score >= 75) return 'B';
        if (score >= 70) return 'B-';
        if (score >= 65) return 'C+';
        if (score >= 60) return 'C';
        if (score >= 55) return 'C-';
        if (score >= 50) return 'D';
        return 'F';
    }

    /**
     * Check if scenario is complete
     * @returns {boolean} True if complete
     */
    checkCompletion() {
        // Complete if all valuable targets found
        if (this.valuableTargets > 0) {
            return this.valuableTargetsFound.size === this.valuableTargets;
        }

        // Or if all targets found
        return this.targetsFound.size === this.totalTargets;
    }

    /**
     * End the scenario and calculate final scores
     * @param {number} passingScore - Minimum score to pass (optional)
     */
    endScenario(passingScore = null) {
        this.endTime = Date.now();
        this.scenarioComplete = true;

        // Calculate all final metrics
        this.calculateFinalScore();
        this.grade = this.calculateGrade();

        // Check if passed
        if (passingScore !== null) {
            this.passed = this.finalScore >= passingScore;
        } else {
            this.passed = this.finalScore >= 60; // Default passing grade
        }

        console.log('=== Scenario Complete ===');
        console.log(`Final Score: ${this.finalScore}`);
        console.log(`Grade: ${this.grade}`);
        console.log(`Status: ${this.passed ? 'PASSED' : 'FAILED'}`);
    }

    /**
     * Get time elapsed in milliseconds
     * @returns {number} Time elapsed
     */
    getTimeElapsed() {
        if (this.endTime) {
            return this.endTime - this.startTime;
        }
        return Date.now() - this.startTime;
    }

    /**
     * Get remaining time in seconds
     * @returns {number|null} Remaining time or null if no limit
     */
    getRemainingTime() {
        if (!this.timeLimit) return null;

        const elapsed = this.getTimeElapsed() / 1000;
        const remaining = this.timeLimit - elapsed;

        if (remaining <= 0) {
            this.timeExpired = true;
            return 0;
        }

        return Math.ceil(remaining);
    }

    /**
     * Format time as MM:SS
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get comprehensive score report
     * @returns {Object} Score report
     */
    getReport() {
        return {
            // Targets
            targetsFound: this.targetsFound.size,
            totalTargets: this.totalTargets,
            valuableTargetsFound: this.valuableTargetsFound.size,
            valuableTargets: this.valuableTargets,
            trashTargetsFound: this.trashTargetsFound.size,
            trashTargets: this.trashTargets,

            // Coverage and efficiency
            coverage: Math.round(this.coveragePercentage),
            efficiency: this.searchEfficiency,

            // Technique
            techniqueScore: this.techniqueScore,
            sweepSpeedScore: this.sweepSpeedScore,
            patternScore: this.patternScore,

            // Time
            timeElapsed: this.getTimeElapsed(),
            timeElapsedFormatted: ScoringSystem.formatTime(this.getTimeElapsed() / 1000),
            timeRemaining: this.getRemainingTime(),
            timeLimit: this.timeLimit,
            timeExpired: this.timeExpired,

            // Final scores
            finalScore: this.finalScore,
            grade: this.grade,
            passed: this.passed,

            // Status
            complete: this.scenarioComplete
        };
    }

    /**
     * Export results as JSON string
     * @returns {string} JSON string
     */
    exportResults() {
        const report = this.getReport();
        return JSON.stringify(report, null, 2);
    }
}
