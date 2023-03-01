const { GestureDescription, Finger, FingerCurl } = window.fp;

const ScrollDownGesture = new GestureDescription("scroll-down"); // ✊️
const ScrollUpGesture = new GestureDescription("scroll-up"); // 🖐
const RockGesture = new GestureDescription("rock-and-roll"); // 🤟
const ClickGesture = new GestureDescription("click"); // 👌

// scroll-down
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// scroll-up
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Rock
//------------------------------------------------------------------------------
// index: half curled
// accept no curl with a bit lower confidence
for (let finger of [Finger.Thumb, Finger.Index, Finger.Pinky]) {
  RockGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  RockGesture.addCurl(finger, FingerCurl.NoCurl, 0.9);
}
// all other fingers: curled
for (let finger of [Finger.Middle, Finger.Ring]) {
  RockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  RockGesture.addCurl(finger, FingerCurl.FullCurl, 0.9);
}

// click
//------------------------------------------------------------------------------
// index: half curled
// accept no curl with a bit lower confidence
ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1);
ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.9);
ClickGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 0.5);
ClickGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5);

// all other fingers: curled
for (let finger of [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ClickGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  ClickGesture.addCurl(finger, FingerCurl.NoCurl, 0.9);
}

const knownGestures = [
  ScrollDownGesture,
  ScrollUpGesture,
  ClickGesture,
  RockGesture,
];

const gestureStrings = {
  "scroll-up": "🖐",
  "scroll-down": "✊️",
  click: "👌",
  "rock-and-roll": "🤟",
};

export { knownGestures, gestureStrings };
