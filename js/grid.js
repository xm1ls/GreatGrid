const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const secondCanvas = document.getElementById("second-canvas")
const sCtx = secondCanvas.getContext("2d")
sCtx.imageSmoothingEnabled = false;

const thirdCanvas = document.getElementById("third-canvas")
const tCtx = thirdCanvas.getContext("2d")
tCtx.imageSmoothingEnabled = false;


let itemSize = 20
let resolution = 16

let canvasSize = canvas.width = canvas.height = itemSize * resolution

ctx.fillStyle = "rgba(123, 0, 123, 0.2)"

const drawGrid = (canvasSize, itemSize) => {
    for (let y = 0; y <= canvasSize; y += itemSize) {
        let xOffset = y % (itemSize * 2) == 0 ? itemSize : 0

        for (let x = xOffset; x <= canvasSize; x += itemSize * 2) {
            ctx.fillRect(x, y, itemSize, itemSize)
        }
    }
}

const onDraw = (e) => {
    const canvasOffset = canvas.getBoundingClientRect()

    let x = e.clientX - canvasOffset.left;
    let y = e.clientY - canvasOffset.top;

    x = Math.ceil(x / itemSize) * itemSize - itemSize
    y = Math.ceil(y / itemSize) * itemSize - itemSize

    ctx.fillStyle = "rgba(123, 123, 123, 1)"
    ctx.fillRect(x, y, itemSize, itemSize)
}

const zoom = (context, x, y, zoomLevel = 2) => {
    context.clearRect(0, 0, secondCanvas.width, secondCanvas.height);

    context.drawImage(
        canvas,
        Math.ceil(x), Math.ceil(y),
        canvasSize, canvasSize,
        0, 0,
        canvasSize * zoomLevel, canvasSize * zoomLevel
    );
};

canvas.addEventListener("mousemove", (e) => {
    const canvasOffset = canvas.getBoundingClientRect()

    let x = e.clientX - canvasOffset.left;
    let y = e.clientY - canvasOffset.top;

    // x = Math.ceil(x / itemSize) * itemSize - itemSize
    // y = Math.ceil(y / itemSize) * itemSize - itemSize

    zoom(sCtx, x, y, 2);
});

canvas.addEventListener('click', (e) => onDraw(e))

let img = document.getElementById("source");
let thirdCanvasSize = thirdCanvas.width = thirdCanvas.height = img.width
console.log(img.width)

tCtx.drawImage(img, 0, 0, thirdCanvasSize, thirdCanvasSize)

drawGrid(canvasSize, itemSize)

function trimCanvas(c) {
    var ctx = c.getContext('2d'),
        copy = document.createElement('canvas').getContext('2d'),
        pixels = ctx.getImageData(0, 0, c.width, c.height),
        l = pixels.data.length,
        i,
        bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
        },
        x, y;

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~((i / 4) / c.width);

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    // Calculate the height and width of the content
    var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);

    // Return trimmed canvas
    return copy.canvas;
}