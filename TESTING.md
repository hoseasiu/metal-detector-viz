# Testing Checklist - Metal Detector Visualization

## ✅ Pre-Deployment Tests

Run these tests before deploying to GitHub Pages or sharing with stakeholders.

### Test 1: Local Server Setup
- [ ] Navigate to project directory
- [ ] Start local server: `python3 -m http.server 8000`
- [ ] Server starts without errors
- [ ] Can access http://localhost:8000

### Test 2: Automated Tests
- [ ] Open http://localhost:8000/test.html
- [ ] All tests show green (success)
- [ ] No red errors in test output
- [ ] Console shows no JavaScript errors (F12)

### Test 3: Main Application Loading
- [ ] Open http://localhost:8000/index.html
- [ ] Page loads completely
- [ ] Canvas appears (800x600)
- [ ] No console errors (press F12)
- [ ] Instructions panel visible on right

### Test 4: Basic Interaction
- [ ] Move mouse over canvas
- [ ] Detector position (blue circle) follows mouse smoothly
- [ ] Heat map colors appear when over objects
- [ ] Colors are visible (blue, cyan, yellow, red gradient)
- [ ] Heat map fades gradually over time

### Test 5: Keyboard Controls
- [ ] Press 'R' - heat map clears completely
- [ ] Press 'D' - red markers show buried objects
- [ ] Press 'D' again - red markers disappear
- [ ] Press 'F' - FPS counter appears/disappears
- [ ] Press Space - detector trail clears

### Test 6: Finding Objects
- [ ] Can find object at (200, 150) - should be bright
- [ ] Can find object at (450, 300)
- [ ] Can find object at (600, 180)
- [ ] Can find object at (250, 450)
- [ ] Can find object at (650, 450)
- [ ] All 5 objects produce visible heat map signals

### Test 7: Visual Feedback
- [ ] Detector pulses when over strong signal
- [ ] Trail appears behind detector movement
- [ ] Signal cone (semi-transparent circle) visible around detector
- [ ] Crosshairs visible at detector center

### Test 8: Mobile/Touch
- [ ] Open on mobile device or use browser dev tools mobile view
- [ ] Page layout adapts (instructions below canvas)
- [ ] Touch dragging works
- [ ] Heat map appears on touch movement
- [ ] No horizontal scrolling

### Test 9: Performance
- [ ] Animation runs smoothly (60 FPS on desktop)
- [ ] No lag when moving mouse quickly
- [ ] Heat map updates in real-time
- [ ] No memory leaks (check with long usage)

### Test 10: Browser Compatibility
Test in multiple browsers:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (if available)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## 🐛 Common Issues & Solutions

### Issue: Canvas is blank
**Solution:**
- Check browser console (F12) for errors
- Ensure running from web server (not file://)
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### Issue: "Failed to load module script"
**Solution:**
- Must use HTTP server (Python, Node, etc.)
- Cannot open index.html directly (file:// protocol)
- Check that sketch.js is loading as type="module"

### Issue: Heat map doesn't appear
**Solution:**
- Move mouse slowly over canvas
- Check if detector position is updating
- Press 'D' to see if objects are in expected locations
- Try pressing 'R' to reset

### Issue: Colors look wrong
**Solution:**
- Check ACTIVE_COLOR_SCHEME in js/config.js
- Ensure browser supports CSS gradients
- Try different browser

### Issue: Poor performance
**Solution:**
- Reduce PERFORMANCE.FRAME_RATE in config.js
- Increase GRID.RESOLUTION (fewer grid cells)
- Close other browser tabs
- Try on more powerful device

## 📊 Module Loading Test Results

Run: `node test-modules.js`

Expected output:
```
✓ Testing config.js...
  - CANVAS: 800x600
  - Buried objects: 5

✓ Testing DetectorSimulator.js...
  - Signal strength at (200, 150): 90.00
  - Frequency: 820.00 Hz

✅ All module imports successful!
```

## 🧪 Detailed Functional Tests

### Signal Strength Test
1. Press 'D' to show object locations
2. Move detector directly over red marker at (200, 150)
3. Expected: Bright red/yellow colors, strong pulsing
4. Move away slowly
5. Expected: Colors fade from red → yellow → cyan → blue

### Decay Test
1. Move detector over an object
2. Leave mouse stationary for 5 seconds
3. Expected: Heat map gradually fades
4. Move again
5. Expected: New signals appear immediately

### Coverage Test
1. Sweep detector in systematic grid pattern
2. Expected: Can build up heat map showing searched areas
3. Press 'R' to reset
4. Expected: Entire heat map clears instantly

### Multi-Object Test
1. Move detector between (200, 150) and (450, 300)
2. Expected: Two separate heat map "hotspots"
3. Should be able to distinguish separate objects
4. Each has own color intensity based on distance

## 🚀 Pre-Deployment Checklist

Before deploying to GitHub Pages:

- [ ] All tests above pass
- [ ] No console errors in any browser
- [ ] Tested on at least 2 browsers
- [ ] Tested on mobile device
- [ ] README.md is up to date
- [ ] Comments in code are clear
- [ ] No debug code left in production
- [ ] SHOW_OBJECT_LOCATIONS set to false in config.js
- [ ] Git repository is clean
- [ ] All files committed to git

## 📝 User Acceptance Testing

Have someone unfamiliar with the project try:

1. [ ] Can they understand what to do from instructions?
2. [ ] Can they find all 5 objects without help?
3. [ ] Do they understand the color scheme?
4. [ ] Do they find the controls intuitive?
5. [ ] Any confusion points to address in Week 2?

## 🎯 Success Criteria

Minimum requirements for Week 1 completion:

✅ Page loads without errors  
✅ Mouse/touch controls work  
✅ Heat map appears and fades  
✅ All 5 objects detectable  
✅ Visual feedback is clear  
✅ Works on mobile  
✅ Deployable to GitHub Pages  
✅ No console errors  
✅ Smooth performance (>30 FPS)  
✅ Cross-browser compatible  

## 📞 Reporting Issues

If you find bugs during testing:

1. Note the browser and OS
2. Describe exact steps to reproduce
3. Check browser console for errors
4. Take screenshot if helpful
5. Note any error messages

## ✨ Optional Enhancements Found

Things that work better than expected:
- [ ] Note any particularly good features
- [ ] Suggestions for Week 2
- [ ] User feedback to incorporate

---

Last updated: Week 1 testing
