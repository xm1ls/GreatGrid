import CanvasImageInputHandler from "./canvasImageInputHandler.js";

export default class CanvasImage {
    constructor(canvas, context, image, position) {
        this.canvas = canvas;
        this.context = context

        this.image = image;
        this.width = image.width;
        this.height = image.height;

        this.isMouseDown = false;
        this.isMouseMove = false;
        this.isZooming = false;

        this.scale = 1;
        this.prevScale = 1;

        this.position = {
            x: position.x,
            y: position.y
        };

        this.offset = { x: 0, y: 0 };

        this.startPosition = { x: 0, y: 0 };

        this.desirePosition = { x: 0, y: 0 }

        this.zoomPosition = { x: 0, y: 0 }

        new CanvasImageInputHandler(this.canvas, this)
    }

    zoom() {
        const onImageX = (this.zoomPosition.x - this.offset.x) / this.prevScale;
        const onImageY = (this.zoomPosition.y - this.offset.y) / this.prevScale;

        if (this.prevScale < this.scale) {
            this.offset.x -= onImageX
            this.offset.y -= onImageY
        }
        if (this.prevScale > this.scale) {
            this.offset.x += onImageX
            this.offset.y += onImageY
        }

        this.position = {
            x: onImageX,
            y: onImageY
        }
    }

    move() {
        this.position = {
            x: (this.position.x + (this.desirePosition.x - this.startPosition.x)),
            y: (this.position.y + (this.desirePosition.y - this.startPosition.y))
        }

        this.startPosition = {
            x: this.desirePosition.x,
            y: this.desirePosition.y
        }

        // if(this.image.width * this.scale < this.canvas.width)
        //     this.collision()

        this.offset = this.position
    }

    collision() {
        if (this.position.x < 0)
            this.position.x = 0;

        if (this.position.y < 0)
            this.position.y = 0;

        if (this.position.x > this.canvas.width - this.image.width)
            this.position.x = this.canvas.width - this.image.width;

        if (this.position.y > this.canvas.height - this.image.height)
            this.position.y = this.canvas.height - this.image.height;
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.image.width * this.scale,
            this.image.height * this.scale
        )
    }

    update() {
        if (!this.isMouseMove) return;
        this.move()

        // if (!this.isZooming) return;
        // this.zoom()
    }
}