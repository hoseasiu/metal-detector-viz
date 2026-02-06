/**
 * ScenarioManager
 * Manages training scenarios with different difficulty levels and configurations
 * Loads scenario data and controls object placement
 */

export class ScenarioManager {
    constructor() {
        this.scenarios = this.createBuiltInScenarios();
        this.currentScenario = null;
        this.currentScenarioName = null;
    }

    /**
     * Create built-in scenarios (no external JSON loading needed)
     * @returns {Object} Scenarios object
     */
    createBuiltInScenarios() {
        return {
            'beginner': {
                name: 'Beginner Training',
                description: 'Single shallow target, no clutter. Perfect for learning the basics.',
                difficulty: 'BEGINNER',
                objects: [
                    {
                        x: 400,
                        y: 300,
                        strength: 85,
                        metalType: 'SILVER',
                        name: 'Silver Coin'
                    }
                ],
                timeLimit: 180, // 3 minutes
                passingScore: 70,
                targetCount: 1,
                tips: [
                    'Move slowly and systematically',
                    'Listen for high-pitched tones',
                    'Watch the VDI reading for values above 80'
                ]
            },

            'intermediate': {
                name: 'Intermediate Search',
                description: 'Multiple targets with some overlap. Test your discrimination skills.',
                difficulty: 'INTERMEDIATE',
                objects: [
                    {
                        x: 200,
                        y: 150,
                        strength: 90,
                        metalType: 'SILVER',
                        name: 'Silver Coin'
                    },
                    {
                        x: 450,
                        y: 300,
                        strength: 70,
                        metalType: 'COPPER',
                        name: 'Copper Pipe'
                    },
                    {
                        x: 600,
                        y: 180,
                        strength: 50,
                        metalType: 'ALUMINUM',
                        name: 'Aluminum Can'
                    },
                    {
                        x: 650,
                        y: 450,
                        strength: 40,
                        metalType: 'COPPER',
                        name: 'Small Copper Object'
                    }
                ],
                timeLimit: 300, // 5 minutes
                passingScore: 75,
                targetCount: 4,
                tips: [
                    'Use systematic sweeping patterns',
                    'Different tones indicate different metals',
                    'High VDI values (80+) are usually valuable targets'
                ]
            },

            'advanced': {
                name: 'Advanced Challenge',
                description: 'Multiple targets including trash. Master-level discrimination required.',
                difficulty: 'ADVANCED',
                objects: [
                    {
                        x: 200,
                        y: 150,
                        strength: 90,
                        metalType: 'SILVER',
                        name: 'Silver Coin'
                    },
                    {
                        x: 180,
                        y: 170,
                        strength: 85,
                        metalType: 'IRON',
                        name: 'Iron Nail (Trash)'
                    },
                    {
                        x: 450,
                        y: 300,
                        strength: 70,
                        metalType: 'COPPER',
                        name: 'Copper Ring'
                    },
                    {
                        x: 600,
                        y: 180,
                        strength: 55,
                        metalType: 'ALUMINUM',
                        name: 'Aluminum Pull Tab (Trash)'
                    },
                    {
                        x: 250,
                        y: 450,
                        strength: 80,
                        metalType: 'IRON',
                        name: 'Large Iron Fragment (Trash)'
                    },
                    {
                        x: 650,
                        y: 450,
                        strength: 65,
                        metalType: 'COPPER',
                        name: 'Brass Button'
                    },
                    {
                        x: 500,
                        y: 500,
                        strength: 75,
                        metalType: 'SILVER',
                        name: 'Silver Ring'
                    }
                ],
                timeLimit: 420, // 7 minutes
                passingScore: 80,
                targetCount: 7,
                tips: [
                    'Use VDI discrimination to ignore iron (VDI 0-30)',
                    'Listen carefully - iron has low, grunty tones',
                    'Search systematically to maximize coverage',
                    'Aluminum pull tabs can be tricky - check VDI values'
                ]
            },

            'treasure-hunt': {
                name: 'Treasure Hunt',
                description: 'Find all the valuable targets scattered across the field!',
                difficulty: 'INTERMEDIATE',
                objects: [
                    {
                        x: 150,
                        y: 100,
                        strength: 88,
                        metalType: 'SILVER',
                        name: 'Silver Dollar'
                    },
                    {
                        x: 650,
                        y: 120,
                        strength: 75,
                        metalType: 'COPPER',
                        name: 'Copper Penny'
                    },
                    {
                        x: 350,
                        y: 250,
                        strength: 92,
                        metalType: 'SILVER',
                        name: 'Silver Bracelet'
                    },
                    {
                        x: 550,
                        y: 380,
                        strength: 68,
                        metalType: 'COPPER',
                        name: 'Bronze Medal'
                    },
                    {
                        x: 200,
                        y: 520,
                        strength: 82,
                        metalType: 'SILVER',
                        name: 'Silver Chain'
                    },
                    {
                        x: 600,
                        y: 550,
                        strength: 70,
                        metalType: 'COPPER',
                        name: 'Copper Coin'
                    }
                ],
                timeLimit: 360, // 6 minutes
                passingScore: 85,
                targetCount: 6,
                tips: [
                    'Cover the entire area systematically',
                    'All targets are valuable - no trash!',
                    'Use overlapping sweeps for complete coverage'
                ]
            },

            'default': {
                name: 'Free Practice',
                description: 'Standard practice mode with mixed targets.',
                difficulty: 'INTERMEDIATE',
                objects: [
                    {
                        x: 200,
                        y: 150,
                        strength: 90,
                        metalType: 'SILVER',
                        name: 'Silver Coin'
                    },
                    {
                        x: 450,
                        y: 300,
                        strength: 70,
                        metalType: 'COPPER',
                        name: 'Copper Pipe'
                    },
                    {
                        x: 600,
                        y: 180,
                        strength: 50,
                        metalType: 'ALUMINUM',
                        name: 'Aluminum Can'
                    },
                    {
                        x: 250,
                        y: 450,
                        strength: 85,
                        metalType: 'IRON',
                        name: 'Iron Fragment'
                    },
                    {
                        x: 650,
                        y: 450,
                        strength: 40,
                        metalType: 'COPPER',
                        name: 'Small Copper Object'
                    }
                ],
                timeLimit: null, // No time limit
                passingScore: null, // No scoring
                targetCount: 5,
                tips: [
                    'Practice your technique',
                    'Experiment with different sweep speeds',
                    'Try both audio modes'
                ]
            }
        };
    }

    /**
     * Load a scenario by name
     * @param {string} scenarioName - Scenario name
     * @returns {boolean} Success status
     */
    loadScenario(scenarioName) {
        const scenario = this.scenarios[scenarioName];

        if (!scenario) {
            console.error(`Scenario not found: ${scenarioName}`);
            return false;
        }

        this.currentScenario = scenario;
        this.currentScenarioName = scenarioName;

        console.log(`Loaded scenario: ${scenario.name}`);
        console.log(`- Difficulty: ${scenario.difficulty}`);
        console.log(`- Targets: ${scenario.targetCount}`);
        console.log(`- Time limit: ${scenario.timeLimit ? scenario.timeLimit + 's' : 'None'}`);

        return true;
    }

    /**
     * Get current scenario
     * @returns {Object|null} Current scenario object
     */
    getCurrentScenario() {
        return this.currentScenario;
    }

    /**
     * Get current scenario name
     * @returns {string|null} Current scenario name
     */
    getCurrentScenarioName() {
        return this.currentScenarioName;
    }

    /**
     * Get objects for current scenario
     * @returns {Array} Array of buried objects
     */
    getObjects() {
        return this.currentScenario ? this.currentScenario.objects : [];
    }

    /**
     * Get all available scenario names
     * @returns {Array} Array of scenario names
     */
    getAvailableScenarios() {
        return Object.keys(this.scenarios);
    }

    /**
     * Get scenario info for display
     * @param {string} scenarioName - Scenario name
     * @returns {Object} Scenario info
     */
    getScenarioInfo(scenarioName) {
        const scenario = this.scenarios[scenarioName];
        if (!scenario) return null;

        return {
            name: scenario.name,
            description: scenario.description,
            difficulty: scenario.difficulty,
            targetCount: scenario.targetCount,
            timeLimit: scenario.timeLimit,
            passingScore: scenario.passingScore,
            tips: scenario.tips
        };
    }

    /**
     * Check if current scenario has time limit
     * @returns {boolean} True if time limited
     */
    hasTimeLimit() {
        return this.currentScenario && this.currentScenario.timeLimit !== null;
    }

    /**
     * Get time limit for current scenario
     * @returns {number|null} Time limit in seconds
     */
    getTimeLimit() {
        return this.currentScenario ? this.currentScenario.timeLimit : null;
    }

    /**
     * Check if current scenario has scoring
     * @returns {boolean} True if scoring enabled
     */
    hasScoring() {
        return this.currentScenario && this.currentScenario.passingScore !== null;
    }

    /**
     * Get passing score for current scenario
     * @returns {number|null} Passing score
     */
    getPassingScore() {
        return this.currentScenario ? this.currentScenario.passingScore : null;
    }

    /**
     * Get target count for current scenario
     * @returns {number} Number of targets
     */
    getTargetCount() {
        return this.currentScenario ? this.currentScenario.targetCount : 0;
    }

    /**
     * Get tips for current scenario
     * @returns {Array} Array of tip strings
     */
    getTips() {
        return this.currentScenario ? this.currentScenario.tips : [];
    }

    /**
     * Count valuable targets (non-iron) in current scenario
     * @returns {number} Number of valuable targets
     */
    getValuableTargetCount() {
        if (!this.currentScenario) return 0;

        return this.currentScenario.objects.filter(obj =>
            obj.metalType !== 'IRON'
        ).length;
    }

    /**
     * Count trash targets (iron) in current scenario
     * @returns {number} Number of trash targets
     */
    getTrashCount() {
        if (!this.currentScenario) return 0;

        return this.currentScenario.objects.filter(obj =>
            obj.metalType === 'IRON'
        ).length;
    }

    /**
     * Reset scenario (for replay)
     */
    reset() {
        // Scenario data stays loaded, just signals reset
        console.log('Scenario reset - ready to replay');
    }
}
