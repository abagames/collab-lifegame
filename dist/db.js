"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const cells = require("./cells");
let sequelize;
let Cell;
function init() {
    sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
        host: '0.0.0.0',
        dialect: 'sqlite',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        storage: '.data/database.sqlite'
    });
    return sequelize.authenticate().then(() => {
        Cell = sequelize.define('cell', {
            index: {
                type: Sequelize.INTEGER
            },
            color: {
                type: Sequelize.STRING
            }
        });
        return load();
    }).catch(err => {
        console.log(`sqlite init error: ${err}`);
        cells.init();
        return setup();
    });
}
exports.init = init;
function load() {
    return Cell.findAll({ order: [['index']] }).then(cs => {
        cells.init(cs);
    });
}
function setup() {
    return Cell.sync({ force: true }).then(() => {
        for (let i = 0; i < cells.cellWidth * cells.cellWidth; i++) {
            Cell.create({ index: i, color: cells.nullColor });
        }
    });
}
function save(cellArray) {
    console.log('save cells to db');
    for (let i = 0; i < cellArray.length; i++) {
        Cell.update({ color: cellArray[i] }, { where: { index: { $eq: i } } });
    }
}
exports.save = save;
