import Vector3 from "../Vector3.js";
import RenderPlanner from "../RenderPlanner.js";
import {
    sphere1,
    sphere2,
    sphere3,
    sphere4,
    light,
    scene,
    backgroundColor,
    canvas,
    contex,
    resultDiv,
    startButton,
} from "./elements.js";

const workerCount = 8;
const bufferPieces: {
    buffer: Uint8ClampedArray;
    start: number;
    height: number;
}[] = [];

let startTime = Date.now();
let frameCount = 0;

const renderPlanner = new RenderPlanner(
    workerCount,
    scene,
    backgroundColor,
    canvas.width,
    canvas.height
);

renderPlanner.onUpdateReceived = (sectionStart, sectionHeight, buf8) => {
    bufferPieces.push({
        buffer: buf8,
        start: sectionStart,
        height: sectionHeight,
    });

    if (!renderPlanner.isRunning()) {
        bufferPieces.forEach((piece) => {
            const imageData = contex.getImageData(
                0,
                piece.start,
                canvas.width,
                piece.height
            );
            imageData.data.set(piece.buffer);
            contex.putImageData(imageData, 0, piece.start);
        });

        bufferPieces.length = 0;

        setTimeout(() => {
            light.center = new Vector3(
                10 * Math.sin(Date.now() / 2000),
                10,
                -30
            );
            sphere1.center = new Vector3(
                0,
                5 * Math.sin(Date.now() / 1000),
                -20
            );
            sphere2.center = new Vector3(
                5,
                -1 * Math.sin(Date.now() / 500),
                -15
            );
            sphere3.center = new Vector3(
                5,
                6 * Math.cos(Date.now() / 1000),
                -25
            );
            sphere4.center = new Vector3(
                -5.5,
                3 * Math.cos(Date.now() / 1000),
                -15
            );

            renderPlanner.updateScene();
            renderPlanner.start();

            frameCount++;
            const currentTime = Date.now();
            if (currentTime - startTime > 1000) {
                resultDiv.innerHTML = `Worker Count: ${workerCount} FPS = ${frameCount}`;
                startTime = currentTime;
                frameCount = 0;
            }
        }, 0);
    }
};

function startRendering() {
    renderPlanner.initialize();
    renderPlanner.start();
}

startButton.addEventListener("click", () => {
    startRendering();
});
