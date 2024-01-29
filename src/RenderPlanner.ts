import Scene from "./Scene.js";
import Vector3 from "./Vector3.js";

/**
 * @class RenderPlanner
 * @classdesc Manages the planning and execution of rendering tasks using multiple workers.
 */
export default class RenderPlanner {
    running: boolean = false;
    completedJobs: number = 0;
    onUpdateReceived: (
        sectionStart: number,
        sectionHeight: number,
        buf8: Uint8ClampedArray
    ) => void;
    workers: Worker[] = [];
    serializedElements: any[] = [];

    /**
     * @constructor
     * @param {number} jobCount - Number of rendering jobs (workers).
     * @param {Scene} scene - The scene to be rendered.
     * @param {Vector3} backgroundColor - Background color of the scene.
     * @param {number} width - Width of the rendering canvas.
     * @param {number} height - Height of the rendering canvas.
     */
    constructor(
        public jobCount: number,
        public scene: Scene,
        public backgroundColor: Vector3,
        public width: number,
        public height: number
    ) {
        this.jobCount = jobCount;
        this.scene = scene;
        this.backgroundColor = backgroundColor;
        this.width = width;
        this.height = height;
        this.running = false;
        this.completedJobs = 0;
        this.onUpdateReceived = () => {};
        this.serializeScene();

        for (let i = 0; i < this.jobCount; i++) {
            this.workers.push(
                new Worker("./dist/RenderWorker.js", { type: "module" })
            );
        }
    }

    /**
     * Initializes the render planner by preparing all worker threads.
     */
    initialize(): void {
        // prepare all workers
        this.workers.forEach((worker, index) => {
            this.prepareWorker(index, worker);
        });
    }

    /**
     * Starts the rendering process by activating all worker threads.
     */
    start(): void {
        this.running = true;
        this.completedJobs = 0;

        // start all workers
        this.workers.forEach((worker) => {
            this.startWorker(worker);
        });
    }

    /**
     * Stops all workers.
     *
     * @return {void}
     */
    stop(): void {
        this.running = false;

        this.workers.forEach((worker) => {
            worker.terminate();
        });
    }

    /**
     * Serializes the scene elements for distribution to worker threads.
     */
    serializeScene(): void {
        // serialize scene
        this.serializedElements = [];
        this.scene.elements.forEach((el) => {
            this.serializedElements.push(el.serialize());
        });
    }

    /**
     * Prepares a worker thread for rendering.
     * @param {number} index - Index of the worker thread.
     * @param {Worker} rendererWorker - The worker thread.
     */
    prepareWorker(index: number, rendererWorker: Worker): void {
        // send scene to workers
        rendererWorker.postMessage({
            action: "elements",
            data: this.serializedElements,
        });

        // set background color
        rendererWorker.postMessage({
            action: "backgroundColor",
            data: [
                this.backgroundColor.x,
                this.backgroundColor.y,
                this.backgroundColor.z,
            ],
        });

        const sectionHeight = Math.floor(this.height / this.jobCount);
        const sectionStart = Math.floor(index * sectionHeight);

        // set ray tracer dimensions
        rendererWorker.postMessage({
            action: "dimensions",
            data: [this.width, this.height, sectionStart, sectionHeight],
        });

        // add listeners
        rendererWorker.onmessage = (e: MessageEvent) => {
            const action = e.data.action;
            const data = e.data.data;

            if (action === "result") {
                this.completedJobs++;
                if (this.completedJobs === this.jobCount) {
                    this.running = false;
                }

                const buf8 = data;
                this.onUpdateReceived(sectionStart, sectionHeight, buf8);
            }
        };
    }

    /**
     * Starts rendering on a worker thread.
     * @param {Worker} rendererWorker - The worker thread.
     */
    startWorker(rendererWorker: Worker): void {
        // start rendering!
        rendererWorker.postMessage({
            action: "render",
        });
    }

    /**
     * Checks if the render planner is currently running.
     * @returns {boolean} True if running, false otherwise.
     */
    isRunning(): boolean {
        return this.running;
    }

    /**
     * Updates the scene elements and sends the updates to worker threads.
     */
    updateScene(): void {
        this.serializeScene();

        this.workers.forEach((worker) => {
            // send scene to workers
            worker.postMessage({
                action: "elements",
                data: this.serializedElements,
            });
        });
    }
}
