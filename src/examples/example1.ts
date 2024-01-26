import { contex, canvas, rayTracer, startButton } from "./elements.js";

startButton.addEventListener("click", () => {
    const startTime = Date.now(); // save start time
    const buffer = rayTracer.render(canvas.width, canvas.height); // render
    const buf8 = new Uint8ClampedArray(buffer); // copy ray tracer buffer to canvas
    const imageData = contex.getImageData(0, 0, canvas.width, canvas.height);

    imageData.data.set(buf8);
    contex.putImageData(imageData, 0, 0);

    // display total duration
    const totalDuration = (Date.now() - startTime) / 1000;
    document.getElementById("resultDiv")!.innerHTML =
        "Render completed! " + totalDuration + " seconds!";
});
