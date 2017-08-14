"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./db");
exports.cellWidth = 32;
exports.nullColor = '#333';
let cells = [];
let nextCells = [];
let updatingCells = [];
function init(dbCells = null) {
    let i = 0;
    for (let x = 0; x < exports.cellWidth; x++) {
        let line = [];
        let nextLine = [];
        for (let y = 0; y < exports.cellWidth; y++) {
            const c = dbCells != null ? dbCells[i].color : exports.nullColor;
            i++;
            line.push(c);
            nextLine.push(c);
        }
        cells.push(line);
        nextCells.push(nextLine);
    }
    setInterval(update, 500);
}
exports.init = init;
function saveToDb() {
    let cellArray = [];
    for (let x = 0; x < exports.cellWidth; x++) {
        for (let y = 0; y < exports.cellWidth; y++) {
            cellArray.push(cells[x][y]);
        }
    }
    return db.save(cellArray);
}
exports.saveToDb = saveToDb;
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
    for (let x = 0; x < exports.cellWidth; x++) {
        for (let y = 0; y < exports.cellWidth; y++) {
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
    if (cells[x][y] === exports.nullColor) {
        if (countResult.count === 3) {
            nextCells[x][y] = countResult.colors[Math.floor(Math.random() * 3)];
        }
    }
    else {
        if (countResult.count <= 1 || countResult.count >= 4) {
            nextCells[x][y] = exports.nullColor;
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
    if (x < 0 || x >= exports.cellWidth || y < 0 || y >= exports.cellWidth ||
        cells[x][y] === exports.nullColor) {
        return null;
    }
    return cells[x][y];
}
