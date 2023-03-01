const CLICK_ELEMENTS = ["INPUT", "BUTTON", "IMG", "A"];
export default class HandGestureView {
  cursorPosition;

  constructor() {
    this.cursorPosition = {
      x: 0,
      y: 0,
      element: null,
    };
  }

  loop(fn) {
    requestAnimationFrame(fn);
  }

  configureMouseHover() {
    document.addEventListener(
      "mousemove",
      (e) => {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        // console.log(element, element?.tagName);
        if (!CLICK_ELEMENTS.includes(element?.tagName?.toUpperCase())) return;
        this.cursorPosition = {
          x: e.clientX,
          y: e.clientY,
          element,
        };
      },
      { passive: true }
    );
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: "smooth",
    });
  }

  click() {
    // window.MouseEvent.click();
    // window.dispatchEvent(
    //   new MouseEvent(
    //     MouseEvent.MOUSE_DOWN,
    //     true,
    //     false,
    //     this.cursorPosition.x,
    //     this.cursorPosition.y
    //   )
    // );
    try {
      console.log("click", this.cursorPosition?.element);
      // this.cursorPosition?.element?.click();
    } catch (error) {
      console.log(
        error,
        this.cursorPosition.element.tagName,
        this.cursorPosition.element
      );
    }
  }
  rock() {
    alert("Rock and roll, carai");
  }
}
