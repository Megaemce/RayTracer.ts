import Vector3 from "./Vector3.js";
/**
 * Represents material properties for objects in a scene.
 */
export default class Material {
    surfaceColor;
    reflection;
    transparency;
    emissionColor;
    /**
     * Creates an instance of Material.
     * @param {Vector3} surfaceColor - The color of the surface.
     * @param {number} reflection - The reflection coefficient.
     * @param {number} [transparency=0] - The transparency coefficient.
     * @param {Vector3} [emissionColor=new Vector3()] - The color of the emitted light.
     */
    constructor(surfaceColor, reflection, transparency = 0, emissionColor = new Vector3()) {
        this.surfaceColor = surfaceColor;
        this.reflection = reflection;
        this.transparency = transparency;
        this.emissionColor = emissionColor;
    }
}
