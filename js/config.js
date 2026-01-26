/**
 * Configuration file for Metal Detector Visualization
 * All constants and settings are centralized here
 */

// Canvas Configuration
export const CANVAS = {
    WIDTH: 800,
    HEIGHT: 600,
    BACKGROUND_COLOR: '#f5f5f5'
};

// Grid Configuration for Heat Map
export const GRID = {
    RESOLUTION: 10,  // Size of each grid cell in pixels
    COLS: Math.floor(CANVAS.WIDTH / 10),
    ROWS: Math.floor(CANVAS.HEIGHT / 10)
};

// Detector Configuration
export const DETECTOR = {
    RADIUS: 50,           // Detection radius in pixels
    POSITION_COLOR: '#2196F3',
    CONE_OPACITY: 30,
    CONE_ANGLE: 60,       // Degrees
    TRAIL_LENGTH: 20      // Number of position history points to keep
};

// Signal Configuration
export const SIGNAL = {
    MAX_STRENGTH: 100,
    MIN_STRENGTH: 0,
    DECAY_RATE: 0.92,     // Heat map decay factor per frame (0-1) - set to 1.0 to disable decay
    ENABLE_DECAY: false,  // Set to false for permanent heat map showing object locations
    DETECTION_RANGE: 150, // Maximum distance to detect objects (pixels)
    FREQUENCY_MIN: 100,   // Hz
    FREQUENCY_MAX: 900    // Hz
};

// Buried Objects Configuration
// Each object represents a metal target buried in the simulation
export const BURIED_OBJECTS = [
    {
        x: 200,
        y: 150,
        strength: 90,
        metalType: 'SILVER',  // High conductor
        name: 'Silver Coin'
    },
    {
        x: 450,
        y: 300,
        strength: 70,
        metalType: 'COPPER',  // Medium-high conductor
        name: 'Copper Pipe'
    },
    {
        x: 600,
        y: 180,
        strength: 50,
        metalType: 'ALUMINUM',  // Medium conductor
        name: 'Aluminum Can'
    },
    {
        x: 250,
        y: 450,
        strength: 85,
        metalType: 'IRON',  // Low conductor (ferrous)
        name: 'Iron Fragment'
    },
    {
        x: 650,
        y: 450,
        strength: 40,
        metalType: 'COPPER',  // Medium-high conductor
        name: 'Small Copper Object'
    }
];

// Color Schemes
export const COLORS = {
    // Thermal color scheme (blue -> cyan -> yellow -> red)
    THERMAL: {
        LOW: [0, 0, 255],      // Blue
        MID_LOW: [0, 255, 255], // Cyan
        MID_HIGH: [255, 255, 0], // Yellow
        HIGH: [255, 0, 0]       // Red
    },
    
    // Simple gradient alternative
    SIMPLE: {
        LOW: [50, 50, 200],
        HIGH: [255, 100, 100]
    }
};

// Current active color scheme
export const ACTIVE_COLOR_SCHEME = 'THERMAL';

// Performance Settings
export const PERFORMANCE = {
    FRAME_RATE: 60,
    ENABLE_SMOOTHING: true
};

// Debug Settings
export const DEBUG = {
    SHOW_GRID: false,
    SHOW_OBJECT_LOCATIONS: false,  // Set to true to see actual buried objects
    SHOW_FPS: false,
    SHOW_VALUES: false,  // Show VDI, phase, etc. on screen
    LOG_SIGNALS: false
};
