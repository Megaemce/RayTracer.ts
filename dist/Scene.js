/**
 * Represents a scene containing elements.
 */
export default class Scene {
    elements = [];
    /**
     * Adds an element to the scene.
     * @param {Sphere} element - The element to add.
     */
    add(element) {
        this.elements.push(element);
    }
    /**
     * Clears all elements from the scene.
     */
    clear() {
        this.elements = [];
    }
}
