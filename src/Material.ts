import Vector3 from "./Vector3.js";

/**
 * Represents material properties for objects in a scene.
 */
export default class Material {
    /**
     * Creates an instance of Material.
     * @param {Vector3} surfaceColor - The color of the surface.
     * @param {number} reflection - The reflection coefficient.
     * @param {number} [transparency=0] - The transparency coefficient.
     * @param {Vector3} [emissionColor=new Vector3()] - The color of the emitted light.
     */
    constructor(
        public surfaceColor: Vector3,
        public reflection: number,
        public transparency: number = 0,
        public emissionColor: Vector3 = new Vector3()
    ) {}
}
