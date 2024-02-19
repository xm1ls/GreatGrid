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