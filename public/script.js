


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

        const orientation1 = calculatePanelsInOrientation(roofX, roofY, panelA, panelB);
        const orientation2 = calculatePanelsInOrientation(roofX, roofY, panelB, panelA);

        let bestResult;
        if (orientation1.totalPanels >= orientation2.totalPanels) {
            bestResult = orientation1;
            bestResult.panelWidth = panelA;
            bestResult.panelHeight = panelB;
            bestResult.orientation = 'original';
        } else {
            bestResult = orientation2;
            bestResult.panelWidth = panelB;
            bestResult.panelHeight = panelA;
            bestResult.orientation = 'rotated';
        }

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

    function calculateTriangular() {
        const base = parseFloat(document.getElementById('triangleBase').value);
        const height = parseFloat(document.getElementById('triangleHeight').value);
        const panelA = parseFloat(document.getElementById('panelA').value);
        const panelB = parseFloat(document.getElementById('panelB').value);

        if (!base || !height || !panelA || !panelB || base <= 0 || height <= 0 || panelA <= 0 || panelB <= 0) {
            alert('Por favor ingresa valores válidos 😅');
            return;
        }

        const orientation1 = calculatePanelsInTriangle(base, height, panelA, panelB);
        const orientation2 = calculatePanelsInTriangle(base, height, panelB, panelA);

        let bestResult;
        if (orientation1.panels.length >= orientation2.panels.length) {
            bestResult = orientation1;
            bestResult.panelWidth = panelA;
            bestResult.panelHeight = panelB;
            bestResult.orientation = 'original';
        } else {
            bestResult = orientation2;
            bestResult.panelWidth = panelB;
            bestResult.panelHeight = panelA;
            bestResult.orientation = 'rotated';
        }

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

        const orientationText = calculationResult.orientation === 'rotated' ?
            ` (paneles rotados ${panelB}×${panelA})` :
            ` (paneles ${panelA}×${panelB})`;

        resultText.innerHTML = `
            <strong>🎉 ¡caben ${calculationResult.totalPanels} paneles!</strong><br>
            Distribución: ${calculationResult.panelsHorizontal} × ${calculationResult.panelsVertical}${orientationText}<br>
            Techo: ${roofX}×${roofY} | Panel: ${panelA}×${panelB}
        `;
        result.classList.remove('result-hidden');
    }

    function showTriangularResult(calculationResult, base, height, panelA, panelB) {
        if (!result || !resultText) {
            console.error('Result element not found');
            return;
        }

        const orientationText = calculationResult.orientation === 'rotated' ?
            ` (paneles rotados ${panelB}×${panelA})` :
            ` (paneles ${panelA}×${panelB})`;

        resultText.innerHTML = `
            <strong>🎉 ¡caben ${calculationResult.panels.length} paneles!</strong><br>
            En triángulo de base ${base} y altura ${height}${orientationText}<br>
            Panel: ${panelA}×${panelB}<br>
            <em>💡 Algoritmo aproximado - podría haber más optimizaciones</em>
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

        ctx.fillStyle = '#f39c12';
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 1;

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

        ctx.fillStyle = '#f39c12';
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 1;

        const panelWidth = result.panelWidth * scale;
        const panelHeight = result.panelHeight * scale;

        for (let panel of result.panels) {
            const x = startX + panel.x * scale;
            const y = startY + (height - panel.y - result.panelHeight) * scale;

            ctx.fillRect(x, y, panelWidth, panelHeight);
            ctx.strokeRect(x, y, panelWidth, panelHeight);
        }

        ctx.fillStyle = '#2c3e50';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${result.panels.length} paneles en triángulo 🔺`, canvas.width / 2, 25);
    }
});