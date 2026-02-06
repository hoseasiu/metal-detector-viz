# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive metal detector training simulator built with P5.js for MIT's Build for Ukraine 2026 course. The simulator visualizes electromagnetic metal detection with realistic signal processing, metal type discrimination, and coverage tracking to help train students for humanitarian demining and similar applications.

## Running the Application

### Local Development
```bash
# Start a local server (required for ES6 modules)
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

The application uses ES6 modules and requires a local server. Simply opening `index.html` directly will not work due to CORS restrictions.

### Debug Mode
Access `http://localhost:8000/debug.html` for enhanced debugging features and detailed signal information.

## Architecture

### Module System
The codebase uses **ES6 modules** with explicit imports/exports. All JavaScript files use `export` for components and `import` for dependencies. The main entry point is `sketch.js`, which integrates all modules using P5.js global mode.

### Component Structure

**Core Simulation:**
- `DetectorSimulator.js` - Generates realistic metal detector signals based on position, calculates distance-based signal strength with fourth-power falloff, and integrates metal type properties
- `MetalTypes.js` - Defines metal properties (VDI ranges, phase shift, audio frequencies, conductivity levels) for IRON, ALUMINUM, COPPER, and SILVER

**Visualization Layers (render order matters):**
1. `CoverageRenderer.js` - Bottom layer, subtle green overlay tracking searched areas
2. `HeatMapRenderer.js` - Middle layer, color-coded signal strength with metal type discrimination
3. `DetectorRenderer.js` - Top layer, blue circle showing current detector position
4. `Legend.js` - UI overlay explaining metal type colors and VDI ranges

**Configuration:**
- `config.js` - Centralized constants for canvas size, grid resolution, signal parameters, buried objects, and debug settings

### Key Technical Details

**Signal Processing:**
- Detection range: 150 pixels from object center
- Fourth-power falloff for realistic localized detection: `strength = objectStrength × (1 - distance/range)^4`
- VDI (Visual Display Indicator): 0-99 scale based on metal conductivity
- Phase shift: 0-180° electromagnetic response characteristic

**Metal Type Discrimination:**
The system assigns distinct properties to each metal type:
- **Iron (VDI 0-30)**: Red/orange tones, low conductivity, ferrous
- **Aluminum (VDI 35-55)**: Gray/silver tones, medium conductivity
- **Copper (VDI 60-75)**: Orange/yellow tones, high conductivity
- **Silver (VDI 80-99)**: Cyan/blue tones, very high conductivity

**Grid System:**
- 10-pixel resolution grid cells (80×60 grid for 800×600 canvas)
- Separate grids for heat map and coverage tracking
- Coverage uses grid-based marking with optional time-based fade

## Interactive Controls

| Key | Function |
|-----|----------|
| R   | Reset heat map and coverage tracking |
| L   | Toggle legend visibility |
| D   | Toggle debug mode (show buried object locations) |
| M   | Toggle heat map mode (fading vs permanent) |
| C   | Toggle metal type colors on/off |
| F   | Toggle FPS display |
| G   | Toggle grid overlay |
| V   | Toggle value display (VDI, phase, signal) |
| Space | Clear detector trail |

## Development Phases

The project follows a 4-week iterative development plan (see `4-WEEK-DEVELOPMENT-PLAN.md`):

- **Week 1 (✅ Complete)**: Core heat map + detector position
- **Week 2 (✅ Complete)**: Metal type discrimination + coverage tracking + legend
- **Week 3 (✅ Complete)**: Metrics panel + signal analysis + audio integration (Web Audio API)
- **Week 4 (✅ Complete)**: Training scenarios + scoring system + ground truth visualization + UI controls

**All features complete!** The simulator is ready for deployment and use.

## Week 4 Features (Training System)

### Scenario System
The `ScenarioManager.js` manages 5 built-in training scenarios:
- **Beginner Training**: Single silver coin, 3-minute time limit
- **Intermediate Search**: 4 targets with overlap, 5-minute limit
- **Advanced Challenge**: 7 targets including iron trash, 7-minute limit
- **Treasure Hunt**: 6 valuable targets scattered, 6-minute limit
- **Free Practice**: No time limit or scoring

Scenarios are defined in-code (no external JSON files) and include:
- Object placements with metal types
- Time limits (optional)
- Passing scores (optional)
- Difficulty ratings
- Tips for users

### Scoring System
`ScoringSystem.js` tracks comprehensive performance metrics:

**Score Components (weighted):**
- Target Score (40%): Percentage of targets found, bonus for valuable targets
- Coverage Score (20%): Percentage of area searched
- Technique Score (20%): Based on sweep speed and pattern analysis
- Efficiency Score (10%): Coverage per unit time
- Time Bonus (10%): Faster completion = higher bonus

**Final Score:** 0-100 scale with letter grades (A+ to F)

**Tracking:**
- Targets found (total, valuable, trash)
- Time elapsed/remaining
- Coverage percentage
- Technique metrics from TechniqueAnalyzer
- Signal confidence from SignalAnalyzer

### Ground Truth Visualization
`GroundTruth.js` provides toggle-able overlay showing actual object locations:
- Color-coded X markers and circles for each metal type
- Green checkmarks for found targets
- Object labels (name, metal type, strength)
- Optional detection range circles (150px radius)
- Interactive legend
- 'T' key or button to toggle visibility

### UI Control System
`UIControls.js` creates DOM elements for scenario management:

**Top Control Bar:**
- Scenario selector dropdown
- Reset button
- Ground truth toggle button
- Help button

**Bottom Status Bar:**
- Scenario name
- Targets found counter
- Current score
- Time display (elapsed or remaining)
- Finish button (for manual completion)
- Export results button

**Score Modal:**
- Displayed at scenario end
- Shows final score, grade, pass/fail status
- Detailed performance breakdown
- Retry, next scenario, or export options
- Animated transitions

## Audio Feature (Week 3)

When implementing the audio system (`AudioEngine.js`), **mimic real metal detector behavior** (Garrett AT Pro, Minelab Equinox style):

### Beeping Behavior (Primary Mode)
- **Discrete beeps**: Not continuous tones - generate individual beeps at intervals
- **Beep repetition rate**: 1-6 beeps/sec based on signal strength (weak → strong)
- **Multi-tone bins**: 3-4 discrete frequency bins mapped to VDI ranges:
  - Iron (VDI 0-30): 100-250 Hz low "grunt"
  - Aluminum (VDI 35-60): 300-500 Hz mid tone
  - Copper (VDI 60-75): 500-700 Hz higher tone
  - Silver/Coins (VDI 80-99): 700-900 Hz high clear tone
- **Volume modulation**: Scales with signal strength (0-100%)
- **Beep envelope**: Quick attack (5-10ms), brief sustain (50-150ms), quick release (20-30ms)
- **Overlap prevention**: Stop previous beep when starting new one

### Threshold Mode (Optional Advanced Feature)
- Continuous background hum (75-200 Hz) with pitch variations for subtle targets
- For experienced users who want to detect weak signals

### Technical Notes
- Use Web Audio API with oscillator + gain nodes
- Audio must be user-activated (browser autoplay policies)
- Implement mute/unmute toggle and volume controls

## Code Style Conventions

- ES6 class-based architecture for all components
- Detailed JSDoc comments for public methods
- Configuration constants in UPPERCASE (exported from `config.js`)
- P5.js functions attached to `window` object in global mode
- Grid coordinates use `[x][y]` indexing (column-major)

## Common Pitfalls

1. **Module Loading**: Always use `type="module"` in script tags when importing modules
2. **P5.js Global Mode**: The project uses global P5.js mode, so `setup()` and `draw()` are on `window`
3. **Canvas Bounds**: Clamp detector position with `constrain()` to prevent out-of-bounds access
4. **Layer Ordering**: Render order is critical (coverage → heat map → detector → legend)
5. **Grid Resolution**: Heat map uses 10-pixel cells, so position-to-grid conversion requires division by 10

## Testing Approach

- Visual testing in browser is primary method (no test framework currently)
- Use keyboard shortcuts (D, F, G, V) to verify different visualization modes
- Debug mode (D key) shows ground truth object locations for validation
- Check browser console for initialization logs and error messages

## Educational Context

This simulator is designed for **Build for Ukraine 2026** at MIT to teach:
- Metal detector physics and electromagnetic induction
- Signal processing and discrimination techniques
- Search pattern efficiency and coverage analysis
- Potential applications in humanitarian demining, archaeology, and security

When adding features, prioritize educational value and realistic behavior over gamification.
