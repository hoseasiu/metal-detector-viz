/**
 * SignalAnalyzer
 * Analyzes signal characteristics over time to evaluate quality and stability
 * Helps distinguish "good" targets from "junk" signals
 */

export class SignalAnalyzer {
    constructor() {
        // Signal history for analysis
        this.signalHistory = [];
        this.maxHistoryLength = 30; // Keep last 30 readings (~0.5 seconds at 60fps)

        // Analysis results
        this.currentAnalysis = {
            stability: 0,        // 0-100: how consistent the signal is
            quality: 'UNKNOWN',  // EXCELLENT, GOOD, FAIR, POOR, JUNK
            repeatability: 0,    // 0-100: signal repeatability from different angles
            confidence: 0        // 0-100: overall confidence in target ID
        };

        // Detection state
        this.targetLocked = false;
        this.lastTargetVDI = null;
    }

    /**
     * Update analyzer with new signal data
     * @param {Object} signal - Signal object from DetectorSimulator
     */
    update(signal) {
        // Add to history
        this.addToHistory(signal);

        // Analyze if we have enough data
        if (this.signalHistory.length >= 5) {
            this.analyzeSignal();
        }

        return this.currentAnalysis;
    }

    /**
     * Add signal to history
     * @param {Object} signal - Signal data
     */
    addToHistory(signal) {
        const historyEntry = {
            timestamp: Date.now(),
            strength: signal.strength,
            vdi: signal.vdi,
            phase: signal.phase,
            metalType: signal.metalType ? signal.metalType.name : null,
            distance: signal.distance
        };

        this.signalHistory.push(historyEntry);

        // Trim history
        if (this.signalHistory.length > this.maxHistoryLength) {
            this.signalHistory.shift();
        }
    }

    /**
     * Analyze signal characteristics
     */
    analyzeSignal() {
        // Calculate stability (consistency of VDI readings)
        this.currentAnalysis.stability = this.calculateStability();

        // Calculate repeatability (signal consistency over time)
        this.currentAnalysis.repeatability = this.calculateRepeatability();

        // Calculate overall confidence
        this.currentAnalysis.confidence = this.calculateConfidence();

        // Determine signal quality
        this.currentAnalysis.quality = this.determineQuality();

        // Check for target lock
        this.checkTargetLock();
    }

    /**
     * Calculate signal stability
     * Measures how consistent VDI readings are
     * @returns {number} Stability score (0-100)
     */
    calculateStability() {
        if (this.signalHistory.length < 5) return 0;

        // Get recent VDI readings (only when signal present)
        const vdiReadings = this.signalHistory
            .filter(entry => entry.strength > 10 && entry.vdi !== null)
            .map(entry => entry.vdi);

        if (vdiReadings.length < 3) return 0;

        // Calculate standard deviation
        const mean = vdiReadings.reduce((a, b) => a + b, 0) / vdiReadings.length;
        const variance = vdiReadings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / vdiReadings.length;
        const stdDev = Math.sqrt(variance);

        // Convert to stability score (lower stdDev = higher stability)
        // stdDev of 0 = 100%, stdDev of 20+ = 0%
        const stability = Math.max(0, Math.min(100, 100 - (stdDev * 5)));

        return Math.round(stability);
    }

    /**
     * Calculate signal repeatability
     * Measures how reliably the signal appears
     * @returns {number} Repeatability score (0-100)
     */
    calculateRepeatability() {
        if (this.signalHistory.length < 10) return 0;

        // Count how many times signal was present vs absent
        const signalPresent = this.signalHistory.filter(entry => entry.strength > 10).length;
        const signalAbsent = this.signalHistory.length - signalPresent;

        // Good targets: consistent presence or absence
        // Junk targets: erratic on/off pattern

        // If mostly present or mostly absent = good repeatability
        const presenceRatio = signalPresent / this.signalHistory.length;

        let repeatability;
        if (presenceRatio > 0.7 || presenceRatio < 0.3) {
            // Consistent behavior
            repeatability = 80 + (Math.abs(presenceRatio - 0.5) * 40);
        } else {
            // Erratic behavior
            repeatability = 40;
        }

        return Math.round(repeatability);
    }

    /**
     * Calculate overall confidence in target identification
     * @returns {number} Confidence score (0-100)
     */
    calculateConfidence() {
        // Weighted average of stability and repeatability
        const stability = this.currentAnalysis.stability || 0;
        const repeatability = this.currentAnalysis.repeatability || 0;

        // Get average signal strength
        const avgStrength = this.getAverageStrength();

        // Strong signals with stable VDI = high confidence
        const strengthWeight = Math.min(100, avgStrength * 1.2);

        const confidence = (stability * 0.4) + (repeatability * 0.3) + (strengthWeight * 0.3);

        return Math.round(confidence);
    }

    /**
     * Determine signal quality category
     * @returns {string} Quality rating
     */
    determineQuality() {
        const confidence = this.currentAnalysis.confidence;
        const stability = this.currentAnalysis.stability;
        const avgStrength = this.getAverageStrength();

        // Excellent: High confidence, high stability, strong signal
        if (confidence > 80 && stability > 75 && avgStrength > 60) {
            return 'EXCELLENT';
        }

        // Good: Decent confidence and stability
        if (confidence > 60 && stability > 60) {
            return 'GOOD';
        }

        // Fair: Moderate readings
        if (confidence > 40 && stability > 40) {
            return 'FAIR';
        }

        // Poor: Low confidence or stability
        if (confidence > 20 || stability > 20) {
            return 'POOR';
        }

        // Junk: Very unreliable signal
        return 'JUNK';
    }

    /**
     * Check if target is locked (consistent readings)
     */
    checkTargetLock() {
        const stability = this.currentAnalysis.stability;
        const avgStrength = this.getAverageStrength();

        // Target is locked if stable and strong
        if (stability > 70 && avgStrength > 40) {
            if (!this.targetLocked) {
                this.targetLocked = true;
                const vdiReadings = this.signalHistory
                    .filter(entry => entry.vdi !== null)
                    .map(entry => entry.vdi);
                if (vdiReadings.length > 0) {
                    this.lastTargetVDI = Math.round(
                        vdiReadings.reduce((a, b) => a + b) / vdiReadings.length
                    );
                }
            }
        } else {
            this.targetLocked = false;
            this.lastTargetVDI = null;
        }
    }

    /**
     * Get average signal strength from history
     * @returns {number} Average strength
     */
    getAverageStrength() {
        if (this.signalHistory.length === 0) return 0;

        const validReadings = this.signalHistory
            .filter(entry => entry.strength > 0)
            .map(entry => entry.strength);

        if (validReadings.length === 0) return 0;

        return validReadings.reduce((a, b) => a + b, 0) / validReadings.length;
    }

    /**
     * Get recommended action based on signal analysis
     * @returns {string} Recommendation message
     */
    getRecommendation() {
        const { quality, confidence, stability } = this.currentAnalysis;

        if (quality === 'EXCELLENT') {
            return '✓ Strong target! High confidence detection.';
        }

        if (quality === 'GOOD') {
            return '✓ Good signal. Likely a valid target.';
        }

        if (quality === 'FAIR') {
            if (stability < 50) {
                return '⚠ Unstable signal. Try different sweep angle.';
            }
            return '⚠ Moderate signal. May be deep or small target.';
        }

        if (quality === 'POOR') {
            return '⚠ Weak or unstable signal. Possibly edge of target.';
        }

        if (quality === 'JUNK') {
            return '✗ Very poor signal quality. Likely junk or interference.';
        }

        return 'Sweep detector over area to analyze signal...';
    }

    /**
     * Check if signal characteristics match a specific metal type
     * @param {string} metalTypeName - Metal type name to check
     * @returns {boolean} True if signal matches
     */
    matchesMetalType(metalTypeName) {
        if (!this.targetLocked) return false;

        const recentMetalTypes = this.signalHistory
            .filter(entry => entry.metalType !== null)
            .map(entry => entry.metalType);

        if (recentMetalTypes.length === 0) return false;

        // Check if majority of readings match the metal type
        const matchCount = recentMetalTypes.filter(type => type === metalTypeName).length;
        return (matchCount / recentMetalTypes.length) > 0.6;
    }

    /**
     * Get signal trend (getting stronger, weaker, or stable)
     * @returns {string} Trend direction: 'INCREASING', 'DECREASING', 'STABLE'
     */
    getTrend() {
        if (this.signalHistory.length < 10) return 'STABLE';

        const firstHalf = this.signalHistory.slice(0, Math.floor(this.signalHistory.length / 2));
        const secondHalf = this.signalHistory.slice(Math.floor(this.signalHistory.length / 2));

        const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.strength, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.strength, 0) / secondHalf.length;

        const change = secondAvg - firstAvg;

        if (change > 5) return 'INCREASING';
        if (change < -5) return 'DECREASING';
        return 'STABLE';
    }

    /**
     * Reset analyzer
     */
    reset() {
        this.signalHistory = [];
        this.targetLocked = false;
        this.lastTargetVDI = null;
        this.currentAnalysis = {
            stability: 0,
            quality: 'UNKNOWN',
            repeatability: 0,
            confidence: 0
        };
    }

    /**
     * Get current analysis results
     * @returns {Object} Analysis object
     */
    getAnalysis() {
        return {
            ...this.currentAnalysis,
            targetLocked: this.targetLocked,
            targetVDI: this.lastTargetVDI,
            trend: this.getTrend(),
            recommendation: this.getRecommendation()
        };
    }
}
