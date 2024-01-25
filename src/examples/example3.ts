import Scene from "../Scene.js";
import Vector3 from "../Vector3.js";
import RenderPlanner from "../RenderPlanner.js";
import {
    sphere0,
    sphere1,
    sphere2,
    sphere3,
    sphere4,
    light,
    sphere5,
} from "./elements.js";

const backgroundColor = new Vector3(2.0, 2.0, 2.0);
const resultDiv = document.getElementById("resultDiv")!;
const canvas = document.getElementById("resultCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const workerCount = 8;
const bufferPieces: {
    buffer: Uint8ClampedArray;
    start: number;
    height: number;
}[] = [];

const scene = new Scene();

let startTime = Date.now();
let frameCount = 0;

scene.add(sphere0);
scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
scene.add(sphere4);
scene.add(light);
scene.add(sphere5);

const renderPlanner = new RenderPlanner(
    workerCount,
    scene,
    backgroundColor,
    canvasWidth,
    canvasHeight
);

renderPlanner.onUpdateReceived = (sectionStart, sectionHeight, buf8) => {
    bufferPieces.push({
        buffer: buf8,
        start: sectionStart,
        height: sectionHeight,
    });

    if (!renderPlanner.isRunning()) {
        bufferPieces.forEach((piece) => {
            const imageData = ctx.getImageData(
                0,
                piece.start,
                canvasWidth,
                piece.height
            );
            imageData.data.set(piece.buffer);
            ctx.putImageData(imageData, 0, piece.start);
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

document.getElementById("startButtonId")!.addEventListener("click", () => {
    startRendering();
});
