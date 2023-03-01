export default class Controller {
  #view;
  #worker;
  #camera;
  #blinkCounter;
  constructor({ view, worker, camera }) {
    this.#view = view;
    this.#worker = this.#configureWorker(worker);
    this.#camera = camera;
    // on bind no this faz com que toda vez q use o this seja relativo à controller e não ao novo contexto
    this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log(
      "not yet detecting eye blinking! click in the button to start!"
    );
  }

  #configureWorker(worker) {
    let ready = false;
    worker.onmessage = ({ data }) => {
      if ("MODEL READY" === data) {
        this.#view.enableButton();
        ready = true;
        return;
      }
      const blinked = data.blinked;
      if (blinked) this.#blinkCounter += 1;
      this.#view.togglePlayVideo();
      console.log({ blinked, times: this.#blinkCounter });
    };
    return {
      send(msg) {
        if (!ready) return;
        worker.postMessage(msg);
      },
    };
  }

  loop() {
    const video = this.#camera.video;
    const img = this.#view.getVideoFrame(video);
    this.#worker.send(img);
    this.log(`detect eye blink!`);
    setTimeout(() => this.loop(), 100);
  }

  log(text) {
    const times = `     - blinked times: ${this.#blinkCounter}`;
    this.#view.log(`logger: ${text} ${this.#blinkCounter ? times : ""}`);
  }

  onBtnStart() {
    this.log("initializing detection...");
    this.#blinkCounter = 0;
    this.#view.disableButton();
    this.loop();
  }
}
