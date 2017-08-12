"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cells = require("./cells");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('docs'));
app.get('/api/cells', (req, res) => {
    res.json(cells.getCells());
});
app.post('/api/cells', (req, res) => {
    cells.addUpdatingCells(req.body.cells);
    res.send('');
});
const listener = app.listen(process.env.PORT, () => {
    cells.init();
    console.log(`collab-lifegame server ready. port: ${listener.address().port}`);
});
