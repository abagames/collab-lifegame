"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cellWidth = 32;
let cells = [];
let nextCells = [];
let updatingCells = [];
const nullColor = '#333';
function init() {
    for (let x = 0; x < cellWidth; x++) {
        let line = [];
        let nextLine = [];
        for (let y = 0; y < cellWidth; y++) {
            line.push(nullColor);
            nextLine.push(nullColor);
        }
        cells.push(line);
        nextCells.push(nextLine);
    }
    setInterval(update, 500);
}
exports.init = init;
function addUpdatingCells(updatingCells) {
    updatingCells.forEach((c) => {
        cells[c.x][c.y] = c.color;
    });
}
exports.addUpdatingCells = addUpdatingCells;
function getCells() {
    return { cells };
}
exports.getCells = getCells;
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
    }
    else {
        if (countResult.count <= 1 || countResult.count >= 4) {
            nextCells[x][y] = nullColor;
        }
    }
}
const offsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
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
