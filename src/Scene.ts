import Sphere from "./Sphere.js";

/**
 * Represents a scene containing elements.
 */
export default class Scene {
    public elements: Sphere[] = [];

    /**
     * Adds an element to the scene.
     * @param {Sphere} element - The element to add.
     */
    add(element: Sphere): void {
        this.elements.push(element);
    }

    /**
     * Clears all elements from the scene.
     */
    clear(): void {
        this.elements = [];
    }
}
