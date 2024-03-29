import RayTracer from "./RayTracer.js";
import Scene from "./Scene.js";
import Sphere from "./Sphere.js";
import Vector3 from "./Vector3.js";
let messageHandler;
onmessage = function (e) {
    if (messageHandler) {
        messageHandler(e);
    }
};
const scene = new Scene();
const backgroundColor = new Vector3(0, 0, 0);
let rendererWidth = 0;
let rendererHeight = 0;
let startY = 0;
let scanHeight = 0;
/**
 * Handles messages sent to the renderer.
 * @param {MessageEvent} e - The message event containing the data.
 */
function rendererMessageHandler(e) {
    const action = e.data.action;
    const data = e.data.data;
    if (action === "elements") {
        scene.clear();
        data.forEach((element) => {
            scene.add(Sphere.deserialize(element));
        });
    }
    else if (action === "backgroundColor") {
        backgroundColor.x = data[0];
        backgroundColor.y = data[1];
        backgroundColor.z = data[2];
    }
    else if (action === "dimensions") {
        rendererWidth = data[0];
        rendererHeight = data[1];
        startY = data[2];
        scanHeight = data[3];
    }
    else if (action === "render") {
        startRendering();
    }
}
messageHandler = rendererMessageHandler;
/**
 * Starts the rendering process.
 */
function startRendering() {
    const rayTracer = new RayTracer(backgroundColor, scene);
    const buffer = rayTracer.render(rendererWidth, rendererHeight, startY, scanHeight);
    // Send result buffer
    const buf8 = new Uint8ClampedArray(buffer);
    postMessage({
        action: "result",
        data: buf8,
    });
}
