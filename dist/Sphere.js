import Vector3 from "./Vector3.js";
import Material from "./Material.js";
/**
 * Represents a sphere in 3D space.
 */
export default class Sphere {
    center;
    radius;
    material;
    radius2;
    /**
     * Creates an instance of Sphere.
     * @param {Vector3} center - The center of the sphere.
     * @param {number} radius - The radius of the sphere.
     * @param {Material} material - The material of the sphere.
     */
    constructor(center, radius, material) {
        this.center = center;
        this.radius = radius;
        this.material = material;
        this.radius2 = radius * radius;
    }
    /**
     * Checks if a ray intersects with the sphere.
     * @param {Vector3} rayOrigin - The origin of the ray.
     * @param {Vector3} rayDir - The direction of the ray.
     * @param {{ t0: number, t1: number }} out - Output object to store intersection details.
     * @returns {boolean} True if the ray intersects with the sphere, false otherwise.
     */
    intersect(rayOrigin, rayDir, out) {
        const l = this.center.clone().subtract(rayOrigin);
        const tca = l.dotProduct(rayDir);
        if (tca < 0) {
            return false;
        }
        const d2 = l.dotProduct(l) - tca * tca;
        if (d2 > this.radius2) {
            return false;
        }
        const thc = Math.sqrt(this.radius2 - d2);
        out.t0 = tca - thc;
        out.t1 = tca + thc;
        return true;
    }
    /**
     * Gets the center of the sphere.
     * @returns {Vector3} The center of the sphere.
     */
    getCenter() {
        return this.center;
    }
    /**
     * Gets the radius of the sphere.
     * @returns {number} The radius of the sphere.
     */
    getRadius() {
        return this.radius;
    }
    /**
     * Gets the material of the sphere.
     * @returns {Material} The material of the sphere.
     */
    getMaterial() {
        return this.material;
    }
    /**
     * Gets the normal vector at a given point on the sphere's surface.
     * @param {Vector3} point - The point on the sphere's surface.
     * @returns {Vector3} The normal vector at the given point.
     */
    getNormal(point) {
        const normal = point.clone().subtract(this.getCenter());
        normal.normalize();
        return normal;
    }
    /**
     * Serializes the sphere to a plain object.
     * @returns {object} The serialized representation of the sphere.
     */
    serialize() {
        const sc = this.material.surfaceColor;
        const ec = this.material.emissionColor;
        const transparency = this.material.transparency;
        const reflection = this.material.reflection;
        return {
            center: [this.center.x, this.center.y, this.center.z],
            radius: this.radius,
            material: {
                surfaceColor: [sc.x, sc.y, sc.z],
                emissionColor: [ec.x, ec.y, ec.z],
                transparency: transparency,
                reflection: reflection,
            },
        };
    }
    /**
     * Deserializes a plain object into a Sphere instance.
     * @param {object} data - The serialized representation of the sphere.
     * @returns {Sphere} The deserialized Sphere instance.
     */
    static deserialize(data) {
        const center = data.center;
        const radius = data.radius;
        const surfaceColor = data.material.surfaceColor;
        const emissionColor = data.material.emissionColor;
        const transparency = data.material.transparency;
        const reflection = data.material.reflection;
        return new Sphere(new Vector3(center[0], center[1], center[2]), radius, new Material(new Vector3(surfaceColor[0], surfaceColor[1], surfaceColor[2]), reflection, transparency, new Vector3(emissionColor[0], emissionColor[1], emissionColor[2])));
    }
}
