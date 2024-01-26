import { sphere1, sphere2, sphere3, sphere4, light, scene, backgroundColor, canvas, contex, resultDiv, rayTracer, options, start, } from "./elements.js";
import Vector3 from "../Vector3.js";
import RenderPlanner from "../RenderPlanner.js";
const bufferPieces = [];
const workerCount = 8;
let startTime = Date.now();
let lastUpdateTime = 0;
let totalFrameCount = 0;
let isAnimationRunning = false;
let frameCount = 0;
let animationId;
let previousValue = ""; // Variable to store the previous value of select
let renderPlanner;
start.onclick = () => example1();
options.onchange = (event) => {
    // reset variables
    startTime = Date.now();
    lastUpdateTime = 0;
    totalFrameCount = 0;
    isAnimationRunning = false;
    frameCount = 0;
    contex.clearRect(0, 0, canvas.width, canvas.height);
    previousValue === "option3" && renderPlanner.stop();
    previousValue === "option2" && cancelAnimationFrame(animationId);
    const { value } = event.target; // Destructuring to get the selected value
    // Update onclick event handler based on selected option
    start.onclick = () => {
        if (!isAnimationRunning)
            start.value = "Stop rendering";
        else
            start.value = "Start rendering";
        value === "option1" && example1();
        value === "option2" && example2();
        value === "option3" && example3();
        previousValue = value;
    };
};
function render() {
    const buffer = rayTracer.render(canvas.width, canvas.height);
    const buf8 = new Uint8ClampedArray(buffer); // copy ray tracer buffer to canvas
    const imageData = contex.getImageData(0, 0, canvas.width, canvas.height);
    imageData.data.set(buf8);
    contex.putImageData(imageData, 0, 0);
}
function animate() {
    // Update positions only if enough time has passed
    const currentTime = Date.now();
    const updateInterval = 50; // Update the scene at 20 FPS (50ms per update)
    animationId = requestAnimationFrame(animate); // Use requestAnimationFrame for the animation loop
    if (currentTime - lastUpdateTime > updateInterval) {
        light.center = new Vector3(10 * Math.sin(currentTime / 2000), 10, -30);
        sphere1.center = new Vector3(0, 5 * Math.sin(currentTime / 1000), -20);
        sphere2.center = new Vector3(5, -1 * Math.sin(currentTime / 500), -15);
        sphere3.center = new Vector3(5, 6 * Math.cos(currentTime / 1000), -25);
        sphere4.center = new Vector3(-5.5, 3 * Math.cos(currentTime / 1000), -15);
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
export const example1 = () => {
    startTime = Date.now();
    render();
    // display total duration
    const totalDuration = (Date.now() - startTime) / 1000;
    resultDiv.innerHTML = `Completed in ${totalDuration} seconds!`;
};
export const example2 = () => {
    if (!isAnimationRunning) {
        isAnimationRunning = true;
        animate();
    }
    else {
        cancelAnimationFrame(animationId);
        isAnimationRunning = false;
    }
};
export const example3 = () => {
    if (!isAnimationRunning) {
        isAnimationRunning = true;
        renderPlanner = new RenderPlanner(workerCount, scene, backgroundColor, canvas.width, canvas.height);
        renderPlanner.onUpdateReceived = (sectionStart, sectionHeight, buf8) => {
            bufferPieces.push({
                buffer: buf8,
                start: sectionStart,
                height: sectionHeight,
            });
            if (!renderPlanner.isRunning()) {
                bufferPieces.forEach((piece) => {
                    const imageData = contex.getImageData(0, piece.start, canvas.width, piece.height);
                    imageData.data.set(piece.buffer);
                    contex.putImageData(imageData, 0, piece.start);
                });
                bufferPieces.length = 0;
                setTimeout(() => {
                    light.center = new Vector3(10 * Math.sin(Date.now() / 2000), 10, -30);
                    sphere1.center = new Vector3(0, 5 * Math.sin(Date.now() / 1000), -20);
                    sphere2.center = new Vector3(5, -1 * Math.sin(Date.now() / 500), -15);
                    sphere3.center = new Vector3(5, 6 * Math.cos(Date.now() / 1000), -25);
                    sphere4.center = new Vector3(-5.5, 3 * Math.cos(Date.now() / 1000), -15);
                    renderPlanner.updateScene();
                    renderPlanner.start();
                    frameCount++;
                    const currentTime = Date.now();
                    if (currentTime - startTime > 1000) {
                        resultDiv.innerHTML = `FPS = ${frameCount}. Worker count: ${workerCount} `;
                        startTime = currentTime;
                        frameCount = 0;
                    }
                }, 0);
            }
        };
        renderPlanner.initialize();
        renderPlanner.start();
    }
    else {
        renderPlanner.stop();
        isAnimationRunning = false;
    }
};
