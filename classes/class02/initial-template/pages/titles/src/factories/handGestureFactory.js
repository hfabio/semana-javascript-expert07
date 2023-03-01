import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js";
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js";
import "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js";
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js";
import "https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js";

import HandGestureController from "../controllers/handGestureController.js";
import HandGestureView from "../views/HandGestureView.js";
import handGestureService from "../services/handGestureService.js";

const [rootPath] = window.location.href.split("/pages/");
import Camera from "../../../../lib/shared/camera.js";

const camera = await Camera.init();

const fingerpose = window.fp;
const handPoseDetection = window.handPoseDetection;
const handsVersion = window.VERSION;

const factory = {
  async initialize() {
    return HandGestureController.initialize({
      camera,
      view: new HandGestureView(),
      service: new handGestureService({
        fingerpose,
        handPoseDetection,
        handsVersion,
      }),
    });
  },
};

export default factory;
