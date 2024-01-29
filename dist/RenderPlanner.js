/**
 * @class RenderPlanner
 * @classdesc Manages the planning and execution of rendering tasks using multiple workers.
 */
export default class RenderPlanner {
    jobCount;
    scene;
    backgroundColor;
    width;
    height;
    running = false;
    completedJobs = 0;
    onUpdateReceived;
    workers = [];
    serializedElements = [];
    /**
     * @constructor
     * @param {number} jobCount - Number of rendering jobs (workers).
     * @param {Scene} scene - The scene to be rendered.
     * @param {Vector3} backgroundColor - Background color of the scene.
     * @param {number} width - Width of the rendering canvas.
     * @param {number} height - Height of the rendering canvas.
     */
    constructor(jobCount, scene, backgroundColor, width, height) {
        this.jobCount = jobCount;
        this.scene = scene;
        this.backgroundColor = backgroundColor;
        this.width = width;
        this.height = height;
        this.jobCount = jobCount;
        this.scene = scene;
        this.backgroundColor = backgroundColor;
        this.width = width;
        this.height = height;
        this.running = false;
        this.completedJobs = 0;
        this.onUpdateReceived = () => { };
        this.serializeScene();
        for (let i = 0; i < this.jobCount; i++) {
            this.workers.push(new Worker("./dist/RenderWorker.js", { type: "module" }));
        }
    }
    /**
     * Initializes the render planner by preparing all worker threads.
     */
    initialize() {
        // prepare all workers
        this.workers.forEach((worker, index) => {
            this.prepareWorker(index, worker);
        });
    }
    /**
     * Starts the rendering process by activating all worker threads.
     */
    start() {
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
    stop() {
        this.running = false;
        this.workers.forEach((worker) => {
            worker.terminate();
        });
    }
    /**
     * Serializes the scene elements for distribution to worker threads.
     */
    serializeScene() {
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
    prepareWorker(index, rendererWorker) {
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
        rendererWorker.onmessage = (e) => {
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
    startWorker(rendererWorker) {
        // start rendering!
        rendererWorker.postMessage({
            action: "render",
        });
    }
    /**
     * Checks if the render planner is currently running.
     * @returns {boolean} True if running, false otherwise.
     */
    isRunning() {
        return this.running;
    }
    /**
     * Updates the scene elements and sends the updates to worker threads.
     */
    updateScene() {
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
