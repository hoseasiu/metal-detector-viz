/**
 * MetalTypes.js
 * Defines metal type characteristics and properties
 * Used for realistic metal discrimination simulation
 */

/**
 * Metal Type Definitions
 * Each metal type has distinct electrical and magnetic properties
 * that affect how a metal detector responds to it
 */
export const METAL_TYPES = {
    IRON: {
        name: 'Iron (Ferrous)',
        shortName: 'IRON',
        // VDI (Visual Discrimination Indicator) range: lower values for ferrous metals
        vdiRange: [0, 30],
        // Phase shift in degrees (ferrous metals have lower phase shift)
        phaseRange: [20, 40],
        // Audio frequency range for future audio feature
        audioFreqRange: [100, 300],
        // Typical detection depth multiplier
        depthMultiplier: 1.2,  // Iron is easier to detect
        // Color for visualization (reddish/orange tones)
        color: [255, 100, 80],
        // Conductivity category
        conductivity: 'LOW',
        // Common examples
        examples: ['Nails', 'Iron fragments', 'Steel objects', 'Ferrous debris']
    },
    
    ALUMINUM: {
        name: 'Aluminum',
        shortName: 'ALUMINUM',
        // Mid-range VDI values
        vdiRange: [35, 55],
        // Mid-range phase shift
        phaseRange: [60, 100],
        // Audio frequency range
        audioFreqRange: [300, 450],
        // Detection depth
        depthMultiplier: 0.9,
        // Color for visualization (silver/gray tones)
        color: [180, 180, 200],
        conductivity: 'MEDIUM',
        examples: ['Aluminum foil', 'Soda cans', 'Aluminum coins', 'Pull tabs']
    },
    
    COPPER: {
        name: 'Copper',
        shortName: 'COPPER',
        // Higher VDI range
        vdiRange: [60, 75],
        // Higher phase shift
        phaseRange: [120, 150],
        // Audio frequency range
        audioFreqRange: [500, 700],
        // Good detection depth
        depthMultiplier: 1.0,
        // Color for visualization (orange/brown tones)
        color: [255, 165, 60],
        conductivity: 'HIGH',
        examples: ['Copper pipes', 'Copper coins', 'Brass objects']
    },
    
    SILVER: {
        name: 'Silver/High Conductor',
        shortName: 'SILVER',
        // Highest VDI range
        vdiRange: [80, 99],
        // Highest phase shift
        phaseRange: [160, 180],
        // Audio frequency range
        audioFreqRange: [750, 900],
        // Excellent detection depth
        depthMultiplier: 1.1,
        // Color for visualization (bright silver/cyan tones)
        color: [200, 240, 255],
        conductivity: 'VERY_HIGH',
        examples: ['Silver coins', 'High-grade jewelry', 'Some gold items']
    }
};

/**
 * Get metal type from VDI value
 * @param {number} vdi - VDI value (0-99)
 * @returns {Object} Metal type object
 */
export function getMetalTypeFromVDI(vdi) {
    for (let type in METAL_TYPES) {
        const metalType = METAL_TYPES[type];
        if (vdi >= metalType.vdiRange[0] && vdi <= metalType.vdiRange[1]) {
            return metalType;
        }
    }
    // Default to iron if out of range
    return METAL_TYPES.IRON;
}

/**
 * Get metal type from phase shift
 * @param {number} phase - Phase shift in degrees (0-180)
 * @returns {Object} Metal type object
 */
export function getMetalTypeFromPhase(phase) {
    for (let type in METAL_TYPES) {
        const metalType = METAL_TYPES[type];
        if (phase >= metalType.phaseRange[0] && phase <= metalType.phaseRange[1]) {
            return metalType;
        }
    }
    // Default to iron if out of range
    return METAL_TYPES.IRON;
}

/**
 * Get color for metal type with signal strength blending
 * @param {Object} metalType - Metal type object
 * @param {number} strength - Signal strength (0-100)
 * @returns {Array} RGB color array [r, g, b]
 */
export function getColorForSignal(metalType, strength) {
    // Normalize strength to 0-1
    const normalizedStrength = strength / 100;
    
    // Base color from metal type
    const baseColor = metalType.color;
    
    // Blend with white based on strength (stronger = brighter)
    const r = Math.floor(baseColor[0] * normalizedStrength + 255 * (1 - normalizedStrength));
    const g = Math.floor(baseColor[1] * normalizedStrength + 255 * (1 - normalizedStrength));
    const b = Math.floor(baseColor[2] * normalizedStrength + 255 * (1 - normalizedStrength));
    
    return [r, g, b];
}

/**
 * Calculate VDI from metal type (with randomization for realism)
 * @param {Object} metalType - Metal type object
 * @returns {number} VDI value (0-99)
 */
export function calculateVDI(metalType) {
    const min = metalType.vdiRange[0];
    const max = metalType.vdiRange[1];
    
    // Random value within the metal type's VDI range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate phase shift from metal type (with randomization for realism)
 * @param {Object} metalType - Metal type object
 * @returns {number} Phase shift in degrees (0-180)
 */
export function calculatePhase(metalType) {
    const min = metalType.phaseRange[0];
    const max = metalType.phaseRange[1];
    
    // Random value within the metal type's phase range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate audio frequency from metal type and signal strength
 * @param {Object} metalType - Metal type object
 * @param {number} strength - Signal strength (0-100)
 * @returns {number} Frequency in Hz
 */
export function calculateAudioFrequency(metalType, strength) {
    const min = metalType.audioFreqRange[0];
    const max = metalType.audioFreqRange[1];
    
    // Normalize strength to 0-1
    const normalizedStrength = strength / 100;
    
    // Map strength to frequency range (stronger = higher pitch within metal type range)
    return min + (normalizedStrength * (max - min));
}

/**
 * Get all metal type names
 * @returns {Array} Array of metal type names
 */
export function getAllMetalTypeNames() {
    return Object.keys(METAL_TYPES);
}

/**
 * Get metal type by name
 * @param {string} name - Metal type name (IRON, ALUMINUM, COPPER, SILVER)
 * @returns {Object} Metal type object
 */
export function getMetalType(name) {
    return METAL_TYPES[name] || METAL_TYPES.IRON;
}
