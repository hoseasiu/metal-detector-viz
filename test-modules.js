// Simple test to check if modules load without errors
// This won't test P5.js functionality but will catch import errors

console.log('Testing module imports...\n');

async function testImports() {
    try {
        // Test config
        console.log('✓ Testing config.js...');
        const config = await import('./js/config.js');
        console.log(`  - CANVAS: ${config.CANVAS.WIDTH}x${config.CANVAS.HEIGHT}`);
        console.log(`  - Buried objects: ${config.BURIED_OBJECTS.length}`);
        
        // Test DetectorSimulator
        console.log('\n✓ Testing DetectorSimulator.js...');
        const { DetectorSimulator } = await import('./js/DetectorSimulator.js');
        const sim = new DetectorSimulator();
        const signal = sim.getSignal(200, 150);
        console.log(`  - Signal strength at (200, 150): ${signal.strength.toFixed(2)}`);
        console.log(`  - Frequency: ${signal.frequency.toFixed(2)} Hz`);
        
        console.log('\n✅ All module imports successful!');
        console.log('\nNote: HeatMapRenderer and DetectorRenderer require P5.js');
        console.log('and will be tested in the browser.');
        
    } catch (error) {
        console.error('\n❌ Error loading modules:');
        console.error(error);
        process.exit(1);
    }
}

testImports();
