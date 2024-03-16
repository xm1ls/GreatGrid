const object = document.getElementById("object");

let timer,
    scrollDelay = 100,
    scale = prevScale = startScale = 1;

window.addEventListener("wheel", e => {
    clearTimeout(timer)

    prevScale = scale;

    scale += e.deltaY * -0.01;
    scale = Math.max(1, scale);

    timer = setTimeout(() => {
        const zoomValues = interpolate(startScale, scale, { firstPoint: 1.35, secondPoint: 1, steps: 15 })

        requestAnimationFrame(t => zoom(zoomValues))
    }, scrollDelay)

})

function interpolate(startValue, endValue, { firstPoint = 0, secondPoint = 1, steps = 60 }) {
    let interpolationValues = [];

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
    startScale = zoomValues[index]

    requestAnimationFrame(t => zoom(zoomValues, ++index))
}