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

const scene = new Scene();
const canvas = document.getElementById("resultCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

scene.add(sphere0);
scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
scene.add(sphere4);
scene.add(light);
scene.add(sphere5);

const backgroundColor = new Vector3(2.0, 2.0, 2.0);
const rayTracer = new RayTracer(backgroundColor, scene); // create ray tracer

document.getElementById("startButtonId")!.addEventListener("click", () => {
    const startTime = Date.now(); // save start time
    const buffer = rayTracer.render(canvasWidth, canvasHeight); // render
    const buf8 = new Uint8ClampedArray(buffer); // copy ray tracer buffer to canvas
    const imageData = ctx!.getImageData(0, 0, canvasWidth, canvasHeight);

    imageData.data.set(buf8);
    ctx!.putImageData(imageData, 0, 0);

    // display total duration
    const totalDuration = (Date.now() - startTime) / 1000;
    document.getElementById("resultDiv")!.innerHTML =
        "Render completed! " + totalDuration + " seconds!";
});
