const ColorSortEngine = {
    selectedTubeIndex: null,
    maxCapacity: 4,
    currentLevel: 1,
    moveCount: 0,
    tubes: [],

    initLevel(level) {
        this.currentLevel = level;
        this.moveCount = 0;
        this.selectedTubeIndex = null;
        
        if (level === 1) {
            this.tubes = [
                ['red', 'blue', 'red', 'blue'],
                ['blue', 'red', 'blue', 'red'],
                [],
                []
            ];
        } else if (level === 2) {
            this.tubes = [
                ['green', 'red', 'blue', 'yellow'],
                ['yellow', 'blue', 'red', 'green'],
                ['red', 'yellow', 'green', 'blue'],
                [],
                []
            ];
        } else {
            this.tubes = [
                ['purple', 'green', 'red', 'blue'],
                ['blue', 'purple', 'yellow', 'green'],
                ['red', 'yellow', 'green', 'purple'],
                ['yellow', 'red', 'blue', 'purple'],
                [],
                []
            ];
        }
        this.render();
    },

    handleTubeClick(tubeIndex) {
        if (this.selectedTubeIndex === null) {
            if (this.tubes[tubeIndex].length === 0) return;

            const topColor = this.tubes[tubeIndex][this.tubes[tubeIndex].length - 1];
            let groupCount = 0;
            for (let i = this.tubes[tubeIndex].length - 1; i >= 0; i--) {
                if (this.tubes[tubeIndex][i] === topColor) {
                    groupCount++;
                } else {
                    break;
                }
            }

            this.selectedTubeIndex = { index: tubeIndex, color: topColor, count: groupCount };
            this.render();
        } else {
            if (this.selectedTubeIndex.index === tubeIndex) {
                this.selectedTubeIndex = null;
                this.render();
                return;
            }

            const sourceTube = this.tubes[this.selectedTubeIndex.index];
            const targetTube = this.tubes[tubeIndex];
            const groupColor = this.selectedTubeIndex.color;
            const groupCount = this.selectedTubeIndex.count;

            const isColorValid = targetTube.length === 0 || targetTube[targetTube.length - 1] === groupColor;
            const availableSpace = this.maxCapacity - targetTube.length;

            if (isColorValid && availableSpace >= groupCount) {
                const movedBalls = sourceTube.splice(sourceTube.length - groupCount, groupCount);
                targetTube.push(...movedBalls);

                this.moveCount++;
                this.selectedTubeIndex = null;
                this.render();
                this.checkWin();
            } else {
                this.selectedTubeIndex = null;
                this.render();
            }
        }
    },

    checkWin() {
        const isWon = this.tubes.every(tube => tube.length === 0 || (tube.length === 4 && tube.every(c => c === tube[0])));
        if (isWon) {
            setTimeout(() => {
                alert(`🎉 Tebrikler! Seviye ${this.currentLevel} başarıyla tamamlandı!
Toplam Hamle: ${this.moveCount}`);
                if (this.currentLevel < 20) {
                    this.initLevel(this.currentLevel + 1);
                } else {
                    alert("🏆 Harika! 20 seviyenin tamamını bitirdiniz!");
                    returnToMainMenu();
                }
            }, 100);
        }
    },

    render() {
        const container = document.getElementById('activeModuleContent');
        if (!container) return;

        let html = `
            <div style="text-align: center;">
                <div style="background: rgba(255,255,255,0.05); padding: 10px 16px; border-radius: 12px; display: inline-block; margin-bottom: 10px;">
                    <span style="color: #feca57; font-weight: bold;">Seviye ${this.currentLevel} / 20</span> &nbsp;|&nbsp; 
                    <span style="color: #a4b0be;">Hamle: ${this.moveCount}</span>
                </div>
                <div class="tubes-container">
        `;

        this.tubes.forEach((tube, idx) => {
            const isSelected = this.selectedTubeIndex && this.selectedTubeIndex.index === idx;
            html += `<div class="tube ${isSelected ? 'selected' : ''}" onclick="ColorSortEngine.handleTubeClick(${idx})">`;
            tube.forEach(color => {
                html += `<div class="ball ball-${color}"></div>`;
            });
            html += `</div>`;
        });

        html += `</div>
            <div style="margin-top: 25px;">
                <button class="premium-btn" onclick="ColorSortEngine.initLevel(${this.currentLevel})">Seviyeyi Yeniden Başlat</button>
            </div>
        </div>`;
        container.innerHTML = html;
    }
};