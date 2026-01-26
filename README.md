# Metal Detector Visualization Demo - Week 1

A web-based training simulator for metal detector operation, designed for the Build for Ukraine Spring 2025 course at MIT.

## Overview

This interactive visualization helps users understand how metal detectors work by providing real-time visual feedback as they "sweep" a virtual detector over buried objects.

## Features (Week 1)

✅ **Mouse-Controlled Detector** - Move your mouse to simulate detector movement  
✅ **Heat Map Visualization** - See signal intensity as colored areas  
✅ **Multiple Buried Objects** - 5 pre-placed objects with varying signal strengths  
✅ **Realistic Signal Decay** - Heat map fades over time, encouraging methodical searching  
✅ **Visual Feedback** - Detector position indicator changes size based on signal strength  
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices  

## How to Use

### Basic Operation

1. **Move your mouse** over the canvas to simulate moving a metal detector
2. **Watch for colored areas** - these indicate detected metal objects
3. **Brighter/warmer colors** = stronger signals (closer to object)
4. **Sweep slowly and methodically** - the heat map fades over time

### Keyboard Shortcuts

- `R` - Reset/clear the heat map
- `D` - Toggle debug mode (shows actual buried object locations)
- `F` - Toggle FPS display
- `Space` - Clear detector trail

### Color Guide

The heat map uses a thermal color scheme:
- **Blue** - Weak signal (far from objects)
- **Cyan** - Low signal
- **Yellow** - Medium signal (getting closer)
- **Red** - Strong signal (very close to object)

## Running Locally

### Option 1: Python Simple Server
```bash
python -m http.server 8000
```
Then open http://localhost:8000

### Option 2: Node.js http-server
```bash
npx http-server -p 8000
```
Then open http://localhost:8000

### Option 3: VS Code Live Server
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## Deploying to GitHub Pages

1. Push this code to a GitHub repository
2. Go to Settings → Pages
3. Source: Deploy from branch `main`
4. Your site will be live at `https://[username].github.io/[repo-name]`

## Project Structure

```
metal-detector-viz/
├── index.html              # Main HTML page
├── styles.css              # Styling
├── sketch.js               # Main P5.js sketch
├── js/
│   ├── config.js           # Configuration and constants
│   ├── DetectorSimulator.js # Signal generation logic
│   ├── HeatMapRenderer.js  # Heat map visualization
│   └── DetectorRenderer.js # Detector position rendering
└── README.md               # This file
```

## Technical Details

### Technologies
- **P5.js** - Creative coding library for visualization
- **Vanilla JavaScript** - ES6 modules for clean architecture
- **HTML5 Canvas** - High-performance rendering

### Configuration

Edit `js/config.js` to customize:
- Canvas size
- Number and location of buried objects
- Color schemes
- Signal parameters
- Decay rate

### Buried Objects

The demo includes 5 pre-placed objects:
1. Large Metal Object (200, 150) - Strength 90
2. Medium Metal Object (450, 300) - Strength 70
3. Small Metal Object (600, 180) - Strength 50
4. Large Shallow Object (250, 450) - Strength 85
5. Deep Small Object (650, 450) - Strength 40

## Architecture

The code follows a modular architecture with clear separation of concerns:

```
User Input (Mouse)
    ↓
DetectorSimulator.getSignal(x, y)
    ↓
{ strength, frequency, closestObject }
    ↓
┌→ HeatMapRenderer.update()
└→ DetectorRenderer.updatePosition()
    ↓
Render to Canvas
```

## Next Steps (Weeks 2-4)

- **Week 2**: Metal type discrimination, coverage tracking, legend
- **Week 3**: Metrics panel, signal analysis, technique feedback
- **Week 4**: Training scenarios, ground truth toggle, scoring system

## Troubleshooting

### Canvas is blank
- Check browser console for errors
- Ensure you're running from a web server (not file://)
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Performance issues
- Reduce `PERFORMANCE.FRAME_RATE` in config.js
- Increase `GRID.RESOLUTION` for fewer cells
- Disable `DEBUG.SHOW_FPS` if enabled

### Touch not working on mobile
- Make sure you're touching within the canvas area
- Try refreshing the page
- Check that JavaScript is enabled

## Credits

Built for **Build for Ukraine Spring 2025**  
MIT - Massachusetts Institute of Technology  

## License

MIT License - feel free to use and modify for educational purposes.

## Contact

For questions or feedback about this course project, please reach out through the course channels.
