import Material from "../Material.js";
import Sphere from "../Sphere.js";
import Vector3 from "../Vector3.js";

export const sphere0 = new Sphere(
    new Vector3(0.0, -10004, -20),
    10000,
    new Material(new Vector3(0.2, 0.2, 0.2), 0, 0)
);
export const sphere1 = new Sphere(
    new Vector3(0, 0, -20),
    4,
    new Material(new Vector3(1.0, 0.32, 0.36), 1, 0.5)
);
export const sphere2 = new Sphere(
    new Vector3(5, -1, -15),
    2,
    new Material(new Vector3(0.9, 0.76, 0.46), 1, 0)
);
export const sphere3 = new Sphere(
    new Vector3(5, 0, -25),
    3,
    new Material(new Vector3(0.65, 0.77, 0.97), 1, 0)
);
export const sphere4 = new Sphere(
    new Vector3(-5.5, 0, -15),
    3,
    new Material(new Vector3(0.9, 0.9, 0.9), 1, 0)
);
export const light = new Sphere(
    new Vector3(0, 20, -30),
    3,
    new Material(new Vector3(), 0, 0, new Vector3(1.2, 1.2, 1.2))
);
export const sphere5 = new Sphere(
    new Vector3(0, 10, 10),
    3,
    new Material(new Vector3(), 0, 0, new Vector3(1, 1, 1))
);
