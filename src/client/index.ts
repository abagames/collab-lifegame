import * as ui from './ui';
import Vector from './vector';

window.onload = init;

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let pixelSize: Vector;
const cellWidth = 32;
let cells: string[][] = [];
let myColor: string;
let prevPressingCellPos = new Vector(-1, -1);
let updatingCells: any = [];
let nextUpdatingTicks = 0;

function init() {
  canvas = <HTMLCanvasElement>document.getElementById('main');
  context = canvas.getContext('2d');
  pixelSize = new Vector(canvas.width, canvas.height);
  ui.init(canvas, pixelSize);
  for (let x = 0; x < cellWidth; x++) {
    let line = [];
    for (let y = 0; y < cellWidth; y++) {
      line.push('black');
    }
    cells.push(line);
  }
  myColor = `#${getColorChar()}${getColorChar()}${getColorChar()}`
  update();
}

function getColorChar() {
  return String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * 6));
}

function update() {
  requestAnimationFrame(update);
  const cw = pixelSize.x / cellWidth;
  const ch = pixelSize.y / cellWidth;
  if (ui.isPressing) {
    const cx = Math.floor(ui.cursorPos.x / cw);
    const cy = Math.floor(ui.cursorPos.y / ch);
    if (cx >= 0 && cx < cellWidth && cy >= 0 && cy < cellWidth &&
      (prevPressingCellPos.x != cx || prevPressingCellPos.y != cy)) {
      cells[cx][cy] = myColor;
      updatingCells.push({
        x: cx,
        y: cy,
        color: myColor
      })
      prevPressingCellPos.x = cx;
      prevPressingCellPos.y = cy;
    }
  }
  context.clearRect(0, 0, pixelSize.x, pixelSize.y);
  for (let x = 0; x < cellWidth; x++) {
    for (let y = 0; y < cellWidth; y++) {
      context.fillStyle = cells[x][y];
      context.fillRect(x * cw, y * ch, cw - 1, ch - 1);
    }
  }
  nextUpdatingTicks--;
  if (nextUpdatingTicks <= 0) {
    postUpdatingCells();
    nextUpdatingTicks = 30;
  }
}

function postUpdatingCells() {
  window.fetch('/api/cells', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cells: updatingCells
    })
  }).
    then(() => window.fetch('/api/cells')).
    then(res => res.json()).
    then(json => {
      cells = json.cells;
      addUpdatingCells();
    });
  updatingCells = [];
}

function addUpdatingCells() {
  updatingCells.forEach(c => {
    cells[c.x][c.y] = c.color;
  });
}
