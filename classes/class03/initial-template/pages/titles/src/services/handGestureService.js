const MODEL_BASE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/hands";
export default class HandGestureService {
  #gestureEstimator;
  #handPoseDetection;
  #handsVersion;
  #detector = null;
  #gestureStrings;

  constructor({
    fingerpose,
    handPoseDetection,
    handsVersion,
    knownGestures,
    gestureStrings,
  }) {
    this.#gestureEstimator = new fingerpose.GestureEstimator(knownGestures);
    this.#handPoseDetection = handPoseDetection;
    this.#handsVersion = handsVersion;
    this.#gestureStrings = gestureStrings;
  }

  async estimateGesture(keyPoints3d) {
    const points = this.#getLandMarksFromKeyPoints(keyPoints3d);
    const predictions = await this.#gestureEstimator.estimate(points, 9); // porcentagem de confiança do gesto (9 = 90%)
    return predictions.gestures;
  }

  async *detectGestures(predictions) {
    for (const hand of predictions) {
      if (!hand.keypoints3D) continue;
      const gestures = await this.estimateGesture(hand.keypoints3D);
      if (!gestures?.length) continue;
      const result = gestures.reduce((previous, current) =>
        previous.score > current.score ? previous : current
      );
      const { x, y } = hand.keypoints.find(
        ({ name }) => name === "index_finger_tip"
      );

      yield { event: result.name, x, y };

      console.log(
        `detected ${this.#gestureStrings[result.name]} on ${
          hand.handedness
        } hand`
      );
    }
  }

  #getLandMarksFromKeyPoints(keyPoints3d) {
    return keyPoints3d.map(({ x, y, z }) => [x, y, z]);
  }

  async estimateHands(video) {
    return this.#detector.estimateHands(video, {
      flipHorizontal: true,
    });
  }

  async initializeDetector() {
    if (this.#detector) return this.#detector;
    const model = this.#handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: "mediapipe", // outra opção é o tfjs
      solutionPath: `${MODEL_BASE_URL}@${this.#handsVersion}`,
      modelType: "lite", // "full" é mais pesado e o mais preciso, porém o lite atende bem
      maxHands: 2,
    };
    const detector = await this.#handPoseDetection.createDetector(
      model,
      detectorConfig
    );
    this.#detector = detector;
    return this.#detector;
  }
}
