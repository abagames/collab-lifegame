/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector = (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Vector;
}());
exports.default = Vector;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ui = __webpack_require__(2);
var vector_1 = __webpack_require__(0);
window.onload = init;
var canvas;
var context;
var pixelSize;
var cellWidth = 32;
var cells = [];
var myColor;
var prevPressingCellPos = new vector_1.default(-1, -1);
var updatingCells = [];
var nextUpdatingTicks = 0;
function init() {
    canvas = document.getElementById('main');
    context = canvas.getContext('2d');
    pixelSize = new vector_1.default(canvas.width, canvas.height);
    ui.init(canvas, pixelSize);
    for (var x = 0; x < cellWidth; x++) {
        var line = [];
        for (var y = 0; y < cellWidth; y++) {
            line.push('black');
        }
        cells.push(line);
    }
    myColor = "#" + getColorChar() + getColorChar() + getColorChar();
    update();
}
function getColorChar() {
    return String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * 6));
}
function update() {
    requestAnimationFrame(update);
    var cw = pixelSize.x / cellWidth;
    var ch = pixelSize.y / cellWidth;
    if (ui.isPressing) {
        var cx = Math.floor(ui.cursorPos.x / cw);
        var cy = Math.floor(ui.cursorPos.y / ch);
        if (cx >= 0 && cx < cellWidth && cy >= 0 && cy < cellWidth &&
            (prevPressingCellPos.x != cx || prevPressingCellPos.y != cy)) {
            cells[cx][cy] = myColor;
            updatingCells.push({
                x: cx,
                y: cy,
                color: myColor
            });
            prevPressingCellPos.x = cx;
            prevPressingCellPos.y = cy;
        }
    }
    context.clearRect(0, 0, pixelSize.x, pixelSize.y);
    for (var x = 0; x < cellWidth; x++) {
        for (var y = 0; y < cellWidth; y++) {
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
        then(function () { return window.fetch('/api/cells'); }).
        then(function (res) { return res.json(); }).
        then(function (json) {
        cells = json.cells;
        addUpdatingCells();
    });
    updatingCells = [];
}
function addUpdatingCells() {
    updatingCells.forEach(function (c) {
        cells[c.x][c.y] = c.color;
    });
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(0);
exports.isPressing = false;
exports.isPressed = false;
var canvas;
var pixelSize;
function init(_canvas, _pixelSize) {
    canvas = _canvas;
    pixelSize = _pixelSize;
    document.onmousedown = function (e) {
        onMouseTouchDown(e.pageX, e.pageY);
    };
    document.ontouchstart = function (e) {
        onMouseTouchDown(e.touches[0].pageX, e.touches[0].pageY);
    };
    document.onmousemove = function (e) {
        onMouseTouchMove(e.pageX, e.pageY);
    };
    document.ontouchmove = function (e) {
        e.preventDefault();
        onMouseTouchMove(e.touches[0].pageX, e.touches[0].pageY);
    };
    document.onmouseup = function (e) {
        onMouseTouchUp(e);
    };
    document.ontouchend = function (e) {
        onMouseTouchUp(e);
    };
    exports.cursorPos = new vector_1.default();
}
exports.init = init;
function resetPressed() {
    exports.isPressed = false;
}
exports.resetPressed = resetPressed;
function onMouseTouchDown(x, y) {
    calcCursorPos(x, y, exports.cursorPos);
    exports.isPressing = exports.isPressed = true;
}
function onMouseTouchMove(x, y) {
    calcCursorPos(x, y, exports.cursorPos);
}
function calcCursorPos(x, y, v) {
    v.x = ((x - canvas.offsetLeft) / canvas.clientWidth + 0.5) * pixelSize.x;
    v.y = ((y - canvas.offsetTop) / canvas.clientHeight + 0.5) * pixelSize.y;
}
function onMouseTouchUp(e) {
    exports.isPressing = false;
}


/***/ })
/******/ ]);