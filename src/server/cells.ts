import * as db from './db';

export const cellWidth = 32;
export const nullColor = '#333';
let cells: string[][] = [];
let nextCells: string[][] = [];
let updatingCells: any[] = [];

export function init(dbCells = null) {
  let i = 0;
  for (let x = 0; x < cellWidth; x++) {
    let line = [];
    let nextLine = [];
    for (let y = 0; y < cellWidth; y++) {
      const c = dbCells != null ? dbCells[i].color : nullColor;
      i++;
      line.push(c);
      nextLine.push(c);
    }
    cells.push(line);
    nextCells.push(nextLine);
  }
  setInterval(update, 500);
}

export function saveToDb() {
  let cellArray = [];
  for (let x = 0; x < cellWidth; x++) {
    for (let y = 0; y < cellWidth; y++) {
      cellArray.push(cells[x][y]);
    }
  }
  return db.save(cellArray);
}

export function addUpdatingCells(updatingCells: any[]) {
  updatingCells.forEach((c: any) => {
    cells[c.x][c.y] = c.color;
  });
}

export function getCells() {
  return { cells };
}

function update() {
  for (let x = 0; x < cellWidth; x++) {
    for (let y = 0; y < cellWidth; y++) {
      updateCell(x, y);
    }
  }
  const tmpCells = cells;
  cells = nextCells;
  nextCells = tmpCells;
}

function updateCell(x, y) {
  nextCells[x][y] = cells[x][y];
  const countResult = countCells(x, y);
  if (cells[x][y] === nullColor) {
    if (countResult.count === 3) {
      nextCells[x][y] = countResult.colors[Math.floor(Math.random() * 3)];
    }
  } else {
    if (countResult.count <= 1 || countResult.count >= 4) {
      nextCells[x][y] = nullColor;
    }
  }
}

const offsets =
  [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

function countCells(x, y) {
  let count = 0;
  let colors = [];
  offsets.forEach(o => {
    const c = getCell(x + o[0], y + o[1]);
    if (c != null) {
      count++;
      colors.push(c);
    }
  });
  return { count, colors };
}

function getCell(x, y) {
  if (x < 0 || x >= cellWidth || y < 0 || y >= cellWidth ||
    cells[x][y] === nullColor) {
    return null;
  }
  return cells[x][y];
}
