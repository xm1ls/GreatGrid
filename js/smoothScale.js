const object = document.getElementById("object");
const scaleText = document.getElementById("scale");
const fpsText = document.getElementById("fps");

let timer, prevTimeStamp, fps,
    scrollDelay = 100, zoomTime = .25,
    scale = prevScale = 1,
    minScale = 1, maxScale = 14;

window.addEventListener("wheel", e => {
    clearTimeout(timer)

    scale += e.deltaY * -0.01;
    scale = Math.min(Math.max(minScale, scale), maxScale);

    scaleText.textContent = `${scale}`;

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
    if (index >= zoomValues.length) return;

    object.style.transform = `scale(${zoomValues[index]})`
    prevScale = zoomValues[index]

    requestAnimationFrame(t => zoom(zoomValues, ++index))
}


function getFPS(timeStamp) {
    fps = Math.round(1 / ((timeStamp - prevTimeStamp) / 1000));
    prevTimeStamp = timeStamp;

    fpsText.textContent = `${fps}`
    requestAnimationFrame(getFPS);
}

requestAnimationFrame(getFPS)