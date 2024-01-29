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
     * Gets the normal vector at a given point on the sphere's surface.
     * @param {Vector3} point - The point on the sphere's surface.
     * @returns {Vector3} The normal vector at the given point.
     */
    getNormal(point) {
        const normal = point.clone().subtract(this.center).normalize();
        return normal;
    }
    /**
     * Serializes the sphere to a plain object.
     * @returns {object} The serialized representation of the sphere.
     */
    serialize() {
        const surfaceColor = this.material.surfaceColor;
        const emissionColor = this.material.emissionColor;
        const transparency = this.material.transparency;
        const reflection = this.material.reflection;
        return {
            center: [this.center.x, this.center.y, this.center.z],
            radius: this.radius,
            material: {
                surfaceColor: [surfaceColor.x, surfaceColor.y, surfaceColor.z],
                emissionColor: [
                    emissionColor.x,
                    emissionColor.y,
                    emissionColor.z,
                ],
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
        const [centerX, centerY, centerZ] = data.center;
        const radius = data.radius;
        const [surfaceColorX, surfaceColorY, surfaceColorZ] = data.material.surfaceColor;
        const transparency = data.material.transparency;
        const reflection = data.material.reflection;
        const [emissionColorY, emissionColorX, emissionColorZ] = data.material.emissionColor;
        return new Sphere(new Vector3(centerX, centerY, centerZ), radius, new Material(new Vector3(surfaceColorX, surfaceColorY, surfaceColorZ), reflection, transparency, new Vector3(emissionColorX, emissionColorY, emissionColorZ)));
    }
}
