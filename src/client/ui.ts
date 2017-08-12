import Vector from './vector';

export let cursorPos: Vector;
export let isPressing = false;
export let isPressed = false;
let canvas: HTMLCanvasElement;
let pixelSize: Vector;

export function init(_canvas: HTMLCanvasElement, _pixelSize: Vector) {
  canvas = _canvas;
  pixelSize = _pixelSize;
  document.onmousedown = (e) => {
    onMouseTouchDown(e.pageX, e.pageY);
  };
  document.ontouchstart = (e) => {
    onMouseTouchDown(e.touches[0].pageX, e.touches[0].pageY);
  };
  document.onmousemove = (e) => {
    onMouseTouchMove(e.pageX, e.pageY);
  };
  document.ontouchmove = (e) => {
    e.preventDefault();
    onMouseTouchMove(e.touches[0].pageX, e.touches[0].pageY);
  };
  document.onmouseup = (e) => {
    onMouseTouchUp(e);
  };
  document.ontouchend = (e) => {
    onMouseTouchUp(e);
  };
  cursorPos = new Vector();
}

export function resetPressed() {
  isPressed = false;
}

function onMouseTouchDown(x, y) {
  calcCursorPos(x, y, cursorPos);
  isPressing = isPressed = true;
}

function onMouseTouchMove(x, y) {
  calcCursorPos(x, y, cursorPos);
}

function calcCursorPos(x, y, v) {
  v.x = ((x - canvas.offsetLeft) / canvas.clientWidth + 0.5) * pixelSize.x;
  v.y = ((y - canvas.offsetTop) / canvas.clientHeight + 0.5) * pixelSize.y;
}

function onMouseTouchUp(e) {
  isPressing = false;
}
