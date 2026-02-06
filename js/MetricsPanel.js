/**
 * MetricsPanel
 * Displays real-time metal detector readings and statistics
 * Creates a DOM-based side panel with signal analysis and detector stats
 */

export class MetricsPanel {
    constructor() {
        this.panel = null;
        this.visible = true;
        this.targetsFound = new Set(); // Track unique targets found

        this.createPanel();
    }

    /**
     * Create the metrics panel DOM structure
     */
    createPanel() {
        // Create main panel container
        this.panel = document.createElement('div');
        this.panel.id = 'metrics-panel';
        this.panel.className = 'metrics-panel';

        // Panel HTML structure
        this.panel.innerHTML = `
            <div class="metrics-header">
                <h3>Detector Readings</h3>
                <button id="metrics-toggle" class="metrics-toggle-btn" title="Minimize panel">−</button>
            </div>

            <div class="metrics-content">
                <!-- Signal Analysis Section -->
                <div class="metrics-section">
                    <h4>Signal Analysis</h4>
                    <div class="metric-row">
                        <span class="metric-label">Signal Strength:</span>
                        <span id="metric-strength" class="metric-value">0</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">VDI:</span>
                        <span id="metric-vdi" class="metric-value">--</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Phase Shift:</span>
                        <span id="metric-phase" class="metric-value">--°</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Frequency:</span>
                        <span id="metric-frequency" class="metric-value">-- Hz</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Distance:</span>
                        <span id="metric-distance" class="metric-value">-- px</span>
                    </div>
                </div>

                <!-- Metal Type Section -->
                <div class="metrics-section">
                    <h4>Target Identification</h4>
                    <div class="metal-type-indicator">
                        <div id="metal-type-display" class="metal-type-display">
                            <span id="metal-type-name">No Target</span>
                            <div id="metal-type-color" class="metal-type-color"></div>
                        </div>
                        <div id="metal-conductivity" class="conductivity-label">--</div>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Confidence:</span>
                        <span id="metric-confidence" class="metric-value">--</span>
                    </div>
                </div>

                <!-- Detector Statistics Section -->
                <div class="metrics-section">
                    <h4>Search Statistics</h4>
                    <div class="metric-row">
                        <span class="metric-label">Coverage:</span>
                        <span id="metric-coverage" class="metric-value">0%</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Targets Found:</span>
                        <span id="metric-targets" class="metric-value">0</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Search Time:</span>
                        <span id="metric-time" class="metric-value">0:00</span>
                    </div>
                </div>

                <!-- Audio Controls Section -->
                <div class="metrics-section">
                    <h4>Audio Settings</h4>
                    <div class="audio-controls">
                        <button id="audio-toggle-btn" class="audio-btn">
                            <span id="audio-icon">🔇</span>
                            <span id="audio-status">Enable Audio</span>
                        </button>
                        <div class="volume-control">
                            <label for="volume-slider">Volume:</label>
                            <input type="range" id="volume-slider" min="0" max="100" value="30" />
                            <span id="volume-value">30%</span>
                        </div>
                        <div class="tone-control">
                            <label for="tone-system">Tone System:</label>
                            <select id="tone-system">
                                <option value="3" selected>3-Tone (Garrett)</option>
                                <option value="4">4-Tone (Minelab)</option>
                            </select>
                        </div>
                        <div class="mode-control">
                            <label for="audio-mode">Mode:</label>
                            <select id="audio-mode">
                                <option value="beep" selected>Beep Mode</option>
                                <option value="threshold">Threshold Mode</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Technique Feedback Section -->
                <div class="metrics-section">
                    <h4>Technique Feedback</h4>
                    <div id="technique-feedback" class="technique-feedback">
                        <p class="feedback-message">Move detector over canvas to begin searching...</p>
                    </div>
                </div>
            </div>
        `;

        // Add to document body
        document.body.appendChild(this.panel);

        // Set up toggle button
        const toggleBtn = document.getElementById('metrics-toggle');
        toggleBtn.addEventListener('click', () => this.toggleMinimize());

        // Initialize search time
        this.searchStartTime = Date.now();
        this.searchTimeInterval = setInterval(() => this.updateSearchTime(), 1000);
    }

    /**
     * Update all metrics with current detector data
     * @param {Object} data - Detector data object
     */
    update(data) {
        if (!this.visible) return;

        // Signal Analysis
        this.updateElement('metric-strength', Math.floor(data.strength || 0));
        this.updateElement('metric-vdi', data.vdi !== undefined ? data.vdi : '--');
        this.updateElement('metric-phase', data.phase !== undefined ? `${data.phase}°` : '--°');
        this.updateElement('metric-frequency', data.frequency ? `${Math.floor(data.frequency)} Hz` : '-- Hz');
        this.updateElement('metric-distance', data.distance !== undefined ? `${Math.floor(data.distance)} px` : '-- px');

        // Metal Type
        if (data.metalType && data.strength > 10) {
            this.updateMetalType(data.metalType, data.strength);
        } else {
            this.clearMetalType();
        }

        // Coverage
        if (data.coverage !== undefined) {
            this.updateElement('metric-coverage', `${data.coverage}%`);
        }

        // Track targets found
        if (data.closestObject && data.strength > 50) {
            this.targetsFound.add(data.closestObject.name);
            this.updateElement('metric-targets', this.targetsFound.size);
        }

        // Signal confidence (based on strength and stability)
        if (data.strength > 20) {
            const confidence = this.calculateConfidence(data.strength);
            this.updateElement('metric-confidence', confidence);
        } else {
            this.updateElement('metric-confidence', '--');
        }
    }

    /**
     * Update metal type display
     * @param {Object} metalType - Metal type object
     * @param {number} strength - Signal strength
     */
    updateMetalType(metalType, strength) {
        const nameEl = document.getElementById('metal-type-name');
        const colorEl = document.getElementById('metal-type-color');
        const conductivityEl = document.getElementById('metal-conductivity');

        if (nameEl && colorEl && conductivityEl) {
            nameEl.textContent = metalType.name;
            nameEl.style.fontWeight = 'bold';

            // Set color indicator
            const [r, g, b] = metalType.color;
            colorEl.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            colorEl.style.display = 'block';

            // Set conductivity
            conductivityEl.textContent = `Conductivity: ${metalType.conductivity}`;
            conductivityEl.style.display = 'block';
        }
    }

    /**
     * Clear metal type display
     */
    clearMetalType() {
        const nameEl = document.getElementById('metal-type-name');
        const colorEl = document.getElementById('metal-type-color');
        const conductivityEl = document.getElementById('metal-conductivity');

        if (nameEl && colorEl && conductivityEl) {
            nameEl.textContent = 'No Target';
            nameEl.style.fontWeight = 'normal';
            colorEl.style.display = 'none';
            conductivityEl.style.display = 'none';
        }
    }

    /**
     * Calculate signal confidence based on strength
     * @param {number} strength - Signal strength (0-100)
     * @returns {string} Confidence level
     */
    calculateConfidence(strength) {
        if (strength < 30) return 'Low';
        if (strength < 60) return 'Medium';
        if (strength < 85) return 'High';
        return 'Very High';
    }

    /**
     * Update technique feedback messages
     * @param {Array} messages - Array of feedback message strings
     */
    updateTechniqueFeedback(messages) {
        const feedbackEl = document.getElementById('technique-feedback');
        if (feedbackEl && messages && messages.length > 0) {
            feedbackEl.innerHTML = messages.map(msg =>
                `<p class="feedback-message">${msg}</p>`
            ).join('');
        }
    }

    /**
     * Update search time display
     */
    updateSearchTime() {
        const elapsed = Math.floor((Date.now() - this.searchStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.updateElement('metric-time', timeStr);
    }

    /**
     * Update audio status display
     * @param {boolean} enabled - Audio enabled state
     */
    updateAudioStatus(enabled) {
        const iconEl = document.getElementById('audio-icon');
        const statusEl = document.getElementById('audio-status');

        if (iconEl && statusEl) {
            iconEl.textContent = enabled ? '🔊' : '🔇';
            statusEl.textContent = enabled ? 'Disable Audio' : 'Enable Audio';
        }
    }

    /**
     * Helper to update element text content
     * @param {string} id - Element ID
     * @param {string|number} value - Value to display
     */
    updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }

    /**
     * Toggle panel minimized state
     */
    toggleMinimize() {
        const content = this.panel.querySelector('.metrics-content');
        const toggleBtn = document.getElementById('metrics-toggle');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggleBtn.textContent = '−';
            toggleBtn.title = 'Minimize panel';
        } else {
            content.style.display = 'none';
            toggleBtn.textContent = '+';
            toggleBtn.title = 'Expand panel';
        }
    }

    /**
     * Show/hide panel
     * @param {boolean} visible - Visibility state
     */
    setVisible(visible) {
        this.visible = visible;
        if (this.panel) {
            this.panel.style.display = visible ? 'block' : 'none';
        }
    }

    /**
     * Reset all statistics
     */
    reset() {
        this.targetsFound.clear();
        this.searchStartTime = Date.now();
        this.updateElement('metric-targets', 0);
        this.updateElement('metric-coverage', '0%');
        this.clearMetalType();
    }

    /**
     * Clean up (remove panel and stop timers)
     */
    destroy() {
        if (this.searchTimeInterval) {
            clearInterval(this.searchTimeInterval);
        }
        if (this.panel) {
            this.panel.remove();
        }
    }
}
