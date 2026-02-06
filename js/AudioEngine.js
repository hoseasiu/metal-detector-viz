/**
 * AudioEngine
 * Mimics realistic metal detector audio behavior (Garrett AT Pro, Minelab Equinox style)
 * Uses discrete beeping patterns with multi-tone discrimination
 */

export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.enabled = false;
        this.mode = 'beep'; // 'beep' or 'threshold'

        // Beep state management
        this.lastBeepTime = 0;
        this.currentOscillator = null;
        this.currentGain = null;
        this.beepInProgress = false;

        // Threshold mode (continuous tone)
        this.thresholdOscillator = null;
        this.thresholdGain = null;

        // Settings
        this.volume = 0.3; // Master volume (0-1)
        this.toneSystem = 3; // 3-tone or 4-tone system
    }

    /**
     * Initialize audio context (must be called after user interaction)
     * @returns {boolean} Success status
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('AudioEngine initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
            return false;
        }
    }

    /**
     * Enable audio output
     */
    enable() {
        if (!this.audioContext) {
            this.init();
        }

        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.enabled = true;

        // Start threshold mode if active
        if (this.mode === 'threshold') {
            this.startThreshold();
        }

        console.log('Audio enabled');
    }

    /**
     * Disable audio output
     */
    disable() {
        this.enabled = false;
        this.stopCurrentBeep();
        this.stopThreshold();
        console.log('Audio disabled');
    }

    /**
     * Toggle audio on/off
     * @returns {boolean} New enabled state
     */
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }

    /**
     * Update audio based on current signal
     * Should be called every frame from draw loop
     * @param {number} vdi - VDI value (0-99)
     * @param {number} signalStrength - Signal strength (0-100)
     */
    update(vdi, signalStrength) {
        if (!this.enabled || !this.audioContext) return;

        const currentTime = this.audioContext.currentTime;

        if (signalStrength > 5) {
            // Calculate beep rate based on signal strength
            // Weak signal: 1 beep/sec (1000ms interval)
            // Strong signal: 6 beeps/sec (167ms interval)
            const beepRate = 1 + (signalStrength / 20); // 1-6 beeps/sec
            const beepInterval = 1 / beepRate; // Convert to seconds

            // Check if enough time has passed for next beep
            if (currentTime - this.lastBeepTime >= beepInterval) {
                if (this.mode === 'beep') {
                    this.triggerBeep(vdi, signalStrength);
                } else if (this.mode === 'threshold') {
                    this.updateThresholdPitch(signalStrength);
                }
            }
        } else {
            // No signal - stop beeping
            if (this.mode === 'threshold') {
                this.resetThresholdPitch();
            }
        }
    }

    /**
     * Trigger a single beep
     * @param {number} vdi - VDI value (0-99)
     * @param {number} signalStrength - Signal strength (0-100)
     */
    triggerBeep(vdi, signalStrength) {
        // Stop any currently playing beep (overlap prevention)
        this.stopCurrentBeep();

        const freq = this.getFrequencyForVDI(vdi);
        const duration = this.getBeepDuration(signalStrength); // 50-150ms
        const volume = this.getVolumeForSignal(signalStrength);

        this.playBeep(freq, duration, volume);
        this.lastBeepTime = this.audioContext.currentTime;
    }

    /**
     * Play a single beep with ADSR envelope
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in ms
     * @param {number} volume - Volume (0-1)
     */
    playBeep(frequency, duration, volume) {
        const currentTime = this.audioContext.currentTime;

        // Create oscillator
        this.currentOscillator = this.audioContext.createOscillator();
        this.currentOscillator.type = 'sine';
        this.currentOscillator.frequency.value = frequency;

        // Create gain node for envelope
        this.currentGain = this.audioContext.createGain();
        this.currentGain.gain.value = 0;

        // Connect nodes
        this.currentOscillator.connect(this.currentGain);
        this.currentGain.connect(this.audioContext.destination);

        // ADSR Envelope
        const attackTime = 0.005; // 5ms
        const releaseTime = 0.025; // 25ms
        const sustainTime = duration / 1000; // Convert ms to seconds
        const peakVolume = volume * this.volume;

        // Attack
        this.currentGain.gain.setValueAtTime(0, currentTime);
        this.currentGain.gain.linearRampToValueAtTime(peakVolume, currentTime + attackTime);

        // Sustain
        this.currentGain.gain.setValueAtTime(peakVolume, currentTime + attackTime);

        // Release
        this.currentGain.gain.setValueAtTime(peakVolume, currentTime + attackTime + sustainTime);
        this.currentGain.gain.linearRampToValueAtTime(0, currentTime + attackTime + sustainTime + releaseTime);

        // Start and schedule stop
        this.currentOscillator.start(currentTime);
        this.currentOscillator.stop(currentTime + attackTime + sustainTime + releaseTime);

        this.beepInProgress = true;

        // Clean up when done
        this.currentOscillator.onended = () => {
            this.beepInProgress = false;
            if (this.currentOscillator) {
                this.currentOscillator.disconnect();
                this.currentOscillator = null;
            }
            if (this.currentGain) {
                this.currentGain.disconnect();
                this.currentGain = null;
            }
        };
    }

    /**
     * Stop currently playing beep
     */
    stopCurrentBeep() {
        if (this.currentOscillator && this.beepInProgress) {
            try {
                this.currentOscillator.stop();
                this.currentOscillator.disconnect();
                this.currentGain.disconnect();
            } catch (e) {
                // Already stopped
            }
            this.currentOscillator = null;
            this.currentGain = null;
            this.beepInProgress = false;
        }
    }

    /**
     * Get frequency for VDI using multi-tone bin system
     * Mimics Garrett AT Pro 3-tone or Minelab 4-tone
     * @param {number} vdi - VDI value (0-99)
     * @returns {number} Frequency in Hz
     */
    getFrequencyForVDI(vdi) {
        if (this.toneSystem === 3) {
            // 3-tone system (Garrett AT Pro style)
            if (vdi < 30) return 175;  // Iron: low grunt
            if (vdi < 60) return 450;  // Aluminum: mid tone
            return 800;                 // Coins/silver: high tone
        } else {
            // 4-tone system (Minelab style)
            if (vdi < 30) return 175;   // Iron: low grunt
            if (vdi < 50) return 400;   // Aluminum/nickel: low-mid
            if (vdi < 70) return 600;   // Copper/brass: mid-high
            return 850;                  // Silver/coins: high tone
        }
    }

    /**
     * Calculate beep duration based on signal strength
     * @param {number} signalStrength - Signal strength (0-100)
     * @returns {number} Duration in milliseconds
     */
    getBeepDuration(signalStrength) {
        // Stronger signals = longer beeps (50-150ms)
        return 50 + signalStrength;
    }

    /**
     * Calculate volume based on signal strength
     * @param {number} signalStrength - Signal strength (0-100)
     * @returns {number} Volume (0-1)
     */
    getVolumeForSignal(signalStrength) {
        // Linear scaling: 0.2 to 1.0
        return 0.2 + (signalStrength / 100) * 0.8;
    }

    /**
     * Set master volume
     * @param {number} vol - Volume (0-1)
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));

        // Update threshold volume if active
        if (this.thresholdGain) {
            this.thresholdGain.gain.value = this.volume * 0.15;
        }
    }

    /**
     * Set tone system (3-tone or 4-tone)
     * @param {number} tones - 3 or 4
     */
    setToneSystem(tones) {
        if (tones === 3 || tones === 4) {
            this.toneSystem = tones;
            console.log(`Tone system set to ${tones}-tone`);
        }
    }

    /**
     * Switch audio mode
     * @param {string} mode - 'beep' or 'threshold'
     */
    setMode(mode) {
        if (mode === this.mode) return;

        this.stopCurrentBeep();
        this.stopThreshold();

        this.mode = mode;

        if (this.enabled && mode === 'threshold') {
            this.startThreshold();
        }

        console.log(`Audio mode set to: ${mode}`);
    }

    /**
     * Start threshold mode (continuous background tone)
     */
    startThreshold() {
        if (!this.audioContext || this.thresholdOscillator) return;

        // Create continuous low-frequency oscillator
        this.thresholdOscillator = this.audioContext.createOscillator();
        this.thresholdOscillator.type = 'sine';
        this.thresholdOscillator.frequency.value = 150; // Base threshold frequency

        // Create gain for threshold
        this.thresholdGain = this.audioContext.createGain();
        this.thresholdGain.gain.value = this.volume * 0.15; // Very quiet background hum

        // Connect
        this.thresholdOscillator.connect(this.thresholdGain);
        this.thresholdGain.connect(this.audioContext.destination);

        // Start
        this.thresholdOscillator.start();

        console.log('Threshold mode started');
    }

    /**
     * Stop threshold mode
     */
    stopThreshold() {
        if (this.thresholdOscillator) {
            try {
                this.thresholdOscillator.stop();
                this.thresholdOscillator.disconnect();
                this.thresholdGain.disconnect();
            } catch (e) {
                // Already stopped
            }
            this.thresholdOscillator = null;
            this.thresholdGain = null;
        }
    }

    /**
     * Update threshold pitch based on signal strength
     * @param {number} signalStrength - Signal strength (0-100)
     */
    updateThresholdPitch(signalStrength) {
        if (this.thresholdOscillator) {
            // Vary pitch: 150 Hz (no signal) to 300 Hz (strong signal)
            const targetFreq = 150 + (signalStrength * 1.5);
            this.thresholdOscillator.frequency.setTargetAtTime(
                targetFreq,
                this.audioContext.currentTime,
                0.1
            );
        }
    }

    /**
     * Reset threshold pitch to baseline
     */
    resetThresholdPitch() {
        if (this.thresholdOscillator) {
            this.thresholdOscillator.frequency.setTargetAtTime(
                150,
                this.audioContext.currentTime,
                0.1
            );
        }
    }

    /**
     * Get current audio state
     * @returns {Object} State object
     */
    getState() {
        return {
            enabled: this.enabled,
            mode: this.mode,
            volume: this.volume,
            toneSystem: this.toneSystem,
            initialized: this.audioContext !== null
        };
    }
}
