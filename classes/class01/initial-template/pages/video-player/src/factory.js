import Controller from "./controller.js";
import View from "./view.js";
import Camera from "../../../lib/shared/camera.js";
import { supportsWorkerType } from "../../../lib/shared/utils.js";
import WorkerMock from "./workerMock.js";

const [rootPath] = window.location.href.split("/video-player/");

// const camera = await Camera.init(true);
const camera = await Camera.init();

const getWorker = async () => {
  if (supportsWorkerType()) {
    const worker = new Worker("./src/worker.js", { type: "module" });
    return worker;
  }
  console.warn(
    "Your browser don't support esm modules on webworkers, please consider moving to chromium based browsers"
  );
  console.warn("Using worker mock instead!");

  return await WorkerMock.getInstance();
};

const worker = await getWorker();

const factory = {
  async initialize() {
    return Controller.initialize({
      view: new View(),
      worker,
      camera,
    });
  },
};

export default factory;
