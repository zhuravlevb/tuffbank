// Рисовалка дизайна карты на p5.js (instance mode)
const cardDesigner = (p) => {
    const palette = ["#fa5b9d", "#e8f53d", "#9dff00", "#4ff5e0", "#6a1bff"];
    let bgColor = palette[0];
    let tool = "brush"; // "brush" | "eraser"
    let drawLayer; // слой с рисунком пользователя
    let logoImg;
    let W = 0;
    let H = 0;
    let r = 0; // радиус скругления карты
    let drawing = false;
    let prevX = 0; // предыдущая точка (свой трекинг, т.к. noLoop замораживает pmouse)
    let prevY = 0;

    p.preload = () => {
        logoImg = p.loadImage("images/logo.svg");
    };

    p.setup = () => {
        const holder = document.getElementById("p5-card");
        W = holder.clientWidth;
        H = Math.round(W / 1.585); // пропорции банковской карты
        r = W * 0.06;
        const cnv = p.createCanvas(W, H);
        cnv.parent(holder);
        cnv.elt.style.touchAction = "none";
        drawLayer = p.createGraphics(W, H);
        p.noLoop();
        render();
        bindControls();
    };

    // --- цвет пера, контрастный фону ---
    const brushColor = () => {
        const c = p.color(bgColor);
        const lum = 0.299 * p.red(c) + 0.587 * p.green(c) + 0.114 * p.blue(c);
        return lum > 140 ? p.color(0) : p.color(255);
    };

    const render = () => {
        p.clear();
        // карта со скруглением + рисунок, обрезанные по форме карты
        p.drawingContext.save();
        roundedPath(p.drawingContext, 0, 0, W, H, r);
        p.drawingContext.clip();
        p.noStroke();
        p.fill(bgColor);
        p.rect(0, 0, W, H);
        p.image(drawLayer, 0, 0);
        p.drawingContext.restore();

        drawDecorations();
    };

    const drawDecorations = () => {
        // chip / контактный модуль
        p.noStroke();
        p.fill(210);
        p.rect(W * 0.72, H * 0.42, W * 0.16, H * 0.13, W * 0.02);

        // mastercard-кружки
        const cy = H * 0.78;
        const cr = W * 0.085;
        p.fill(20, 5, 12, 235);
        p.circle(W * 0.74, cy, cr * 2);
        p.fill(20, 5, 12, 235);
        p.circle(W * 0.84, cy, cr * 2);

        // логотип
        if (logoImg) {
            const lw = W * 0.22;
            const lh = (logoImg.height / logoImg.width) * lw;
            p.image(logoImg, W * 0.08, H * 0.78, lw, lh);
        }
    };

    const roundedPath = (ctx, x, y, w, h, rad) => {
        ctx.beginPath();
        ctx.moveTo(x + rad, y);
        ctx.arcTo(x + w, y, x + w, y + h, rad);
        ctx.arcTo(x + w, y + h, x, y + h, rad);
        ctx.arcTo(x, y + h, x, y, rad);
        ctx.arcTo(x, y, x + w, y, rad);
        ctx.closePath();
    };

    // --- рисование ---
    const inside = () =>
        p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H;

    const stamp = () => {
        const size = W * 0.02;
        if (tool === "eraser") {
            drawLayer.erase();
            drawLayer.noStroke();
            drawLayer.ellipse(p.mouseX, p.mouseY, size * 1.6);
            if (drawing) {
                drawLayer.strokeWeight(size * 1.6);
                drawLayer.stroke(255);
                drawLayer.line(prevX, prevY, p.mouseX, p.mouseY);
            }
            drawLayer.noErase();
        } else {
            const c = brushColor();
            drawLayer.noStroke();
            drawLayer.fill(c);
            drawLayer.ellipse(p.mouseX, p.mouseY, size);
            if (drawing) {
                drawLayer.strokeWeight(size);
                drawLayer.strokeCap(p.ROUND);
                drawLayer.stroke(c);
                drawLayer.line(prevX, prevY, p.mouseX, p.mouseY);
            }
        }
        prevX = p.mouseX;
        prevY = p.mouseY;
    };

    const paint = () => {
        // не на карте — отдаём событие странице, чтобы работал скролл
        // (p5 вешает touch-обработчики на window, поэтому возврат false тут
        //  заблокировал бы скролл всей страницы на мобильных)
        if (!inside()) return true;
        stamp();
        drawing = true;
        render();
        return false; // на карте рисуем и блокируем скролл
    };

    p.mousePressed = () => {
        if (!inside()) return true;
        drawing = false;
        return paint();
    };
    p.mouseDragged = () => paint();
    p.mouseReleased = () => {
        drawing = false;
    };
    p.touchStarted = () => p.mousePressed();
    p.touchMoved = () => paint();
    p.touchEnded = () => {
        drawing = false;
    };

    // --- элементы управления (HTML) ---
    const bindControls = () => {
        const brushBtn = document.getElementById("tool-brush");
        const eraserBtn = document.getElementById("tool-eraser");
        const setTool = (t) => {
            tool = t;
            brushBtn.classList.toggle("active", t === "brush");
            eraserBtn.classList.toggle("active", t === "eraser");
        };
        brushBtn.addEventListener("click", () => setTool("brush"));
        eraserBtn.addEventListener("click", () => setTool("eraser"));

        document.querySelectorAll("#palette .swatch").forEach((el) => {
            el.style.backgroundColor = el.dataset.color;
            el.addEventListener("click", () => {
                bgColor = el.dataset.color;
                document
                    .querySelectorAll("#palette .swatch")
                    .forEach((s) => s.classList.remove("active"));
                el.classList.add("active");
                render();
            });
        });
    };

    // адаптив при ресайзе
    p.windowResized = () => {
        const holder = document.getElementById("p5-card");
        const nw = holder.clientWidth;
        if (nw === W) return;
        const old = drawLayer.get();
        W = nw;
        H = Math.round(W / 1.585);
        r = W * 0.06;
        p.resizeCanvas(W, H);
        drawLayer = p.createGraphics(W, H);
        drawLayer.image(old, 0, 0, W, H);
        render();
    };
};

new p5(cardDesigner);
