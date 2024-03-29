export default class CanvasImageInputHandler {
    constructor(canvas, image) {
        this.canvas = canvas;
        this.image = image;

        this.canvas.addEventListener('mousedown', (event) => {
            this.image.startPosition = {
                x: Math.ceil(event.clientX - this.canvas.getBoundingClientRect().left),
                y: Math.ceil(event.clientY - this.canvas.getBoundingClientRect().top)
            };

            this.image.isMouseDown = true;
        })

        window.addEventListener('mousemove', (event) => {
            if (!this.image.isMouseDown) return;

            this.image.desirePosition = {
                x: Math.ceil(event.clientX - this.canvas.getBoundingClientRect().left),
                y: Math.ceil(event.clientY - this.canvas.getBoundingClientRect().top)
            }

            this.image.isMouseMove = true;
        })

        this.canvas.addEventListener('mouseout', () => {
            if (this.image.isMouseDown)
                this.image.isMouseDown = true;
        })

        this.canvas.addEventListener('mouseup', () => {
            this.image.isMouseDown = false;
            this.image.isMouseMove = false;
        })

        window.addEventListener('mouseup', () => {
            this.image.isMouseDown = false;
            this.image.isMouseMove = false;

        })

        canvas.addEventListener('wheel', (event) => {
            this.image.prevScale = this.image.scale;

            this.image.scale += event.deltaY * -0.01;
            this.image.scale = Math.max(1, this.image.scale);
            // scale = Math.min(Math.max(1, scale), 4);

            if (this.image.prevScale == this.image.scale) return;
            
            // this.image.zoomPosition = {
            //     x: Math.ceil(event.clientX - this.canvas.getBoundingClientRect().left),
            //     y: Math.ceil(event.clientY - this.canvas.getBoundingClientRect().top)
            // }

            // this.image.zoom()
            // this.image.isZooming = true;
        })
    }

}