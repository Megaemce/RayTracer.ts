import Vector3 from "../Vector3.js";
import {
    sphere1,
    sphere2,
    sphere3,
    sphere4,
    light,
    rayTracer,
    canvas,
    contex,
    resultDiv,
    startButton,
} from "./elements.js";

// save start time
let startTime = Date.now();
let lastUpdateTime = 0;
let totalFrameCount = 0;
let isAnimationRunning = false;

function render() {
    // render
    const buffer = rayTracer.render(canvas.width, canvas.height);

    // copy ray tracer buffer to canvas
    const buf8 = new Uint8ClampedArray(buffer);

    const imageData = contex.getImageData(0, 0, canvas.width, canvas.height);
    imageData.data.set(buf8);
    contex.putImageData(imageData, 0, 0);

    // display total duration
    totalFrameCount++;
    const currentTime = Date.now();
    if (currentTime - startTime > 1000) {
        resultDiv.innerHTML = "FPS = " + totalFrameCount;
        totalFrameCount = 0;
        startTime = currentTime;
    }
}

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

startButton.addEventListener("click", () => {
    if (isAnimationRunning) {
        return;
    }
    isAnimationRunning = true;
    animate();
});
