/**
 * UIControls
 * Manages UI controls for scenario selection, settings, and status display
 * Creates and manages control bar and status bar elements
 */

export class UIControls {
    constructor() {
        this.controlBar = null;
        this.statusBar = null;
        this.scoreModal = null;
        this.onScenarioChange = null;
        this.onReset = null;
        this.onGroundTruthToggle = null;

        this.createControlBar();
        this.createStatusBar();
        this.createScoreModal();
    }

    /**
     * Create top control bar
     */
    createControlBar() {
        this.controlBar = document.createElement('div');
        this.controlBar.id = 'control-bar';
        this.controlBar.className = 'control-bar';

        this.controlBar.innerHTML = `
            <div class="control-group">
                <label for="scenario-selector">Scenario:</label>
                <select id="scenario-selector" class="scenario-selector">
                    <option value="default">Free Practice</option>
                    <option value="beginner">Beginner Training</option>
                    <option value="intermediate">Intermediate Search</option>
                    <option value="advanced">Advanced Challenge</option>
                    <option value="treasure-hunt">Treasure Hunt</option>
                </select>
            </div>

            <div class="control-group">
                <button id="reset-btn" class="control-btn reset-btn" title="Reset scenario">
                    🔄 Reset
                </button>
                <button id="ground-truth-btn" class="control-btn" title="Toggle ground truth (T key)">
                    👁️ Show Objects
                </button>
                <button id="help-btn" class="control-btn" title="Show help and tips">
                    ❓ Help
                </button>
            </div>
        `;

        document.body.insertBefore(this.controlBar, document.body.firstChild);

        // Wire up event listeners
        this.setupControlListeners();
    }

    /**
     * Create bottom status bar
     */
    createStatusBar() {
        this.statusBar = document.createElement('div');
        this.statusBar.id = 'status-bar';
        this.statusBar.className = 'status-bar';

        this.statusBar.innerHTML = `
            <div class="status-group">
                <span id="scenario-name" class="status-label">Free Practice</span>
                <span class="status-separator">|</span>
                <span id="targets-status" class="status-value">Targets: 0/0</span>
            </div>

            <div class="status-group">
                <span id="score-status" class="status-value">Score: --</span>
                <span class="status-separator">|</span>
                <span id="time-status" class="status-value">Time: 0:00</span>
            </div>

            <div class="status-group">
                <button id="finish-btn" class="control-btn finish-btn" style="display: none;">
                    🏁 Finish
                </button>
                <button id="export-btn" class="control-btn export-btn" title="Export results">
                    💾 Export
                </button>
            </div>
        `;

        document.body.appendChild(this.statusBar);
    }

    /**
     * Create score modal for end of scenario
     */
    createScoreModal() {
        this.scoreModal = document.createElement('div');
        this.scoreModal.id = 'score-modal';
        this.scoreModal.className = 'score-modal';
        this.scoreModal.style.display = 'none';

        this.scoreModal.innerHTML = `
            <div class="score-modal-content">
                <div class="score-modal-header">
                    <h2 id="score-modal-title">Scenario Complete!</h2>
                    <button id="score-modal-close" class="modal-close-btn">×</button>
                </div>
                <div class="score-modal-body">
                    <div class="score-display">
                        <div class="final-score">
                            <span class="score-label">Final Score</span>
                            <span id="final-score-value" class="score-value-large">0</span>
                            <span id="final-grade" class="score-grade">F</span>
                        </div>
                        <div id="pass-status" class="pass-status">--</div>
                    </div>

                    <div class="score-breakdown">
                        <h3>Performance Breakdown</h3>
                        <div class="score-row">
                            <span>Targets Found:</span>
                            <span id="modal-targets">0/0</span>
                        </div>
                        <div class="score-row">
                            <span>Coverage:</span>
                            <span id="modal-coverage">0%</span>
                        </div>
                        <div class="score-row">
                            <span>Technique:</span>
                            <span id="modal-technique">0</span>
                        </div>
                        <div class="score-row">
                            <span>Efficiency:</span>
                            <span id="modal-efficiency">0</span>
                        </div>
                        <div class="score-row">
                            <span>Time Taken:</span>
                            <span id="modal-time">0:00</span>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button id="modal-retry-btn" class="modal-btn retry-btn">🔄 Retry</button>
                        <button id="modal-next-btn" class="modal-btn next-btn">➡️ Next Scenario</button>
                        <button id="modal-export-btn" class="modal-btn export-btn">💾 Export Results</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.scoreModal);

        // Wire up modal listeners
        this.setupModalListeners();
    }

    /**
     * Setup control bar event listeners
     */
    setupControlListeners() {
        // Scenario selector
        const scenarioSelector = document.getElementById('scenario-selector');
        if (scenarioSelector) {
            scenarioSelector.addEventListener('change', (e) => {
                if (this.onScenarioChange) {
                    this.onScenarioChange(e.target.value);
                }
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.onReset) {
                    this.onReset();
                }
            });
        }

        // Ground truth toggle
        const groundTruthBtn = document.getElementById('ground-truth-btn');
        if (groundTruthBtn) {
            groundTruthBtn.addEventListener('click', () => {
                if (this.onGroundTruthToggle) {
                    this.onGroundTruthToggle();
                }
            });
        }

        // Help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelpModal();
            });
        }

        // Finish button
        const finishBtn = document.getElementById('finish-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                if (this.onFinish) {
                    this.onFinish();
                }
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.onExport) {
                    this.onExport();
                }
            });
        }
    }

    /**
     * Setup score modal event listeners
     */
    setupModalListeners() {
        // Close button
        const closeBtn = document.getElementById('score-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideScoreModal();
            });
        }

        // Retry button
        const retryBtn = document.getElementById('modal-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.hideScoreModal();
                if (this.onReset) {
                    this.onReset();
                }
            });
        }

        // Next scenario button
        const nextBtn = document.getElementById('modal-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.hideScoreModal();
                this.selectNextScenario();
            });
        }

        // Export button
        const exportBtn = document.getElementById('modal-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.onExport) {
                    this.onExport();
                }
            });
        }
    }

    /**
     * Update status bar with current metrics
     * @param {Object} status - Status data
     */
    updateStatus(status) {
        // Scenario name
        if (status.scenarioName) {
            const nameEl = document.getElementById('scenario-name');
            if (nameEl) nameEl.textContent = status.scenarioName;
        }

        // Targets
        if (status.targetsFound !== undefined && status.totalTargets !== undefined) {
            const targetsEl = document.getElementById('targets-status');
            if (targetsEl) {
                targetsEl.textContent = `Targets: ${status.targetsFound}/${status.totalTargets}`;
            }
        }

        // Score
        if (status.score !== undefined) {
            const scoreEl = document.getElementById('score-status');
            if (scoreEl) {
                scoreEl.textContent = `Score: ${Math.round(status.score)}`;
            }
        }

        // Time
        if (status.time !== undefined) {
            const timeEl = document.getElementById('time-status');
            if (timeEl) {
                timeEl.textContent = `Time: ${status.time}`;
            }
        }

        // Show/hide finish button
        if (status.showFinish !== undefined) {
            const finishBtn = document.getElementById('finish-btn');
            if (finishBtn) {
                finishBtn.style.display = status.showFinish ? 'inline-block' : 'none';
            }
        }
    }

    /**
     * Show score modal with results
     * @param {Object} scoreReport - Score report from ScoringSystem
     */
    showScoreModal(scoreReport) {
        // Update title
        const titleEl = document.getElementById('score-modal-title');
        if (titleEl) {
            titleEl.textContent = scoreReport.passed ? '🎉 Scenario Complete!' : '📊 Scenario Complete';
        }

        // Update score display
        const scoreEl = document.getElementById('final-score-value');
        const gradeEl = document.getElementById('final-grade');
        const statusEl = document.getElementById('pass-status');

        if (scoreEl) scoreEl.textContent = scoreReport.finalScore;
        if (gradeEl) gradeEl.textContent = scoreReport.grade || 'N/A';
        if (statusEl) {
            statusEl.textContent = scoreReport.passed ? '✓ PASSED' : '✗ NOT PASSED';
            statusEl.className = scoreReport.passed ? 'pass-status passed' : 'pass-status failed';
        }

        // Update breakdown
        const targetsEl = document.getElementById('modal-targets');
        const coverageEl = document.getElementById('modal-coverage');
        const techniqueEl = document.getElementById('modal-technique');
        const efficiencyEl = document.getElementById('modal-efficiency');
        const timeEl = document.getElementById('modal-time');

        if (targetsEl) targetsEl.textContent = `${scoreReport.targetsFound}/${scoreReport.totalTargets}`;
        if (coverageEl) coverageEl.textContent = `${scoreReport.coverage}%`;
        if (techniqueEl) techniqueEl.textContent = scoreReport.techniqueScore || 'N/A';
        if (efficiencyEl) efficiencyEl.textContent = scoreReport.efficiency || 'N/A';
        if (timeEl) timeEl.textContent = scoreReport.timeElapsedFormatted || '0:00';

        // Show modal
        this.scoreModal.style.display = 'flex';
    }

    /**
     * Hide score modal
     */
    hideScoreModal() {
        this.scoreModal.style.display = 'none';
    }

    /**
     * Show help modal with tips
     */
    showHelpModal() {
        alert('Metal Detector Simulator Help\n\n' +
            'Controls:\n' +
            '• Move mouse to control detector\n' +
            '• A - Toggle audio\n' +
            '• R - Reset\n' +
            '• T - Toggle ground truth\n' +
            '• L - Toggle legend\n\n' +
            'Tips:\n' +
            '• Use systematic sweeping patterns\n' +
            '• Listen for high-pitched tones (valuable targets)\n' +
            '• Check VDI values: 80+ is usually good\n' +
            '• Iron (trash) has low VDI (0-30) and low tones');
    }

    /**
     * Select next scenario in progression
     */
    selectNextScenario() {
        const selector = document.getElementById('scenario-selector');
        if (!selector) return;

        const scenarios = ['beginner', 'intermediate', 'advanced', 'treasure-hunt'];
        const currentValue = selector.value;
        const currentIndex = scenarios.indexOf(currentValue);

        if (currentIndex >= 0 && currentIndex < scenarios.length - 1) {
            selector.value = scenarios[currentIndex + 1];
            selector.dispatchEvent(new Event('change'));
        }
    }

    /**
     * Set scenario selector value
     * @param {string} scenarioName - Scenario name
     */
    setScenario(scenarioName) {
        const selector = document.getElementById('scenario-selector');
        if (selector) {
            selector.value = scenarioName;
        }
    }

    /**
     * Update ground truth button state
     * @param {boolean} active - Whether ground truth is visible
     */
    updateGroundTruthButton(active) {
        const btn = document.getElementById('ground-truth-btn');
        if (btn) {
            btn.textContent = active ? '👁️ Hide Objects' : '👁️ Show Objects';
            btn.classList.toggle('active', active);
        }
    }
}
