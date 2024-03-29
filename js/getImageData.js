const canvasWrapper = document.getElementById("canvasWrapper")
const canvas = document.getElementById("getImageDataCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: false });

const scaleText = document.getElementById("scale");
const fpsText = document.getElementById("fps");

const innerPointer = document.getElementById("innerPointer");
const audio = document.getElementById("audio");

audio.volume = .1

const img = new Image();
img.src = "res/inventory_transparent.png"

let startX, startY,
    panningX = panningY = 0,
    isPanning = isZooming = false,
    centerBorderX, centerBorderY,
    timer, prevTimeStamp, fps,
    scrollDelay = 100, zoomTime = .25,
    scale = prevScale = 1,
    minScale = 1, maxScale = 64,
    drawColor = "black";

const mouseButton = {
    'left': 0,
    'wheel': 1,
    'right': 2,
    'backward': 3,
    'forward': 4
}

img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    canvas.style.transform = `scale(${scale})`

    centerBorderX = canvas.width / 2;
    centerBorderY = canvas.height / 2;

    ctx.drawImage(img, 0, 0);
}

canvasWrapper.addEventListener("mousedown", e => {
    if (e.button === mouseButton.wheel) {
        startX = (e.clientX / scale);
        startY = (e.clientY / scale);

        isPanning = true;
    }
    if(e.button === mouseButton.backward && scale !== minScale) {
        scaleText.textContent = `${minScale}`

        const zoomValues = interpolate({
            startValue: scale,
            endValue: minScale,
            firstPoint: .1,
            secondPoint: 1,
            fps: fps,
            time: .4
        })

        requestAnimationFrame(t => zoom(zoomValues))
    }
    if(e.button === mouseButton.forward && scale !== maxScale) {
        scaleText.textContent = `${maxScale}`

        const zoomValues = interpolate({
            startValue: scale,
            endValue: maxScale,
            firstPoint: .1,
            secondPoint: 1,
            fps: fps,
            time: .4
        })

        requestAnimationFrame(t => zoom(zoomValues))
    }
})

let prevPointOnCanvas = pointOnCanvas = pointColor = null;

canvas.addEventListener("mousemove", e => {
    if (isPanning || isZooming) return;

    prevPointOnCanvas = prevPointOnCanvas === null ? getPointOnCanvas(e) : pointOnCanvas;
    pointOnCanvas = getPointOnCanvas(e);

    const color = ctx.getImageData(pointOnCanvas.x, pointOnCanvas.y, 1, 1)

    pointColor = pointColor === null ? {
        r: color.data[0],
        g: color.data[1],
        b: color.data[2],
        a: color.data[3]
    } : pointColor

    if (
        prevPointOnCanvas.x !== pointOnCanvas.x ||
        prevPointOnCanvas.y !== pointOnCanvas.y
    ) {
        ctx.fillStyle = `rgba(${pointColor.r}, ${pointColor.g}, ${pointColor.b}, ${pointColor.a})`;
        ctx.fillRect(prevPointOnCanvas.x, prevPointOnCanvas.y, 1, 1);

        pointColor = {
            r: color.data[0],
            g: color.data[1],
            b: color.data[2],
            a: color.data[3]
        }

        ctx.fillStyle = drawColor
        ctx.fillRect(pointOnCanvas.x, pointOnCanvas.y, 1, 1);

    }
})

window.addEventListener("mousemove", e => {
    innerPointer.style.left = e.clientX + "px";
    innerPointer.style.top = e.clientY + "px";
})

window.addEventListener("mousemove", e => {
    if (!isPanning) return;

    const { x, y } = getMousePosition(e);

    panningX += x - startX;
    panningY += y - startY;

    startX = x;
    startY = y;

    //check borders on X axis
    if (panningX <= -centerBorderX) {
        //left
        panningX = -centerBorderX
    } else if (panningX >= centerBorderX) {
        //right
        panningX = centerBorderX
    }

    //check borders on Y axis
    if (panningY <= -centerBorderY) {
        //top
        panningY = -centerBorderY
    } else if (panningY >= centerBorderY) {
        //bottom
        panningY = centerBorderY
    }

    canvas.style.transform = `
        scale(${scale}) 
        translateX(${panningX}px) 
        translateY(${panningY}px)
    `
})

canvasWrapper.addEventListener("wheel", e => {
    clearTimeout(timer)

    isZooming = true;

    scale += e.deltaY * -0.01;
    scale = Math.round(Math.min(Math.max(minScale, scale), maxScale));

    scaleText.textContent = `${scale}`

    timer = setTimeout(() => {
        if (prevScale == scale) return;

        const zoomValues = interpolate({
            startValue: prevScale,
            endValue: scale,
            firstPoint: 1.35,
            secondPoint: 1,
            fps: fps,
            time: zoomTime
        })

        requestAnimationFrame(t => zoom(zoomValues))
    }, scrollDelay)

})

window.addEventListener("mouseup", e => {
    isPanning = false;
})

canvas.addEventListener("click", e => {
    const { x, y } = getPointOnCanvas(e);

    ctx.fillStyle = drawColor;
    ctx.fillRect(x, y, 1, 1);

    const color = ctx.getImageData(pointOnCanvas.x, pointOnCanvas.y, 1, 1)

    pointColor = {
        r: color.data[0],
        g: color.data[1],
        b: color.data[2],
        a: color.data[3]
    }

    // audio.play()
})

window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
})

const getPointOnCanvas = (event) => {
    const canvasOffset = canvas.getBoundingClientRect()

    return {
        x: Math.ceil((event.clientX - canvasOffset.left) / scale) - 1,
        y: Math.ceil((event.clientY - canvasOffset.top) / scale) - 1
    }
}

const getMousePosition = (event) => {
    return {
        x: (event.clientX / scale),
        y: (event.clientY / scale)
    }
}

function interpolate({ startValue, endValue, firstPoint = 0, secondPoint = 1, fps = 60, time = 1 }) {
    let interpolationValues = [];

    const steps = fps * time;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const interpolation = (1 - t) ** 3 * 0 + 3 * (1 - t) ** 2 * t * firstPoint + 3 * (1 - t) * t ** 2 * secondPoint + t ** 3 * 1

        interpolationValues.push(
            startValue * (1 - interpolation) + endValue * interpolation
        )
    }

    return interpolationValues;
}

function zoom(zoomValues, index = 0) {
    if (index >= zoomValues.length) {
        isZooming = false;
        return;
    }

    prevScale = scale = zoomValues[index]

    canvas.style.transform = `
        scale(${scale})
        translateX(${panningX}px) 
        translateY(${panningY}px)
    `

    requestAnimationFrame(t => zoom(zoomValues, ++index))
}

function getFPS(timeStamp) {
    fps = Math.round(1 / ((timeStamp - prevTimeStamp) / 1000));
    prevTimeStamp = timeStamp;

    fpsText.textContent = `${fps}`

    requestAnimationFrame(getFPS);
}

requestAnimationFrame(getFPS)