# Metal Detector Visualization - 4-Week Development Plan

**Project:** Interactive Metal Detector Training Simulator  
**Course:** Build for Ukraine 2026  
**Timeline:** 4 weeks, iterative development  
**Tech Stack:** P5.js, HTML5, CSS3, ES6 JavaScript, Web Audio API  
**Deployment:** GitHub Pages  

---

## Priority Feature Request: Audio Simulation

**IMPORTANT:** Mimic realistic metal detector audio behavior using the Web Audio API. Real metal detectors (Garrett, Minelab, etc.) use discrete beeping patterns, not continuous tones:

### Audio Modes
- **Silent Search (Beep Mode)**: Default mode - silent until target detected, then produces repeating beeps
- **Threshold Mode**: Optional continuous background hum (75-200 Hz) with pitch variations for subtle targets

### Beep Characteristics (mimicking Garrett AT Pro, Minelab Equinox behavior)
- **Iron/Ferrous (VDI 0-30)**: Low-pitched "grunt" beeps (100-250 Hz), shorter duration
- **Aluminum/Pull tabs (VDI 35-60)**: Mid-pitched beeps (300-500 Hz), medium duration
- **Copper/Brass (VDI 60-75)**: Higher beeps (500-700 Hz), clean tone
- **Silver/Coins (VDI 80-99)**: High-pitched beeps (700-900 Hz), clear and distinct

### Realistic Audio Behavior
- **Beep repetition rate**: Increases as signal strength increases (weak: 1-2 beeps/sec, strong: 4-6 beeps/sec)
- **Volume**: Gets louder as detector approaches target center (mimics real detector behavior)
- **Beep envelope**: Quick attack (5-10ms), brief sustain (50-150ms depending on signal), quick release (20-30ms)
- **Multi-tone system**: Use 3-4 discrete tone bins (like Garrett 3-tone or Minelab 4-tone), not continuous pitch variation
- **Overlap handling**: Stop previous beep when new one starts (prevents muddy audio)

This mimics real detector audio patterns that experienced users rely on for target identification.

**Recommended Implementation Schedule:**
- Week 2-3: Basic beep generation with repetition rate tied to signal strength
- Week 3-4: Multi-tone system with VDI-based pitch selection, volume modulation
- Week 4: Optional threshold mode, mute/volume controls, audio settings panel

---

## Sensor Technology Note

**Traditional Metal Detectors vs. Advanced Sensors:**

This simulator focuses on **traditional electromagnetic induction metal detectors** which detect:
- Ferrous metals (iron, steel)
- Non-ferrous metals (aluminum, copper, silver, brass, titanium)
- Even carbon fiber/graphite (surprisingly detectable due to eddy currents in carbon graphite strands)

**Future expansion possibilities** (not in current scope):
- Ground-penetrating radar (GPR) for non-metallic objects
- Magnetometer sensors for enhanced ferromagnetic detection
- Specialized carbon/graphite detection sensors
- Multi-sensor fusion systems combining multiple technologies

For now, we're building a realistic traditional metal detector simulator that covers the vast majority of demining and treasure-hunting use cases. Advanced sensor types can be added in future iterations if needed.

---

## Overview

This plan breaks down the development of a metal detector training simulator into four weekly sprints. Each week builds upon the previous, with clear deliverables and testing criteria.

**End Goal:** A complete web-based training simulator with:
- Visual heat map showing signal strength
- Metal type discrimination with realistic audio tones
- Real-time metrics and feedback
- Multiple training scenarios
- Scoring and performance tracking
- Optional audio feedback for immersive training

---

## Week 1: Core Heat Map + Detector Position ✅ COMPLETE

### Objectives
- Working canvas with mouse-controlled detector
- Basic heat map visualization
- Signal generation based on position
- Clean architecture for future expansion

### Files Created
```
/
├── index.html                 # Main page
├── styles.css                 # Basic styling
├── sketch.js                  # P5.js main sketch
└── js/
    ├── DetectorSimulator.js   # Generates mock signals
    ├── HeatMapRenderer.js     # Renders heat map layer
    ├── DetectorRenderer.js    # Renders detector position
    └── config.js              # Constants and settings
```

### Week 1 Deliverables ✅
✅ Mouse moves detector around canvas  
✅ Heat map appears when detector passes over objects  
✅ Heat map fades over time  
✅ Can deploy to GitHub Pages and share link  
✅ Smooth mouse tracking
✅ Heat map appears within ~5 pixels of object center
✅ Colors change based on signal strength
✅ Page loads without errors in console

---

## Week 2: Metal Type Discrimination + Coverage Tracking 🎯 CURRENT

### Objectives
- Different buried objects = different metal types
- Color coding by metal type (ferrous, aluminum, copper/silver)
- Coverage layer showing where user has searched
- Legend/key for understanding colors
- **Optional: Basic audio tones (if time permits)**

### Files to Create/Modify

```
/js/
├── MetalTypes.js              # NEW: Metal type definitions
├── CoverageRenderer.js        # NEW: Track searched areas
├── Legend.js                  # NEW: UI legend component
├── AudioEngine.js             # NEW (OPTIONAL): Audio tone generation
├── DetectorSimulator.js       # MODIFY: Add metal type property
└── HeatMapRenderer.js         # MODIFY: Color by metal type
```

### Detailed Tasks

#### Task 2.1: MetalTypes.js (1 hour)
- Define metal type constants (IRON, ALUMINUM, COPPER, SILVER)
- Properties: VDI range, phase shift range, typical depth
- Color mapping for each type
- Audio frequency mapping for each type (for future audio feature)
- Helper functions for classification

**Metal type structure:**
```javascript
{
  name: 'IRON',
  vdiRange: [0, 30],
  phaseRange: [20, 40],
  audioFreqRange: [100, 300],  // Hz for audio feature
  color: [255, 100, 100],  // Reddish
  conductivity: 'LOW'
}
```

#### Task 2.2: Update DetectorSimulator.js (1.5 hours)
- Assign metal type to each buried object
- Calculate VDI (0-99) based on metal type
- Calculate phase shift (0-180°) based on metal type
- Calculate audio frequency based on metal type
- Return `{ strength, frequency, metalType, vdi, phase }`

**Enhanced signal return:**
```javascript
{
  strength: 75,
  frequency: 650,  // For future audio
  metalType: 'COPPER',
  vdi: 85,
  phase: 165,
  closestObject: {...}
}
```

#### Task 2.3: CoverageRenderer.js (2 hours)
- Separate grid tracking detector path
- Mark cells as "searched" when detector passes over
- Render with low opacity (subtle background layer)
- Optional: gradient showing time since last search

**Key methods:**
```javascript
update(x, y)              // Mark cell as searched
render()                  // Draw coverage map
getCoveragePercentage()   // Calculate % of area searched
```

#### Task 2.4: Update HeatMapRenderer.js (2 hours)
- Color coding based on metal type instead of just strength
- Blend strength + metal type for final color
- Add option for different color schemes (thermal/traffic light)
- Implement proper alpha blending for overlapping signals

**Color scheme examples:**
```javascript
IRON:      Red/Orange tones
ALUMINUM:  Gray/Silver tones
COPPER:    Orange/Yellow tones
SILVER:    White/Cyan tones
```

#### Task 2.5: Legend.js (1.5 hours)
- Create overlay panel showing color meanings
- Display metal type → color mapping
- Show signal strength scale
- Toggle visibility option
- Show VDI ranges

**Legend content:**
```
🔴 Iron (VDI 0-30) - Ferrous
⚪ Aluminum (VDI 35-55)
🟡 Copper (VDI 60-75)
🔵 Silver (VDI 80-99)
━━━ Weak ——— Strong
```

#### Task 2.6: sketch.js Integration (1 hour)
- Add coverage layer rendering (bottom layer)
- Pass metal type info to heat map renderer
- Add legend to corner of canvas
- Add keyboard shortcut to toggle legend (spacebar)

#### Task 2.7 (OPTIONAL): AudioEngine.js (2-3 hours)
If time permits in Week 2, start basic audio:
- Web Audio API setup
- Simple oscillator for tone generation
- Map signal strength to volume
- Map metal type to pitch/frequency
- Add mute toggle

### End of Week 2 Deliverables
✅ Different colors for iron vs aluminum vs copper/silver  
✅ Coverage map shows search pattern  
✅ Legend explains what colors mean  
✅ More realistic signal characteristics (VDI, phase)  
🔊 (Optional) Basic audio tones that change with metal type

### Testing Criteria
- [ ] Can distinguish 3+ metal types visually
- [ ] Coverage layer doesn't obscure heat map
- [ ] Legend is readable and accurate
- [ ] Color scheme is accessible (test with colorblind simulator)
- [ ] Buried objects with same metal type look similar
- [ ] (Optional) Audio tones are distinct for different metal types

---

## Week 3: Metrics Panel + Signal Analysis + Audio Polish

### Objectives
- Side panel showing real-time detector readings
- VDI number, phase shift, depth estimate
- Signal quality indicators
- Basic technique feedback (sweep speed)
- **Complete audio implementation with realistic characteristics**

### Files to Create/Modify

```
/js/
├── MetricsPanel.js            # NEW: UI panel for metrics
├── SignalAnalyzer.js          # NEW: Analyze signal characteristics
├── TechniqueAnalyzer.js       # NEW: Evaluate user technique
├── AudioEngine.js             # MODIFY/NEW: Complete audio system
└── sketch.js                  # MODIFY: Two-panel layout
```

### Detailed Tasks

#### Task 3.1: Layout Restructuring (1 hour)
- Modify HTML for two-column layout (or responsive)
- Canvas on left (or top on mobile)
- Metrics panel on right (or bottom on mobile)
- CSS grid or flexbox

**Layout structure:**
```
┌─────────────────┬──────────────┐
│                 │   Metrics    │
│     Canvas      │   Panel      │
│                 │              │
└─────────────────┴──────────────┘
```

#### Task 3.2: MetricsPanel.js (3 hours)
- Create DOM elements for panel
- Display sections:
  - Signal Analysis (VDI, phase, depth, confidence)
  - Metal Type Indicator
  - Detector Stats (coverage %, targets found)
  - Technique Feedback
- Update in real-time
- Clean, readable design

#### Task 3.3: SignalAnalyzer.js (2 hours)
- Analyze signal characteristics over time
- Calculate confidence levels
- Detect signal stability (repeatable from different angles)
- Identify "good" vs "junk" signals

#### Task 3.4: TechniqueAnalyzer.js (2 hours)
- Track sweep speed
- Detect if sweeps are too fast
- Monitor search pattern efficiency
- Provide real-time tips

#### Task 3.5: Complete AudioEngine.js (3-4 hours)
Implement realistic metal detector beeping behavior:
- **Beep generation system**: Discrete beeps (not continuous tones) triggered at intervals
- **Multi-tone bins**: 3-4 frequency bins mapped to VDI ranges (mimics Garrett/Minelab)
- **Dynamic beep rate**: Adjust repetition rate based on signal strength (1-6 beeps/sec)
- **Volume modulation**: Scale beep volume by signal strength
- **Beep overlap prevention**: Cancel previous beep when starting new one
- **Mute/unmute toggle** and volume slider control
- **Optional threshold mode**: Continuous low hum with pitch variations

**Beep implementation pattern:**
```javascript
// Beep tone generator (mimicking real detector behavior)
class BeepGenerator {
  generateBeep(vdi, signalStrength) {
    // Select frequency bin based on VDI (3-tone system)
    const freq = this.getFrequencyForVDI(vdi);
    // Iron: 100-250 Hz, Aluminum: 300-500 Hz, Coins: 700-900 Hz

    // Calculate beep timing
    const beepRate = 1 + (signalStrength / 20); // 1-6 beeps/sec
    const beepDuration = 50 + (signalStrength * 1); // 50-150ms

    // Beep envelope
    - Attack: 5-10ms (quick onset)
    - Sustain: beepDuration
    - Release: 20-30ms (quick cutoff)

    // Volume scaled by signal strength
    const volume = signalStrength / 100;
  }
}
```

### End of Week 3 Deliverables
✅ Metrics panel shows real-time VDI, phase, depth
✅ Signal analyzer evaluates signal quality
✅ Technique feedback helps user improve
✅ Responsive layout works on mobile
✅ **Complete audio system with realistic beeping behavior**
✅ Multi-tone beep system mimics real detectors (Garrett/Minelab style)
✅ Beep rate and volume respond correctly to signal strength and proximity

### Testing Criteria
- [ ] Metrics update smoothly without lag
- [ ] Panel is readable and well-organized
- [ ] Technique feedback is helpful not annoying
- [ ] Layout works on mobile devices
- [ ] **Audio tones are clearly distinguishable**
- [ ] **Volume responds appropriately to distance**
- [ ] **Mute/unmute works instantly**
- [ ] **No audio glitches or pops**

---

## Week 4: Scenarios + Scoring + Ground Truth + Final Polish

### Objectives
- Pre-defined training scenarios
- Scoring and performance tracking
- Ground truth visualization (see actual buried objects)
- Settings and controls
- Final UI polish and documentation
- Audio refinements

### Files to Create/Modify

```
/js/
├── ScenarioManager.js         # NEW: Handle scenarios
├── ScoringSystem.js           # NEW: Track performance
├── GroundTruth.js             # NEW: Show buried objects
├── UIControls.js              # NEW: Settings/controls
└── sketch.js                  # MODIFY: Integrate all features

/scenarios/
├── beginner.json              # Easy scenario
├── intermediate.json          # Medium scenario
└── advanced.json              # Hard scenario

/assets/
└── instructions.md            # User guide
```

### Detailed Tasks

#### Task 4.1: ScenarioManager.js (2 hours)
- Load scenarios from JSON files
- Switch between scenarios
- Reset functionality
- Track scenario completion

**Scenario format:**
```json
{
  "name": "Beginner Training",
  "description": "Single shallow target",
  "objects": [
    { "x": 400, "y": 300, "type": "COPPER", "strength": 80 }
  ],
  "timeLimit": 300,
  "passing Score": 80
}
```

#### Task 4.2: ScoringSystem.js (2.5 hours)
- Track targets found vs missed
- Calculate false alarm rate
- Measure search efficiency
- Time tracking
- Generate performance report

#### Task 4.3: GroundTruth.js (1.5 hours)
- Toggle to show actual buried objects
- Visual indicators for object locations
- Show object properties on hover
- Semi-transparent overlay

#### Task 4.4: UIControls.js (2 hours)
- Scenario selector dropdown
- Reset button
- Settings panel (audio on/off, volume, etc.)
- Show/hide ground truth toggle
- Export results button

#### Task 4.5: UI Layout & Integration (2 hours)
- Top control bar with scenario selector
- Status bar at bottom with score/stats
- Integrate all components
- Polish visual design

**Final layout:**
```
┌─────────────────────────────────┐
│ [Scenario ▼] [Reset] [Settings] │
├─────────────────────────────────┤
│         Canvas Area             │
├─────────────────────────────────┤
│ Score: 4/5  Coverage: 78%       │
│ Time: 1:35   [🔊 Audio On/Off]  │
│ [Show Objects] [Export Results] │
└─────────────────────────────────┘
```

#### Task 4.6: Polish & Documentation (2 hours)
- Add instructions/tutorial overlay
- Keyboard shortcuts reference
- README with usage instructions
- Mobile-friendly controls
- Loading states
- Error handling
- Audio troubleshooting guide

#### Task 4.7: Audio Final Polish (1 hour)
- Fine-tune frequency ranges
- Test audio on different browsers
- Add audio initialization on user interaction (required by browsers)
- Polish volume ramping
- Add option for headphone-optimized mode

### End of Week 4 Deliverables
✅ Complete training simulator  
✅ 5+ pre-defined scenarios  
✅ Ground truth visualization  
✅ Scoring and feedback system  
✅ Polished UI with controls  
✅ Full audio integration with toggle
✅ Shareable demo link  
✅ Documentation for users  

### Testing Criteria
- [ ] Can complete scenario without errors
- [ ] Scoring accurately reflects performance
- [ ] Ground truth toggle works smoothly
- [ ] All scenarios load correctly
- [ ] Export functionality works
- [ ] Instructions are clear to new users
- [ ] Performance is smooth even on older devices
- [ ] **Audio works in all major browsers**
- [ ] **Audio can be toggled on/off easily**

---

## File Architecture Summary

### Final Structure
```
metal-detector-viz/
├── index.html
├── styles.css
├── README.md
├── 4-WEEK-DEVELOPMENT-PLAN.md
├── sketch.js                    # Main P5.js sketch
├── js/
│   ├── config.js                # Settings and constants
│   ├── DetectorSimulator.js     # Signal generation
│   ├── HeatMapRenderer.js       # Heat map visualization
│   ├── DetectorRenderer.js      # Detector position
│   ├── CoverageRenderer.js      # Coverage tracking
│   ├── MetalTypes.js            # Metal definitions
│   ├── Legend.js                # Color legend UI
│   ├── MetricsPanel.js          # Metrics display
│   ├── SignalAnalyzer.js        # Signal processing
│   ├── TechniqueAnalyzer.js     # Technique evaluation
│   ├── AudioEngine.js           # Audio tone generation
│   ├── GroundTruth.js           # Ground truth overlay
│   ├── ScenarioManager.js       # Scenario handling
│   ├── ScoringSystem.js         # Performance tracking
│   └── UIControls.js            # User interface
├── scenarios/
│   ├── beginner.json
│   ├── intermediate.json
│   └── advanced.json
└── assets/
    └── instructions.md          # User guide
```

---

## Audio Implementation Details

### Web Audio API Setup (Realistic Beeping Behavior)
```javascript
// AudioEngine.js architecture - mimics real metal detectors
class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.enabled = false;
    this.mode = 'beep'; // 'beep' or 'threshold'
    this.beepTimer = null;
    this.currentBeep = null;
    this.lastSignalStrength = 0;
  }

  init() {
    // Initialize audio context (must be triggered by user action)
    this.audioContext = new AudioContext();
  }

  update(vdi, signalStrength) {
    if (signalStrength > 5) {
      // Calculate beep rate based on signal strength
      const beepInterval = 1000 / (1 + signalStrength / 20); // 1-6 beeps/sec

      if (this.mode === 'beep') {
        this.scheduleBeep(vdi, signalStrength, beepInterval);
      } else {
        this.updateThresholdTone(signalStrength);
      }
    } else {
      this.stopBeeping();
    }
  }

  scheduleBeep(vdi, strength, interval) {
    // Stop previous beep if still playing
    if (this.currentBeep) this.currentBeep.stop();

    // Generate single beep
    const freq = this.getFrequencyBin(vdi); // 3-tone system
    const duration = 50 + strength; // 50-150ms
    const volume = strength / 100;

    this.playBeep(freq, duration, volume);
  }

  getFrequencyBin(vdi) {
    // 3-tone system mimicking Garrett AT Pro
    if (vdi < 30) return 150;  // Iron: low grunt
    if (vdi < 60) return 400;  // Aluminum: mid tone
    return 800;                 // Coins/silver: high tone
  }
}
```

### Beep Specifications (Multi-Tone System)
Mimics Garrett AT Pro 3-tone and Minelab Equinox 4-tone systems:
- **Iron/Ferrous (VDI 0-30)**: 100-250 Hz low grunt, 50-80ms duration
- **Aluminum/Pull tabs (VDI 35-60)**: 300-500 Hz mid tone, 80-120ms duration
- **Copper/Brass (VDI 60-75)**: 500-700 Hz higher tone, 100-130ms duration
- **Silver/Coins (VDI 80-99)**: 700-900 Hz high clear tone, 120-150ms duration

### Beep Timing and Volume
- **Beep rate**: 1 beep/sec (weak signal) → 6 beeps/sec (strong signal)
- **Volume**: Scales linearly with signal strength (0-100%)
- **Envelope**: Attack 5-10ms, Sustain varies by strength, Release 20-30ms

---

## Success Metrics

### Week 1 ✅
- Mouse tracking works smoothly
- Heat map visualizes signal strength
- Can detect all buried objects
- Deployable to GitHub Pages

### Week 2 (Current)
- Metal types are visually distinguishable
- Coverage tracking shows search pattern
- Legend is clear and helpful
- VDI/phase calculations are realistic
- (Optional) Basic audio tones work

### Week 3
- Metrics panel provides useful feedback
- Signal analysis helps user improve
- Technique warnings are accurate
- Responsive design works well
- **Complete audio system is immersive**
- **Audio characteristics match real metal detectors**

### Week 4
- Scenarios are engaging and educational
- Scoring system is fair and motivating
- Ground truth helps learning
- Users can track progress over time
- **Audio enhances training experience**
- **All features work together seamlessly**

---

## Resources & References

### Technical Documentation
- P5.js Reference: https://p5js.org/reference/
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Metal Detector Physics: Signal processing, electromagnetic induction
- Color Theory: Thermal gradients, accessibility

### Audio Research
Based on real metal detector behavior (Garrett AT Pro, Minelab Equinox, etc.):
- **Beep mode**: Discrete repeating beeps (1-6 beeps/sec based on signal strength)
- **Tone bins**: 3-4 discrete frequencies mapped to VDI ranges (not continuous pitch)
  - Iron: 100-250 Hz low grunt
  - Aluminum: 300-500 Hz mid tone
  - Copper: 500-700 Hz higher tone
  - Silver/Coins: 700-900 Hz high clear tone
- **Threshold mode**: Optional continuous background hum (75-200 Hz) with pitch variations
- **Volume behavior**: Increases as detector approaches target center
- **Beep timing**: Quick attack (5-10ms), brief sustain (50-150ms), quick release (20-30ms)

### Example Scenarios
- **Beginner:** Single shallow target, no clutter
- **Intermediate:** Multiple targets, some overlap, light clutter
- **Advanced:** Mineralized soil simulation, deep targets, heavy clutter

### Testing Tools
- Chrome DevTools (mobile emulation)
- Lighthouse (performance audit)
- Color Oracle (colorblind simulator)
- BrowserStack (cross-browser testing)

---

## Stakeholder Communication

### Weekly Updates Should Include:
1. **What's working:** Demo link + screenshots + audio demo
2. **What's next:** Goals for upcoming week
3. **Feedback needed:** Specific questions or concerns
4. **Blockers:** Any issues that need input

### Feedback Collection:
- Quick surveys after each week
- Screen recordings of user sessions
- Audio testing with headphones
- Bug reports and feature requests
- Accessibility testing with diverse users

---

## Risk Mitigation

### Potential Risks:

**Week 2:** Metal type colors not accessible
- Mitigation: Pattern overlays, colorblind-friendly palettes

**Week 3:** Audio doesn't work on some browsers
- Mitigation: Feature detection, fallback to visual-only mode, clear instructions

**Week 3:** Audio initialization blocked by browser autoplay policies
- Mitigation: Require user click to enable audio, clear UI indicator

**Week 4:** Scenarios too easy or too hard
- Mitigation: User testing, adjustable difficulty, hints system

---

## Conclusion

This 4-week plan provides a structured approach to building a complete metal detector training simulator with realistic visual AND audio feedback.

**Key Success Factors:**
- ✅ Iterative development with weekly demos
- ✅ Clean architecture enables easy extension
- ✅ Regular testing and feedback
- ✅ Focus on educational value
- ✅ Audio enhances immersion and realism
- ✅ Professional, deployable result

By following this plan, you'll create a valuable training tool for the Build for Ukraine course that can help students understand metal detector operation through both visual and audio feedback, developing practical skills for humanitarian demining applications.

**Good luck building!** 🚀

---

**Last Updated:** Week 1 Complete, Week 2 Updated with Audio Feature  
**Status:** Week 2 Ready to Begin  
**Next Milestone:** Metal type discrimination + coverage tracking + (optional) basic audio
