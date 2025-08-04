


document.addEventListener('DOMContentLoaded', function() {
    const roofTypeSelect = document.getElementById('roofType');
    const calculateBtn = document.getElementById('calculateBtn');
    const result = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    const canvas = document.getElementById('roofCanvas');
    const ctx = canvas.getContext('2d');

    roofTypeSelect.addEventListener('change', function() {
        const rectangularInputs = document.querySelector('.rectangular-inputs');
        const triangularInputs = document.querySelector('.triangular-inputs');

        if (this.value === 'rectangular') {
            rectangularInputs.style.display = 'block';
            triangularInputs.style.display = 'none';
        } else {
            rectangularInputs.style.display = 'none';
            triangularInputs.style.display = 'block';
        }

        result.classList.add('result-hidden');
        clearCanvas();
    });

    calculateBtn.addEventListener('click', calculate);

    function calculate() {
        const roofType = roofTypeSelect.value;

        if (roofType === 'rectangular') {
            calculateRectangular();
        } else {
            calculateTriangular();
        }
    }

    function calculateRectangular() {
        const roofX = parseFloat(document.getElementById('roofX').value);
        const roofY = parseFloat(document.getElementById('roofY').value);
        const panelA = parseFloat(document.getElementById('panelA').value);
        const panelB = parseFloat(document.getElementById('panelB').value);

        if (!roofX || !roofY || !panelA || !panelB || roofX <= 0 || roofY <= 0 || panelA <= 0 || panelB <= 0) {
            alert('Por favor ingresa valores válidos 😅');
            return;
        }

        const bestResult = calculateOptimalRectangularPacking(roofX, roofY, panelA, panelB);

        showResult(bestResult, roofX, roofY, panelA, panelB);
        drawRectangularRoof(roofX, roofY, bestResult);
    }

    function calculatePanelsInOrientation(roofX, roofY, panelW, panelH) {
        const panelsHorizontal = Math.floor(roofX / panelW);
        const panelsVertical = Math.floor(roofY / panelH);
        const totalPanels = panelsHorizontal * panelsVertical;

        return {
            panelsHorizontal,
            panelsVertical,
            totalPanels
        };
    }

    function calculateOptimalRectangularPacking(roofX, roofY, panelA, panelB) {
        const orientation1 = calculatePanelsInOrientation(roofX, roofY, panelA, panelB);
        const orientation2 = calculatePanelsInOrientation(roofX, roofY, panelB, panelA);

        let bestSolution = orientation1.totalPanels >= orientation2.totalPanels ?
            { ...orientation1, panelWidth: panelA, panelHeight: panelB, orientation: 'original', panels: [] } :
            { ...orientation2, panelWidth: panelB, panelHeight: panelA, orientation: 'rotated', panels: [] };

        const mixedSolution = calculateMixedOrientationPacking(roofX, roofY, panelA, panelB);

        if (mixedSolution.totalPanels > bestSolution.totalPanels) {
            bestSolution = mixedSolution;
        }

        return bestSolution;
    }

    function calculateMixedOrientationPacking(roofX, roofY, panelA, panelB) {
        const maxBestSolutions = [];

        maxBestSolutions.push(tryMixedPacking(roofX, roofY, panelA, panelB, true));
        maxBestSolutions.push(tryMixedPacking(roofX, roofY, panelA, panelB, false));

        return maxBestSolutions.reduce((best, current) =>
            current.totalPanels > best.totalPanels ? current : best
        );
    }

    function tryMixedPacking(roofX, roofY, panelA, panelB, preferOriginal) {
        const panels = [];
        const occupied = [];

        for (let i = 0; i <= roofY; i++) {
            occupied[i] = [];
            for (let j = 0; j <= roofX; j++) {
                occupied[i][j] = false;
            }
        }

        function canPlace(x, y, w, h) {
            if (x + w > roofX || y + h > roofY) return false;
            for (let i = y; i < y + h; i++) {
                for (let j = x; j < x + w; j++) {
                    if (occupied[i][j]) return false;
                }
            }
            return true;
        }

        function place(x, y, w, h, orientation) {
            for (let i = y; i < y + h; i++) {
                for (let j = x; j < x + w; j++) {
                    occupied[i][j] = true;
                }
            }
            panels.push({ x, y, width: w, height: h, orientation });
        }

        for (let y = 0; y <= roofY; y++) {
            for (let x = 0; x <= roofX; x++) {
                if (preferOriginal) {
                    if (canPlace(x, y, panelA, panelB)) {
                        place(x, y, panelA, panelB, 'original');
                    } else if (canPlace(x, y, panelB, panelA)) {
                        place(x, y, panelB, panelA, 'rotated');
                    }
                } else {
                    if (canPlace(x, y, panelB, panelA)) {
                        place(x, y, panelB, panelA, 'rotated');
                    } else if (canPlace(x, y, panelA, panelB)) {
                        place(x, y, panelA, panelB, 'original');
                    }
                }
            }
        }

        const totalPanels = panels.length;
        const originalCount = panels.filter(p => p.orientation === 'original').length;
        const rotatedCount = panels.filter(p => p.orientation === 'rotated').length;

        return {
            totalPanels,
            panels,
            panelWidth: panelA,
            panelHeight: panelB,
            orientation: 'mixed',
            originalCount,
            rotatedCount,
            panelsHorizontal: Math.floor(roofX / Math.min(panelA, panelB)),
            panelsVertical: Math.floor(roofY / Math.min(panelA, panelB))
        };
    }

    function calculateTriangular() {
        const base = parseFloat(document.getElementById('triangleBase').value);
        const height = parseFloat(document.getElementById('triangleHeight').value);
        const panelA = parseFloat(document.getElementById('panelA').value);
        const panelB = parseFloat(document.getElementById('panelB').value);

        if (!base || !height || !panelA || !panelB || base <= 0 || height <= 0 || panelA <= 0 || panelB <= 0) {
            alert('Por favor ingresa valores válidos 😅');
            return;
        }

        const bestResult = calculateOptimalTriangularPacking(base, height, panelA, panelB);

        showTriangularResult(bestResult, base, height, panelA, panelB);
        drawTriangularRoof(base, height, bestResult);
    }

    function calculatePanelsInTriangle(base, height, panelW, panelH) {
        const panels = [];
        const step = 0.5;

        for (let y = 0; y <= height - panelH; y += step) {
            for (let x = 0; x <= base - panelW; x += step) {
                if (isRectangleInTriangle(x, y, panelW, panelH, base, height)) {

                    let overlaps = false;
                    for (let panel of panels) {
                        if (rectanglesOverlap(x, y, panelW, panelH, panel.x, panel.y, panelW, panelH)) {
                            overlaps = true;
                            break;
                        }
                    }

                    if (!overlaps) {
                        panels.push({ x, y });
                    }
                }
            }
        }

        return { panels };
    }

    function calculateOptimalTriangularPacking(base, height, panelA, panelB) {
        const orientation1 = calculatePanelsInTriangle(base, height, panelA, panelB);
        const orientation2 = calculatePanelsInTriangle(base, height, panelB, panelA);

        let bestSolution = orientation1.panels.length >= orientation2.panels.length ?
            { ...orientation1, panelWidth: panelA, panelHeight: panelB, orientation: 'original' } :
            { ...orientation2, panelWidth: panelB, panelHeight: panelA, orientation: 'rotated' };

        const mixedSolution = calculateMixedTriangularPacking(base, height, panelA, panelB);

        if (mixedSolution.panels.length > bestSolution.panels.length) {
            bestSolution = mixedSolution;
        }

        return bestSolution;
    }

    function calculateMixedTriangularPacking(base, height, panelA, panelB) {
        const panels = [];
        const step = 0.5;

        for (let y = 0; y <= height; y += step) {
            for (let x = 0; x <= base; x += step) {
                let placed = false;

                if (!placed && isRectangleInTriangle(x, y, panelA, panelB, base, height)) {
                    let overlaps = false;
                    for (let panel of panels) {
                        if (rectanglesOverlap(x, y, panelA, panelB, panel.x, panel.y, panel.width, panel.height)) {
                            overlaps = true;
                            break;
                        }
                    }

                    if (!overlaps) {
                        panels.push({ x, y, width: panelA, height: panelB, orientation: 'original' });
                        placed = true;
                    }
                }

                if (!placed && isRectangleInTriangle(x, y, panelB, panelA, base, height)) {
                    let overlaps = false;
                    for (let panel of panels) {
                        if (rectanglesOverlap(x, y, panelB, panelA, panel.x, panel.y, panel.width, panel.height)) {
                            overlaps = true;
                            break;
                        }
                    }

                    if (!overlaps) {
                        panels.push({ x, y, width: panelB, height: panelA, orientation: 'rotated' });
                        placed = true;
                    }
                }
            }
        }

        const originalCount = panels.filter(p => p.orientation === 'original').length;
        const rotatedCount = panels.filter(p => p.orientation === 'rotated').length;

        return {
            panels,
            panelWidth: panelA,
            panelHeight: panelB,
            orientation: 'mixed',
            originalCount,
            rotatedCount
        };
    }

    function isRectangleInTriangle(x, y, w, h, base, triangleHeight) {
        const corners = [
            { x: x, y: y },
            { x: x + w, y: y },
            { x: x, y: y + h },
            { x: x + w, y: y + h }
        ];

        for (let corner of corners) {
            if (!isPointInTriangle(corner.x, corner.y, base, triangleHeight)) {
                return false;
            }
        }
        return true;
    }

    function isPointInTriangle(x, y, base, height) {

        if (y < 0 || y > height) return false;

        const widthAtY = base * (height - y) / height;
        const leftBound = (base - widthAtY) / 2;
        const rightBound = (base + widthAtY) / 2;

        return x >= leftBound && x <= rightBound;
    }

    function rectanglesOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
    }

    function showResult(calculationResult, roofX, roofY, panelA, panelB) {
        if (!result || !resultText) {
            console.error('Result element not found');
            return;
        }

        let orientationText;
        if (calculationResult.orientation === 'mixed') {
            orientationText = ` (${calculationResult.originalCount} paneles ${panelA}×${panelB} + ${calculationResult.rotatedCount} paneles ${panelB}×${panelA})`;
        } else if (calculationResult.orientation === 'rotated') {
            orientationText = ` (paneles rotados ${panelB}×${panelA})`;
        } else {
            orientationText = ` (paneles ${panelA}×${panelB})`;
        }

        const distributionText = calculationResult.orientation === 'mixed' ?
            'Orientación mixta optimizada' :
            `${calculationResult.panelsHorizontal} × ${calculationResult.panelsVertical}`;

        resultText.innerHTML = `
            <strong>🎉 ¡caben ${calculationResult.totalPanels} paneles!</strong><br>
            Distribución: ${distributionText}${orientationText}<br>
            Techo: ${roofX}×${roofY} | Panel: ${panelA}×${panelB}
        `;
        result.classList.remove('result-hidden');
    }

    function showTriangularResult(calculationResult, base, height, panelA, panelB) {
        if (!result || !resultText) {
            console.error('Result element not found');
            return;
        }

        let orientationText;
        if (calculationResult.orientation === 'mixed') {
            orientationText = ` (${calculationResult.originalCount} paneles ${panelA}×${panelB} + ${calculationResult.rotatedCount} paneles ${panelB}×${panelA})`;
        } else if (calculationResult.orientation === 'rotated') {
            orientationText = ` (paneles rotados ${panelB}×${panelA})`;
        } else {
            orientationText = ` (paneles ${panelA}×${panelB})`;
        }

        resultText.innerHTML = `
            <strong>🎉 ¡caben ${calculationResult.panels.length} paneles!</strong><br>
            En triángulo de base ${base} y altura ${height}${orientationText}<br>
            Panel: ${panelA}×${panelB}<br>
            <em>💡 Algoritmo optimizado con orientaciones mixtas</em>
        `;
        result.classList.remove('result-hidden');
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawRectangularRoof(roofX, roofY, result) {
        clearCanvas();

        const scale = Math.min(350 / roofX, 200 / roofY);
        const startX = (canvas.width - roofX * scale) / 2;
        const startY = (canvas.height - roofY * scale) / 2 + 40;

        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, startY, roofX * scale, roofY * scale);

        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 1;

        if (result.orientation === 'mixed' && result.panels) {
            for (let panel of result.panels) {
                const x = startX + panel.x * scale;
                const y = startY + panel.y * scale;
                const w = panel.width * scale;
                const h = panel.height * scale;

                ctx.fillStyle = panel.orientation === 'original' ? '#f39c12' : '#3498db';
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);
            }
        } else {
            ctx.fillStyle = '#f39c12';
            const panelWidth = result.panelWidth * scale;
            const panelHeight = result.panelHeight * scale;

            for (let i = 0; i < result.panelsHorizontal; i++) {
                for (let j = 0; j < result.panelsVertical; j++) {
                    const x = startX + i * panelWidth;
                    const y = startY + j * panelHeight;

                    ctx.fillRect(x, y, panelWidth, panelHeight);
                    ctx.strokeRect(x, y, panelWidth, panelHeight);
                }
            }
        }

        ctx.fillStyle = '#2c3e50';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${result.totalPanels} paneles solares 🌞`, canvas.width / 2, 25);
    }

    function drawTriangularRoof(base, height, result) {
        clearCanvas();

        const scale = Math.min(350 / base, 200 / height);
        const startX = (canvas.width - base * scale) / 2;
        const startY = (canvas.height - height * scale) / 2 + 40;


        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY + height * scale);
        ctx.lineTo(startX + base * scale / 2, startY);
        ctx.lineTo(startX + base * scale, startY + height * scale);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 1;

        for (let panel of result.panels) {
            const x = startX + panel.x * scale;
            const panelHeight = panel.height || result.panelHeight;
            const panelWidth = panel.width || result.panelWidth;
            const y = startY + (height - panel.y - panelHeight) * scale;

            if (result.orientation === 'mixed') {
                ctx.fillStyle = panel.orientation === 'original' ? '#f39c12' : '#3498db';
                ctx.fillRect(x, y, panelWidth * scale, panelHeight * scale);
                ctx.strokeRect(x, y, panelWidth * scale, panelHeight * scale);
            } else {
                ctx.fillStyle = '#f39c12';
                ctx.fillRect(x, y, result.panelWidth * scale, result.panelHeight * scale);
                ctx.strokeRect(x, y, result.panelWidth * scale, result.panelHeight * scale);
            }
        }

        ctx.fillStyle = '#2c3e50';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${result.panels.length} paneles en triángulo 🔺`, canvas.width / 2, 25);
    }
});