import Service from "./service.js";

let instance;
export default {
  async getInstance() {
    if (instance) return instance;
    // import dynamically the dependencies and run it on main thread
    await import(
      "https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js"
    );
    await import(
      "https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js"
    );
    await import(
      "https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js"
    );
    await import(
      "https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js"
    );

    const workerMock = {
      async postMessage(video) {
        const blinked = await service.handBlinked(video);
        if (!blinked) return;
        workerMock.onmessage({ data: { blinked } });
      },
      onmessage(msg) {},
    };

    const { tf, faceLandmarksDetection } = window;
    tf.setBackend("webgl");

    const service = new Service({
      faceLandmarksDetection,
    });

    console.log("loading tf model");
    await service.loadModel();
    console.log("tf model loaded");

    setTimeout(() => workerMock.onmessage({ data: "MODEL READY" }), 200);
    instance = workerMock;
    return workerMock;
  },
};
