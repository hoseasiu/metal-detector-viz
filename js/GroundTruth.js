/**
 * GroundTruth
 * Renders the actual locations of buried objects (for learning/debugging)
 * Shows markers and labels for all targets in the scenario
 */

export class GroundTruth {
    constructor(p5Instance) {
        this.p = p5Instance;
        this.visible = false;
        this.objects = [];
        this.foundObjects = new Set();
        this.showLabels = true;
        this.showRanges = false;
    }

    /**
     * Set the objects to display
     * @param {Array} objects - Array of buried object data
     */
    setObjects(objects) {
        this.objects = objects || [];
    }

    /**
     * Mark an object as found
     * @param {Object} object - Object that was found
     */
    markAsFound(object) {
        const key = `${object.name}_${object.x}_${object.y}`;
        this.foundObjects.add(key);
    }

    /**
     * Check if an object has been found
     * @param {Object} object - Object to check
     * @returns {boolean} True if found
     */
    isFound(object) {
        const key = `${object.name}_${object.x}_${object.y}`;
        return this.foundObjects.has(key);
    }

    /**
     * Toggle ground truth visibility
     */
    toggle() {
        this.visible = !this.visible;
    }

    /**
     * Set visibility
     * @param {boolean} visible - Visibility state
     */
    setVisible(visible) {
        this.visible = visible;
    }

    /**
     * Toggle label visibility
     */
    toggleLabels() {
        this.showLabels = !this.showLabels;
    }

    /**
     * Toggle detection range circles
     */
    toggleRanges() {
        this.showRanges = !this.showRanges;
    }

    /**
     * Render ground truth overlay
     */
    render() {
        if (!this.visible || this.objects.length === 0) return;

        this.p.push();

        for (let obj of this.objects) {
            const found = this.isFound(obj);

            // Determine color based on metal type and found status
            const color = this.getObjectColor(obj, found);
            const alpha = found ? 200 : 150;

            // Draw detection range circle if enabled
            if (this.showRanges) {
                this.p.noFill();
                this.p.stroke(color[0], color[1], color[2], 60);
                this.p.strokeWeight(1);
                this.p.circle(obj.x, obj.y, 150 * 2); // Detection range radius
            }

            // Draw X marker
            this.p.stroke(color[0], color[1], color[2], alpha);
            this.p.strokeWeight(found ? 3 : 2);
            const markerSize = found ? 12 : 10;
            this.p.line(obj.x - markerSize, obj.y - markerSize, obj.x + markerSize, obj.y + markerSize);
            this.p.line(obj.x - markerSize, obj.y + markerSize, obj.x + markerSize, obj.y - markerSize);

            // Draw circle around marker
            this.p.noFill();
            this.p.circle(obj.x, obj.y, found ? 24 : 20);

            // Draw checkmark if found
            if (found) {
                this.p.stroke(0, 255, 0, 220);
                this.p.strokeWeight(3);
                this.p.line(obj.x - 6, obj.y, obj.x - 2, obj.y + 4);
                this.p.line(obj.x - 2, obj.y + 4, obj.x + 6, obj.y - 6);
            }

            // Draw labels if enabled
            if (this.showLabels) {
                this.renderLabel(obj, color, found);
            }
        }

        // Draw legend
        this.renderLegend();

        this.p.pop();
    }

    /**
     * Render label for an object
     * @param {Object} obj - Object data
     * @param {Array} color - RGB color array
     * @param {boolean} found - Whether object was found
     */
    renderLabel(obj, color, found) {
        this.p.push();

        const labelY = obj.y + 30;
        const labelX = obj.x;

        // Background
        this.p.fill(0, 0, 0, 180);
        this.p.noStroke();
        this.p.rectMode(this.p.CENTER);
        this.p.rect(labelX, labelY, 140, 40, 5);

        // Text
        this.p.fill(color[0], color[1], color[2], found ? 255 : 200);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(10);
        this.p.textStyle(found ? this.p.BOLD : this.p.NORMAL);
        this.p.text(obj.name, labelX, labelY - 8);

        // Metal type and strength
        this.p.fill(255, 255, 255, found ? 220 : 180);
        this.p.textSize(8);
        this.p.textStyle(this.p.NORMAL);
        this.p.text(`${obj.metalType} • ${obj.strength}%`, labelX, labelY + 6);

        // Found indicator
        if (found) {
            this.p.fill(0, 255, 0, 200);
            this.p.textSize(9);
            this.p.textStyle(this.p.BOLD);
            this.p.text('✓ FOUND', labelX, labelY - 25);
        }

        this.p.pop();
    }

    /**
     * Get color for an object based on metal type
     * @param {Object} obj - Object data
     * @param {boolean} found - Whether object was found
     * @returns {Array} RGB color array
     */
    getObjectColor(obj, found) {
        // Color based on metal type
        const metalColors = {
            'IRON': [255, 100, 80],
            'ALUMINUM': [180, 180, 200],
            'COPPER': [255, 165, 60],
            'SILVER': [100, 200, 255]
        };

        let baseColor = metalColors[obj.metalType] || [200, 200, 200];

        // If found, make it greener
        if (found) {
            baseColor = [
                Math.floor(baseColor[0] * 0.5 + 100 * 0.5),
                Math.floor(baseColor[1] * 0.5 + 255 * 0.5),
                Math.floor(baseColor[2] * 0.5 + 100 * 0.5)
            ];
        }

        return baseColor;
    }

    /**
     * Render legend explaining the markers
     */
    renderLegend() {
        this.p.push();

        const legendX = 10;
        const legendY = 10;
        const legendWidth = 180;
        const legendHeight = 90;

        // Background
        this.p.fill(0, 0, 0, 200);
        this.p.noStroke();
        this.p.rect(legendX, legendY, legendWidth, legendHeight, 5);

        // Title
        this.p.fill(255, 255, 255);
        this.p.textAlign(this.p.LEFT, this.p.TOP);
        this.p.textSize(12);
        this.p.textStyle(this.p.BOLD);
        this.p.text('Ground Truth', legendX + 10, legendY + 8);

        // Markers legend
        this.p.textSize(9);
        this.p.textStyle(this.p.NORMAL);
        this.p.fill(200, 200, 200);
        this.p.text('X = Target location', legendX + 10, legendY + 28);

        this.p.fill(0, 255, 0);
        this.p.text('✓ = Target found', legendX + 10, legendY + 42);

        this.p.fill(180, 180, 180);
        this.p.text('Colors indicate metal type', legendX + 10, legendY + 56);

        // Keyboard shortcut
        this.p.fill(255, 200, 100);
        this.p.textSize(8);
        this.p.text('Press T to toggle this view', legendX + 10, legendY + 72);

        this.p.pop();
    }

    /**
     * Get statistics about found objects
     * @returns {Object} Statistics
     */
    getStatistics() {
        const total = this.objects.length;
        const found = this.foundObjects.size;
        const remaining = total - found;

        // Count by metal type
        const byType = {
            IRON: { total: 0, found: 0 },
            ALUMINUM: { total: 0, found: 0 },
            COPPER: { total: 0, found: 0 },
            SILVER: { total: 0, found: 0 }
        };

        for (let obj of this.objects) {
            const type = obj.metalType;
            if (byType[type]) {
                byType[type].total++;
                if (this.isFound(obj)) {
                    byType[type].found++;
                }
            }
        }

        return {
            total,
            found,
            remaining,
            percentage: total > 0 ? Math.round((found / total) * 100) : 0,
            byType
        };
    }

    /**
     * Reset found objects tracking
     */
    reset() {
        this.foundObjects.clear();
    }

    /**
     * Get all object locations (for collision detection)
     * @returns {Array} Array of object locations
     */
    getObjectLocations() {
        return this.objects.map(obj => ({
            x: obj.x,
            y: obj.y,
            name: obj.name,
            metalType: obj.metalType
        }));
    }
}
