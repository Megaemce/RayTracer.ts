/**
 * Represents a 3-dimensional vector.
 */
class Vector3 {
    x: number;
    y: number;
    z: number;
    /**
     * Creates an instance of Vector3.
     * @param {number} [x=0] - The x component of the vector.
     * @param {number} [y=0] - The y component of the vector.
     * @param {number} [z=0] - The z component of the vector.
     */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Creates a copy of this vector.
     * @returns {Vector3} A new Vector3 object with the same components as this vector.
     */
    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Calculates the square of the length of the vector.
     * @returns {number} The square of the length of the vector.
     */
    length2(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * Calculates the length of the vector.
     * @returns {number} The length of the vector.
     */
    length(): number {
        return Math.sqrt(this.length2());
    }

    /**
     * Normalizes the vector (makes its length equal to 1).
     * @returns {Vector3} This vector after normalization.
     */
    normalize(): Vector3 {
        const len2 = this.length2();
        if (len2 > 0) {
            const invLen = 1 / Math.sqrt(len2);
            this.x *= invLen;
            this.y *= invLen;
            this.z *= invLen;
        }
        return this;
    }

    /**
     * Calculates the dot product of this vector and another vector.
     * @param {Vector3} otherVector - The vector to compute the dot product with.
     * @returns {number} The dot product of the two vectors.
     */
    dotProduct(otherVector: Vector3): number {
        return (
            this.x * otherVector.x +
            this.y * otherVector.y +
            this.z * otherVector.z
        );
    }

    /**
     * Multiplies this vector component-wise with another vector.
     * @param {Vector3} otherVector - The vector to multiply with.
     * @returns {Vector3} This vector after component-wise multiplication.
     */
    product(otherVector: Vector3): Vector3 {
        this.x *= otherVector.x;
        this.y *= otherVector.y;
        this.z *= otherVector.z;
        return this;
    }

    /**
     * Multiplies this vector by a scalar value.
     * @param {number} scalarValue - The scalar value to multiply with.
     * @returns {Vector3} This vector after scalar multiplication.
     */
    multiply(scalarValue: number): Vector3 {
        this.x *= scalarValue;
        this.y *= scalarValue;
        this.z *= scalarValue;
        return this;
    }

    /**
     * Adds another vector to this vector.
     * @param {Vector3} otherVector - The vector to add.
     * @returns {Vector3} This vector after addition.
     */
    add(otherVector: Vector3): Vector3 {
        this.x += otherVector.x;
        this.y += otherVector.y;
        this.z += otherVector.z;
        return this;
    }

    /**
     * Subtracts another vector from this vector.
     * @param {Vector3} otherVector - The vector to subtract.
     * @returns {Vector3} This vector after subtraction.
     */
    subtract(otherVector: Vector3): Vector3 {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        this.z -= otherVector.z;
        return this;
    }

    /**
     * Reverts the direction of this vector.
     * @returns {Vector3} This vector after reversion.
     */
    revert(): Vector3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
}

export default Vector3;
