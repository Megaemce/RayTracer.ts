import Vector3 from "./Vector3.js";
const BIAS = 1e-4;
/**
 * Performs ray tracing to render a scene.
 */
export default class RayTracer {
    backgroundColor;
    scene;
    /**
     * Creates an instance of RayTracer.
     * @param {Vector3} backgroundColor - The background color.
     * @param {Scene} scene - The scene to render.
     */
    constructor(backgroundColor, scene) {
        this.backgroundColor = backgroundColor;
        this.scene = scene;
        this.backgroundColor = backgroundColor;
        this.scene = scene;
    }
    /**
     * Traces a ray and calculates the color of the pixel.
     * @param {Vector3} rayOrigin - The origin of the ray.
     * @param {Vector3} rayDir - The direction of the ray.
     * @returns {Vector3} The color of the pixel.
     */
    trace(rayOrigin, rayDir) {
        const elements = this.scene.elements;
        const hitInfo = { t0: Infinity, t1: Infinity };
        let tnear = Infinity;
        let element = null;
        for (let i = 0; i < elements.length; i++) {
            hitInfo.t0 = Infinity;
            hitInfo.t1 = Infinity;
            const el = elements[i];
            if (el.intersect(rayOrigin, rayDir, hitInfo)) {
                if (hitInfo.t0 < 0) {
                    hitInfo.t0 = hitInfo.t1;
                }
                if (hitInfo.t0 < tnear) {
                    tnear = hitInfo.t0;
                    element = el;
                }
            }
        }
        if (element === null) {
            return this.backgroundColor;
        }
        let surfaceColor = new Vector3(0, 0, 0);
        const intersectionPoint = rayOrigin
            .clone()
            .add(rayDir.clone().multiply(tnear));
        let intersectionNormal = element.getNormal(intersectionPoint);
        let inside = false;
        if (rayDir.dotProduct(intersectionNormal) > 0) {
            intersectionNormal.revert();
            inside = true;
        }
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const lightMat = el.material;
            if (lightMat.emissionColor.x > 0 ||
                lightMat.emissionColor.y > 0 ||
                lightMat.emissionColor.z > 0) {
                const transmission = new Vector3(1, 1, 1);
                const lightDirection = el.center
                    .clone()
                    .subtract(intersectionPoint);
                lightDirection.normalize();
                const lightHitInfo = { t0: Infinity, t1: Infinity };
                for (let j = 0; j < elements.length; j++) {
                    if (i !== j) {
                        if (elements[j].intersect(intersectionPoint
                            .clone()
                            .add(intersectionNormal
                            .clone()
                            .multiply(BIAS)), lightDirection, lightHitInfo)) {
                            transmission.x = 0;
                            transmission.y = 0;
                            transmission.z = 0;
                            break;
                        }
                    }
                }
                const lightRatio = Math.max(0, intersectionNormal.dotProduct(lightDirection));
                surfaceColor.add(element.material.surfaceColor
                    .clone()
                    .product(transmission)
                    .product(lightMat.emissionColor.clone().multiply(lightRatio)));
            }
        }
        surfaceColor.add(element.material.emissionColor);
        return surfaceColor;
    }
    /**
     * Renders the scene to produce an image buffer.
     * @param {number} width - The width of the image.
     * @param {number} height - The height of the image.
     * @param {number} startY - The starting Y coordinate for rendering.
     * @param {number} scanHeight - The height of the scanline to render.
     * @returns {ArrayBuffer} The image buffer.
     */
    render(width, height, startY, scanHeight) {
        if (startY === undefined) {
            startY = 0;
        }
        if (scanHeight === undefined) {
            scanHeight = height;
        }
        const colorDepth = 4; // create buffer, 4 bytes for 1 pixel, r, g, b, and alfa
        const buffer = new ArrayBuffer(width * scanHeight * colorDepth);
        const bufferView = new Uint32Array(buffer);
        const invWidth = 1 / width;
        const invHeight = 1 / height;
        const fieldOfView = 30;
        const aspectRatio = width / height;
        const angle = Math.tan((Math.PI * 0.5 * fieldOfView) / 180);
        const rayOrigin = new Vector3(0, 0, 0);
        let pixelIndex = 0;
        for (let y = startY; y < startY + scanHeight; ++y) {
            for (let x = 0; x < width; ++x, ++pixelIndex) {
                const xx = (2 * ((x + 0.5) * invWidth) - 1) * angle * aspectRatio;
                const yy = (1 - 2 * ((y + 0.5) * invHeight)) * angle;
                const rayDir = new Vector3(xx, yy, -1);
                rayDir.normalize();
                const pixelColor = this.trace(rayOrigin, rayDir);
                pixelColor.x = Math.min(1, pixelColor.x);
                pixelColor.y = Math.min(1, pixelColor.y);
                pixelColor.z = Math.min(1, pixelColor.z);
                const r = Math.round(pixelColor.x * 255);
                const g = Math.round(pixelColor.y * 255);
                const b = Math.round(pixelColor.z * 255);
                bufferView[pixelIndex] =
                    (255 << 24) | // alpha
                        (b << 16) | // blue
                        (g << 8) | // green
                        r; // red
            }
        }
        return buffer;
    }
}
