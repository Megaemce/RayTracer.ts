import RayTracer from "../RayTracer.js";
import Scene from "../Scene.js";
import Vector3 from "../Vector3.js";
import {
    sphere0,
    sphere1,
    sphere2,
    sphere3,
    sphere4,
    light,
    sphere5,
} from "./elements.js";

// create scene
const scene = new Scene();

scene.add(sphere0);
scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
scene.add(sphere4);
scene.add(light);
scene.add(sphere5);

const backgroundColor = new Vector3(2.0, 2.0, 2.0);

// create ray tracer
const rayTracer = new RayTracer(backgroundColor, scene);

// get canvas
const canvas = document.getElementById("resultCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// save start time
let startTime = Date.now();
let lastUpdateTime = 0;
let totalFrameCount = 0;
const resultDiv = document.getElementById("resultDiv")!;

function render() {
    // render
    const buffer = rayTracer.render(canvasWidth, canvasHeight);

    // copy ray tracer buffer to canvas
    const buf8 = new Uint8ClampedArray(buffer);

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);

    // display total duration
    totalFrameCount++;
    const currentTime = Date.now();
    if (currentTime - startTime > 1000) {
        resultDiv.innerHTML = "FPS = " + totalFrameCount;
        totalFrameCount = 0;
        startTime = currentTime;
    }
}

let isAnimationRunning = false;
document.getElementById("startButtonId")!.addEventListener("click", () => {
    if (isAnimationRunning) {
        return;
    }
    isAnimationRunning = true;
    animate();
});

function animate() {
    requestAnimationFrame(animate); // Use requestAnimationFrame for the animation loop

    // Update positions only if enough time has passed
    const currentTime = Date.now();
    const updateInterval = 50; // Update the scene at 20 FPS (50ms per update)
    if (currentTime - lastUpdateTime > updateInterval) {
        light.center = new Vector3(10 * Math.sin(currentTime / 2000), 10, -30);
        sphere1.center = new Vector3(0, 5 * Math.sin(currentTime / 1000), -20);
        sphere2.center = new Vector3(5, -1 * Math.sin(currentTime / 500), -15);
        sphere3.center = new Vector3(5, 6 * Math.cos(currentTime / 1000), -25);
        sphere4.center = new Vector3(
            -5.5,
            3 * Math.cos(currentTime / 1000),
            -15
        );

        lastUpdateTime = currentTime;
    }

    // Render the frame
    render();

    // Display total duration and calculate FPS
    totalFrameCount++;
    if (currentTime - startTime > 1000) {
        resultDiv.innerHTML = "FPS = " + totalFrameCount;
        totalFrameCount = 0;
        startTime = currentTime;
    }
}
