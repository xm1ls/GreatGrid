// 'use strict'

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const bgCanvas = document.getElementById("background-canvas");
const bgCtx = bgCanvas.getContext("2d");

let img = new Image();
// img.src = "res/inventory_black.png"
img.src = "res/inventory.png"

let startX, startY,
    panningX, panningY,
    isMouseDown = false,
    isZooming = false,
    prevScale = scale = 1;

img.onload = () => {
    // canvas.width = bgCanvas.width = window.innerWidth;
    // canvas.height = bgCanvas.height = window.innerHeight;

    canvas.width = bgCanvas.width = 700;
    canvas.height = bgCanvas.height = 700;

    panningX = Math.ceil(canvas.width / 4);
    panningY = Math.ceil(canvas.height / 4);

    // panningX = 0;
    // panningY = 0;

    ctx.imageSmoothingEnabled = false;
    ctx.save();

    ctx.translate(panningX, panningY);

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    ctx.restore();

    drawGrid(bgCtx, canvas.width, canvas.height, 4);
}

canvas.addEventListener('mousedown', (e) => {
    ({ x: startX, y: startY } = getCanvasPosition(e, canvas));
    isMouseDown = true;
})

canvas.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;

    // panning(e, bgCanvas, bgCtx, () => {
    //     // bgCtx.save()
    //     // bgCtx.scale(scale, scale);
    //     // bgCtx.restore()
    //     drawGrid(bgCtx, canvas.width, canvas.height, 16)
    // });

    panning(e, canvas, ctx, () => {
        ctx.save()
        ctx.scale(scale, scale);
        ctx.drawImage(img, panningX / scale, panningY / scale);
        ctx.restore()
    });
})

canvas.addEventListener('wheel', (e) => {
    zoom(e);
})

canvas.addEventListener('mouseout', (e) => {
    if (isMouseDown)
        isMouseDown = true;
})

window.addEventListener('mouseup', (e) => {
    isMouseDown = false;
})

const zoom = (e) => {
    prevScale = scale;

    scale += e.deltaY * -0.01;
    scale = Math.round(Math.max(1, scale));
    // scale = Math.min(Math.max(1, scale), 4);
    console.log(scale)

    if (prevScale == scale) return;

    const { x, y } = getCanvasPosition(e, canvas);
    
    // const onImageX = Math.ceil((x - panningX) / prevScale);
    // const onImageY = Math.ceil((y - panningY) / prevScale);

    const onImageX = ((x - panningX) / prevScale);
    const onImageY = ((y - panningY) / prevScale);
    
    if (prevScale < scale) {
        panningX -= onImageX
        panningY -= onImageY
    }
    if (prevScale > scale) {
        panningX += onImageX
        panningY += onImageY
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save()

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.drawImage(img, -onImageX, -onImageY);
    ctx.restore()
}

const panning = (event, canvas, context, whatToDraw) => {
    const { x, y } = getCanvasPosition(event, canvas);

    panningX += x - startX;
    panningY += y - startY;

    startX = x;
    startY = y;

    context.clearRect(0, 0, canvas.width, canvas.height);
    whatToDraw();
}

const getCanvasPosition = (event, canvas) => {
    const canvasOffset = canvas.getBoundingClientRect()

    return {
        x: Math.ceil(event.clientX - canvasOffset.left),
        y: Math.ceil(event.clientY - canvasOffset.top)
    }
}

const drawGrid = (context, gridWidth, gridHeight, gridCells) => {
    const gridCellSize = gridWidth / gridCells;

    context.strokeStyle = "rgba(0, 0, 0, .1)";

    for (let x = Math.ceil(panningX % gridCellSize); x <= gridWidth; x += gridCellSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, gridHeight);
        context.stroke();
    }

    for (let y = Math.ceil(panningY % gridCellSize); y <= gridHeight; y += gridCellSize) {
        context.beginPath()
        context.moveTo(0, y);
        context.lineTo(gridWidth, y);
        context.stroke();
    }
}

window.onresize = (e) => {
    getCanvasPosition(e, canvas);
}

window.onscroll = (e) => {
    getCanvasPosition(e, canvas);
}