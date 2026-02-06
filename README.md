# Metal Detector Visualization - Training Simulator

An interactive web-based metal detector training simulator built with P5.js for the Build for Ukraine 2026 course at MIT.

## Current Status: Week 3 Complete ✅

### Week 3 Features (Audio Engine + Metrics Panel + Signal Analysis)
- **Realistic Audio Engine**: Mimics actual metal detector beeping behavior
  - Discrete beeps (not continuous tones) at 1-6 beeps/sec based on signal strength
  - Multi-tone system (3-tone Garrett style or 4-tone Minelab style)
  - VDI-based frequency bins: Iron (100-250 Hz), Aluminum (300-500 Hz), Copper (500-700 Hz), Silver (700-900 Hz)
  - Volume modulation based on proximity
  - Optional threshold mode (continuous background hum)
  - User controls: mute/unmute, volume slider, tone system selector, mode selector
- **Metrics Panel**: Real-time detector readings displayed in fixed side panel
  - Signal analysis: strength, VDI, phase shift, frequency, distance
  - Target identification: metal type, conductivity level, confidence rating
  - Search statistics: coverage percentage, targets found, search time
  - Audio controls: integrated audio settings and controls
  - Technique feedback: real-time tips based on user behavior
- **Signal Analyzer**: Evaluates signal quality and stability
  - Calculates signal stability (VDI consistency)
  - Measures signal repeatability
  - Determines confidence level (0-100%)
  - Quality rating: EXCELLENT, GOOD, FAIR, POOR, JUNK
  - Target locking when signal is stable
- **Technique Analyzer**: Monitors user's metal detecting technique
  - Tracks sweep speed (optimal: 180-480 px/sec)
  - Analyzes search patterns (SYSTEMATIC, SWEEP, RANDOM)
  - Calculates search efficiency
  - Provides real-time feedback messages
  - Detects common mistakes (too fast, too slow, hovering)

### Week 2 Features (Metal Type Discrimination + Coverage Tracking)
- **Metal Type Discrimination**: Different metal types display with distinct colors
  - Iron (Ferrous): Red/orange tones (VDI 0-30)
  - Aluminum: Gray/silver tones (VDI 35-55)
  - Copper: Orange/yellow tones (VDI 60-75)
  - Silver: Cyan/blue tones (VDI 80-99)
- **VDI & Phase Shift Calculations**: Realistic metal detector metrics
- **Coverage Tracking**: Visual overlay showing searched areas
- **Interactive Legend**: Shows metal type colors and VDI ranges
- **Enhanced Signal Data**: Each detection includes metal type, VDI, phase shift, and audio frequency

### Week 1 Features (Core Functionality)
- Mouse-controlled detector position
- Real-time heat map visualization
- Signal strength-based coloring
- Smooth decay effects
- Multiple buried objects with varying strengths

## How to Use

### Running Locally
1. Clone the repository
2. Start a local server (required for ES6 modules):
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser

### Controls
- **Mouse**: Move detector around the canvas
- **A**: Toggle audio on/off (or use button in metrics panel)
- **R**: Reset heat map, coverage, and all analyzers
- **L**: Toggle legend visibility
- **D**: Toggle debug mode (show buried object locations)
- **M**: Toggle heat map mode (fading vs permanent)
- **C**: Toggle metal type colors on/off
- **F**: Toggle FPS display
- **G**: Toggle grid overlay
- **V**: Toggle value display
- **Space**: Clear detector trail

## Features

### Visual Elements
1. **Heat Map**: Shows signal strength with color-coded metal types
2. **Coverage Map**: Subtle green overlay showing searched areas
3. **Legend**: Color key explaining metal types and VDI ranges
4. **Detector**: Blue circle showing current position
5. **Debug Mode**: Red markers showing actual buried object locations (press D)

### Metal Detection
- 5 buried objects of different metal types
- Realistic signal falloff based on distance
- VDI (Visual Display Indicator) values: 0-99 scale
- Phase shift calculations: 0-180 degrees
- Audio frequency mapping (for future audio feature)

### Coverage Statistics
- Percentage of area searched
- Visual feedback on search patterns
- Time-based fade (optional)

## Technical Architecture

### File Structure
```
metal-detector-viz/
├── index.html
├── styles.css
├── sketch.js                    # Main P5.js sketch
├── README.md
├── 4-WEEK-DEVELOPMENT-PLAN.md
└── js/
    ├── config.js                # Settings and constants
    ├── DetectorSimulator.js     # Signal generation
    ├── HeatMapRenderer.js       # Heat map visualization
    ├── DetectorRenderer.js      # Detector position
    ├── MetalTypes.js            # Metal type definitions
    ├── CoverageRenderer.js      # Coverage tracking
    ├── Legend.js                # Legend UI
    ├── AudioEngine.js           # ✨ NEW: Realistic beeping audio
    ├── MetricsPanel.js          # ✨ NEW: Real-time readings panel
    ├── SignalAnalyzer.js        # ✨ NEW: Signal quality analysis
    └── TechniqueAnalyzer.js     # ✨ NEW: Technique feedback
```

### Key Components

#### AudioEngine.js (Week 3)
Realistic metal detector audio simulation:
- Discrete beeping pattern (1-6 beeps/sec based on signal strength)
- Multi-tone bins: 3-tone (Garrett) or 4-tone (Minelab) system
- VDI-mapped frequencies (Iron: 150 Hz, Aluminum: 450 Hz, Coins: 800 Hz)
- Volume scales with signal strength
- Optional threshold mode (continuous hum with pitch variations)
- Web Audio API with oscillator + gain nodes

#### MetricsPanel.js (Week 3)
DOM-based side panel for real-time data:
- Signal analysis section (strength, VDI, phase, frequency, distance)
- Target identification (metal type, conductivity, confidence)
- Search statistics (coverage %, targets found, search time)
- Audio controls (toggle, volume, tone system, mode)
- Technique feedback display
- Minimizable, responsive design

#### SignalAnalyzer.js (Week 3)
Analyzes signal characteristics over time:
- Stability calculation (VDI consistency using standard deviation)
- Repeatability measurement (signal consistency)
- Confidence scoring (0-100% based on multiple factors)
- Quality rating (EXCELLENT/GOOD/FAIR/POOR/JUNK)
- Target locking when signal is stable
- Trend detection (INCREASING/DECREASING/STABLE)

#### TechniqueAnalyzer.js (Week 3)
Monitors user's detecting technique:
- Sweep speed tracking (optimal: 3-8 px/frame = 180-480 px/sec)
- Search pattern analysis (SYSTEMATIC/SWEEP/RANDOM)
- Efficiency calculation (coverage vs distance traveled)
- Real-time feedback messages (with cooldown to avoid spam)
- Detects common mistakes (too fast, too slow, hovering)

#### MetalTypes.js
Defines properties for each metal type:
- VDI range (discrimination values)
- Phase shift range (electromagnetic response)
- Audio frequency range (used by AudioEngine)
- Display colors
- Conductivity categories

#### CoverageRenderer.js
Tracks and visualizes search coverage:
- Grid-based coverage tracking
- Time-stamped cell marking
- Optional fade-out over time
- Coverage percentage calculation

#### Legend.js
Visual guide showing:
- Metal type colors
- VDI value ranges
- Signal strength scale
- Toggle visibility with 'L' key

#### HeatMapRenderer.js (Enhanced)
Now includes:
- Metal type-specific coloring
- Dual grid system (signal + metal type)
- Toggle between thermal and metal type colors
- Proper blending for overlapping signals

#### DetectorSimulator.js (Enhanced)
Enhanced signal output:
```javascript
{
  strength: 75,           // Signal strength (0-100)
  frequency: 650,         // Audio frequency (100-900 Hz)
  metalType: {...},       // Metal type object
  vdi: 85,                // VDI value (0-99)
  phase: 165,             // Phase shift (0-180°)
  closestObject: {...},   // Nearest detected object
  distance: 45.3          // Distance to object (pixels)
}
```

## Metal Type Properties

| Metal Type | VDI Range | Phase Range | Color | Conductivity |
|------------|-----------|-------------|-------|--------------|
| Iron       | 0-30      | 20-40°      | Red/Orange | Low |
| Aluminum   | 35-55     | 60-100°     | Gray/Silver | Medium |
| Copper     | 60-75     | 120-150°    | Orange/Yellow | High |
| Silver     | 80-99     | 160-180°    | Cyan/Blue | Very High |

## Development Timeline

- ✅ **Week 1**: Core heat map + detector position
- ✅ **Week 2**: Metal type discrimination + coverage tracking
- ✅ **Week 3**: Audio engine + metrics panel + signal analysis + technique feedback
- 🎯 **Week 4**: Scenarios + scoring + ground truth (planned)

## Next Steps (Week 4)

- [ ] Pre-defined training scenarios (beginner, intermediate, advanced)
- [ ] Scoring system (targets found, false alarms, efficiency)
- [ ] Ground truth visualization toggle
- [ ] Scenario selector and settings panel
- [ ] Performance tracking and export results
- [ ] Final UI polish and documentation

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (touch supported, but desktop recommended)

## Technologies Used

- **P5.js**: Graphics and interaction
- **ES6 Modules**: Clean code organization
- **HTML5 Canvas**: 2D rendering
- **CSS3**: Styling and layout

## Educational Purpose

This simulator is being developed for the **Build for Ukraine 2026** course at MIT to help students understand:
- Metal detector physics and operation
- Signal processing concepts
- Electromagnetic induction
- Metal discrimination techniques
- Search pattern efficiency

Potential applications include training for:
- Humanitarian demining
- Archaeological surveys
- Security screening
- Treasure hunting

## Contributing

This is a course project for MIT's Build for Ukraine. Feedback and suggestions are welcome!

## License

Educational use for MIT Build for Ukraine 2026.

## Acknowledgments

- MIT Build for Ukraine program
- United4Knowledge Consortium
- MIT-Ukraine partnership
- Course instructors and students

---

**Last Updated**: Week 3 Complete - Audio Engine, Metrics Panel, Signal & Technique Analysis
**Next Milestone**: Week 4 - Training Scenarios, Scoring System & Ground Truth
