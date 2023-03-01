import { prepareRunChecker } from "../../../../lib/shared/utils.js";

const { shouldRun } = prepareRunChecker({ timerDelay: 200 });
export default class HandGestureController {
  #view;
  #service;
  #camera;
  #lastDirection = {
    direction: "",
    y: 0,
  };
  constructor({ view, service, camera }) {
    this.#view = view;
    this.#service = service;
    this.#camera = camera;
  }

  async init() {
    this.#view.configureMouseHover();
    await this.#service.initializeDetector();
    await this.#loop();
  }

  #scrollPage(direction) {
    const scrollSpeed = 100;
    const maxTop = 0;
    const maxBottom = window.innerHeight * 3;
    const shouldLockScrollDown =
      direction === "scroll-down" &&
      this.#lastDirection.y + scrollSpeed > maxBottom;
    const shouldLockScrollTop =
      direction === "scroll-up" && this.#lastDirection.y - scrollSpeed < maxTop;
    // console.log({
    //   last: this.#lastDirection,
    //   shouldLockScrollDown,
    //   shouldLockScrollTop,
    // });
    if (this.#lastDirection.direction === direction) {
      if (shouldLockScrollTop || shouldLockScrollDown) return;
      this.#lastDirection.y +=
        direction === "scroll-down" ? scrollSpeed : scrollSpeed * -1;
    } else {
      this.#lastDirection.direction = direction;
    }
    this.#view.scrollPage(this.#lastDirection.y);
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video);
      for await (const result of this.#service.detectGestures(hands)) {
        if (!shouldRun()) continue;
        if (result.event.includes("scroll")) this.#scrollPage(result.event);
        if (result.event.includes("click")) this.#view.click();
      }
      return hands;
    } catch (error) {
      console.log("something went wrong", { error });
      return 0;
    }
  }

  async #loop() {
    await this.#service.initializeDetector();
    const hands = await this.#estimateHands();
    this.#view.loop(this.#loop.bind(this));
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps);
    return controller.init();
  }
}
