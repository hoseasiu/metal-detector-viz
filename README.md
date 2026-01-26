# Metal Detector Visualization - Training Simulator

An interactive web-based metal detector training simulator built with P5.js for the Build for Ukraine Spring 2025 course at MIT.

## Current Status: Week 2 Complete ✅

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
- **R**: Reset heat map and coverage tracking
- **L**: Toggle legend visibility
- **D**: Toggle debug mode (show buried object locations)
- **M**: Toggle heat map mode (fading vs permanent)
- **C**: Toggle metal type colors on/off
- **F**: Toggle FPS display
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
    ├── MetalTypes.js            # ✨ NEW: Metal type definitions
    ├── CoverageRenderer.js      # ✨ NEW: Coverage tracking
    └── Legend.js                # ✨ NEW: Legend UI
```

### Key Components

#### MetalTypes.js
Defines properties for each metal type:
- VDI range (discrimination values)
- Phase shift range (electromagnetic response)
- Audio frequency range (for future audio feature)
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
- 🎯 **Week 3**: Metrics panel + signal analysis + audio (planned)
- 🎯 **Week 4**: Scenarios + scoring + ground truth (planned)

## Next Steps (Week 3)

- [ ] Metrics panel showing VDI, phase, depth
- [ ] Signal analyzer for quality assessment
- [ ] Technique feedback (sweep speed)
- [ ] Two-column responsive layout
- [ ] Optional audio tone generation (Web Audio API)

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

This simulator is being developed for the **Build for Ukraine Spring 2025** course at MIT to help students understand:
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

Educational use for MIT Build for Ukraine Spring 2025.

## Acknowledgments

- MIT Build for Ukraine program
- United4Knowledge Consortium
- MIT-Ukraine partnership
- Course instructors and students

---

**Last Updated**: Week 2 Complete - Metal Type Discrimination & Coverage Tracking  
**Next Milestone**: Week 3 - Metrics Panel & Audio Integration
