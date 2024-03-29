'use strict'

import CanvasImage from "./canvasImage.js";

let canvas, bgCanvas, fpsCanvas,
    ctx, bgCtx, fpsCtx,
    image, testImage

let startX, startY,
    panningX, panningY,
    isMouseDown = false,
    isZooming = false,
    prevScale = 1,
    scale = 1;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d", { willReadFrequently: true });

    bgCanvas = document.getElementById("background-canvas");
    bgCtx = bgCanvas.getContext("2d");
    
    fpsCanvas = document.getElementById("fps-canvas");
    fpsCtx = bgCanvas.getContext("2d");

    image = new Image()
    image.src = '/res/inventory_transparent.png'
    // image.src = '/res/inventory.png'

    image.onload = () => {
        canvas.width = bgCanvas.width = fpsCanvas.width = 700;
        canvas.height = bgCanvas.height = fpsCanvas.height = 700;

        // canvas.width = bgCanvas.width = window.innerWidth;
        // canvas.height = bgCanvas.height = window.innerHeight;

        panningX = Math.ceil(canvas.width / 4);
        panningY = Math.ceil(canvas.height / 4);

        // panningX = 0;
        // panningY = 0;

        ctx.imageSmoothingEnabled = false;
        ctx.save();

        ctx.translate(panningX, panningY);

        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);

        ctx.restore();

        drawGrid(bgCtx, bgCanvas.width, bgCanvas.height, 4);


    }

    testImage = new CanvasImage(canvas, ctx, image, { x: 100, y: 100 })

    window.requestAnimationFrame(gameLoop);
}

window.onload = init;

function inputHandler() {
    canvas.addEventListener('mousedown', (e) => {
        ({ x: startX, y: startY } = getCanvasPosition(e, canvas));
        // testImage.setStartPosition(getCanvasPosition(e, canvas));
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
            ctx.drawImage(image, panningX / scale, panningY / scale);
            ctx.restore()
        });
    })

    canvas.addEventListener('mouseout', (e) => {
        if (isMouseDown)
            isMouseDown = true;
    })

    canvas.addEventListener('wheel', (e) => {
        zoom(e, canvas, ctx, image);
    })

    window.addEventListener('mouseup', (e) => {
        isMouseDown = false;
    })
}

let secondsPassed;
let oldTimeStamp;
let fps;

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    // Draw number to the screen
    fpsCtx.clearRect(1, 1, 40, 40);
    fpsCtx.font = '14px Monospace';
    fpsCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    fpsCtx.fillText(fps, 10, 20);

    // Perform the drawing operation
    testImage.update();
    testImage.draw();

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

const getCanvasPosition = (event, canvas) => {
    const canvasOffset = canvas.getBoundingClientRect()

    return {
        x: Math.ceil(event.clientX - canvasOffset.left),
        y: Math.ceil(event.clientY - canvasOffset.top)
    }
}

const zoom = (event, canvas, context, image) => {
    prevScale = scale;

    scale += event.deltaY * -0.01;
    scale = Math.max(1, scale);
    // scale = Math.min(Math.max(1, scale), 4);

    if (prevScale == scale) return;

    const { x, y } = getCanvasPosition(event, canvas);

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

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save()

    context.translate(x, y);
    context.scale(scale, scale);

    context.drawImage(image, -onImageX, -onImageY);
    context.restore()
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

