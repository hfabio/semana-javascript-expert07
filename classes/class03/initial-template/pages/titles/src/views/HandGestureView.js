const JOINT_CONFIG = {
  getX: (x) => x - 2,
  getY: (y) => y - 2,
  radius: 3,
  startAngle: 0,
  endAngle: 2 * Math.PI,
  getArc: function (x, y) {
    return [
      this.getX(x),
      this.getY(y),
      this.radius,
      this.startAngle,
      this.endAngle,
    ];
  },
};
export default class HandGestureView {
  #handsCanvas = document.querySelector("canvas#hands");
  #canvasContext = this.#handsCanvas.getContext("2d");
  #fingerLookupIndexes;
  constructor({ fingerLookupIndexes }) {
    this.cursorPosition = {
      x: 0,
      y: 0,
      element: null,
    };
    this.#handsCanvas.width = globalThis.screen.availWidth;
    this.#handsCanvas.height = globalThis.screen.availHeight;
    this.#fingerLookupIndexes = fingerLookupIndexes;
  }

  clearCanvas() {
    this.#canvasContext.clearRect(
      0,
      0,
      this.#handsCanvas.width,
      this.#handsCanvas.height
    );
  }

  drawHands(hands) {
    for (const { keypoints: keyPoints, handedness } of hands) {
      if (!keyPoints) continue;

      this.#canvasContext.fillStyle =
        handedness === "Left" ? "red" : "rgb(44,212,103)";
      this.#canvasContext.strokeStyle = "white";
      this.#canvasContext.lineWidth = 8;
      this.#canvasContext.lineJoint = "round";

      // desenha as juntas das mãos!
      this.#drawJoints(keyPoints);
      // desenha os dedos e garante o hover dos elementos
      this.#drawFingersAndHoverElements(keyPoints);
    }
  }

  #drawJoints(keyPoints) {
    for (const { x, y } of keyPoints) {
      this.#canvasContext.beginPath();
      this.#canvasContext.arc(...JOINT_CONFIG.getArc(x, y));
      this.#canvasContext.fill();
    }
  }

  #drawFingersAndHoverElements(keyPoints) {
    const fingers = Object.keys(this.#fingerLookupIndexes);
    const palma = [];
    for (const finger of fingers) {
      const points = this.#fingerLookupIndexes[finger].map(
        (index) => keyPoints[index]
      );
      if (finger === "thumb") palma.push(points[0]);
      palma.push(points[1]);
      const region = new Path2D();
      // [0] é o wrist
      const [{ x, y }] = points;
      region.moveTo(x, y);
      for (const point of points) {
        region.lineTo(point.x, point.y);
      }
      this.#canvasContext.stroke(region);
    }
    const palmaRegion = new Path2D();
    for (const point of palma) {
      palmaRegion.lineTo(point.x, point.y);
    }
    this.#canvasContext.stroke(palmaRegion);
  }

  loop(fn) {
    requestAnimationFrame(fn);
  }

  clickOnElement(x, y) {
    const element = document.elementFromPoint(x, y);
    if (!element) return;
    // element?.click?.();
    const rect = element.getBoundingClientRect();
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y,
    });
    element.dispatchEvent(event);
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: "smooth",
    });
  }

  rock() {
    alert("Rock and roll, carai");
  }
}
