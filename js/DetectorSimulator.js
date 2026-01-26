/**
 * DetectorSimulator
 * Simulates metal detector signals based on position
 * Calculates signal strength based on distance to buried objects
 */

import { BURIED_OBJECTS, SIGNAL } from './config.js';
import { getMetalType, calculateVDI, calculatePhase, calculateAudioFrequency } from './MetalTypes.js';

export class DetectorSimulator {
    constructor() {
        this.objects = BURIED_OBJECTS;
    }
    
    /**
     * Get signal at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} Signal data { strength, frequency, metalType, vdi, phase, closestObject }
     */
    getSignal(x, y) {
        let maxStrength = 0;
        let closestObject = null;
        let closestDistance = Infinity;
        
        // Check each buried object
        for (let obj of this.objects) {
            const distance = this.calculateDistance(x, y, obj.x, obj.y);
            
            // Only detect if within range
            if (distance < SIGNAL.DETECTION_RANGE) {
                // Calculate signal strength based on distance
                // Closer = stronger signal
                const strength = this.calculateSignalStrength(distance, obj.strength);
                
                if (strength > maxStrength) {
                    maxStrength = strength;
                    closestObject = obj;
                    closestDistance = distance;
                }
            }
        }
        
        // If we detected something, get its metal type properties
        let metalType = null;
        let vdi = 0;
        let phase = 0;
        let audioFreq = 0;
        
        if (closestObject) {
            // Get metal type object from the buried object's metalType string
            metalType = getMetalType(closestObject.metalType);
            
            // Calculate VDI and phase based on metal type
            vdi = calculateVDI(metalType);
            phase = calculatePhase(metalType);
            
            // Calculate audio frequency based on metal type and signal strength
            audioFreq = calculateAudioFrequency(metalType, maxStrength);
        }
        
        return {
            strength: maxStrength,
            frequency: audioFreq,
            metalType: metalType,
            vdi: vdi,
            phase: phase,
            closestObject: closestObject,
            distance: closestDistance
        };
    }
    
    /**
     * Calculate Euclidean distance between two points
     */
    calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Calculate signal strength based on distance to object
     * Signal is maximum at the object, drops to zero at detection range
     * Uses steep fourth-power falloff for localized detection
     * @param {number} distance - Distance to object
     * @param {number} objectStrength - Base strength of the object
     * @returns {number} Signal strength (0-100)
     */
    calculateSignalStrength(distance, objectStrength) {
        if (distance === 0) return objectStrength;
        
        // Don't detect beyond range
        if (distance >= SIGNAL.DETECTION_RANGE) return 0;
        
        // Normalize distance (0 at object, 1 at detection range)
        const normalizedDistance = distance / SIGNAL.DETECTION_RANGE;
        
        // Use steep fourth-power falloff
        // (1 - normalizedDistance)^4 gives very localized detection
        const falloff = Math.pow(1 - normalizedDistance, 4);
        const strength = objectStrength * falloff;
        
        // Clamp between min and max
        return Math.max(SIGNAL.MIN_STRENGTH, Math.min(SIGNAL.MAX_STRENGTH, strength));
    }
    
    /**
     * Calculate audio frequency based on signal strength
     * Stronger signals produce higher frequency tones
     * @param {number} strength - Signal strength (0-100)
     * @returns {number} Frequency in Hz
     */
    calculateFrequency(strength) {
        // Linear mapping from strength to frequency
        const normalized = strength / SIGNAL.MAX_STRENGTH;
        return SIGNAL.FREQUENCY_MIN + (normalized * (SIGNAL.FREQUENCY_MAX - SIGNAL.FREQUENCY_MIN));
    }
    
    /**
     * Get all buried objects (for debugging/ground truth)
     * @returns {Array} Array of buried objects
     */
    getObjects() {
        return this.objects;
    }
    
    /**
     * Add a new buried object (for dynamic scenarios later)
     * @param {Object} object - Object with x, y, strength properties
     */
    addObject(object) {
        this.objects.push(object);
    }
    
    /**
     * Clear all objects (for scenario reset)
     */
    clearObjects() {
        this.objects = [];
    }
    
    /**
     * Reset to default objects
     */
    reset() {
        this.objects = [...BURIED_OBJECTS];
    }
}
