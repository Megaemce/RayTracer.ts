import Sphere from "./Sphere.js";

/**
 * Represents a scene containing elements.
 */
export default class Scene {
    public elements: Sphere[] = [];

    /**
     * Adds an element to the scene.
     * @param {*} element - The element to add.
     */
    add(element: Sphere): void {
        this.elements.push(element);
    }

    /**
     * Gets all elements in the scene.
     * @returns {Sphere[]} An array containing all elements in the scene.
     */
    getElements(): Sphere[] {
        return this.elements;
    }

    /**
     * Clears all elements from the scene.
     */
    clear(): void {
        this.elements = [];
    }
}
