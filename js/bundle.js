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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents node of DFA
 * Created by Jakub on 15.06.17.
 */

const NODE_START = "S";
/* harmony export (immutable) */ __webpack_exports__["a"] = NODE_START;

const NODE_NORMAL = "N";
/* harmony export (immutable) */ __webpack_exports__["d"] = NODE_NORMAL;

const NODE_TERMINATE = "T";
/* harmony export (immutable) */ __webpack_exports__["c"] = NODE_TERMINATE;


class Node {

    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Node;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents edge of DFA
 * Created by Jakub on 15.06.17.
 */
class Edge {

    constructor(id, nodeFrom, nodeTo, transitionChar) {
        this.id = id;
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
        this.transitionChar = transitionChar;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Edge;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Node__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Edge__ = __webpack_require__(1);
/**
 * Created by Jakub on 14.06.17.
 */




var alphabet = ['0', '1'];
var nodeId = 0;
var edgeId = 0;
var nodes = [];
var edges = [];

// init graph
var cy = cytoscape({

    container: $('#cy'), // container to render in

    // elements: [ // list of graph elements to start with
    //     { // node a
    //         data: {id: 'a'}
    //     },
    //     { // node b
    //         data: {id: 'b'}
    //     },
    //     { // edge ab
    //         data: {id: 'ab', source: 'a', target: 'b', label: '0'}
    //     }
    // ],

    style: cytoscape.stylesheet()
        .selector('node').css({
            'content': 'data(label)',
            'text-valign': 'center',
            'color': '#000',
            'background-color': '#eee',
            'border-width': 1,
            'border-color': 'data(color)',
            'font-family': 'Source Code Pro',
            'font-size': 10
        })
        .selector('edge').css({
            'width': 1,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'content': 'data(label)',
            'line-color': '#888',
            'target-arrow-color': '#888',
            'text-outline-width' : 3,
            'text-outline-color' : '#fff',


        }),

    layout: {
        name: 'grid',
        rows: 1
    },

    boxSelectionEnabled: true,
});

addNode(__WEBPACK_IMPORTED_MODULE_0__Node__["a" /* NODE_START */]);

function addNode(type) {
    let n = new __WEBPACK_IMPORTED_MODULE_0__Node__["b" /* default */](nodeId, type);
    nodes.push(n);
    let color;
    switch (type) {
        case __WEBPACK_IMPORTED_MODULE_0__Node__["a" /* NODE_START */]:
            color = '#0b0';
            break;
        case __WEBPACK_IMPORTED_MODULE_0__Node__["c" /* NODE_TERMINATE */]:
            color = '#b00';
            break;
        default:
            color = '#000';
    }
    if (nodeId > 0) {
        console.log(cy.getElementById(nodeId-1));
    }

    cy.add({
        group: "nodes",
        data: {id: nodeId, label: "q" + nodeId, color: color},
        classes: 'center-center',
        position: {x: 200, y: 200}
    });
    nodeId++;
}

function addEdge(nodeFromId, nodeToId, transitionChar) {
    let e = new __WEBPACK_IMPORTED_MODULE_1__Edge__["a" /* default */](edgeId, nodeFromId, nodeToId, transitionChar);
    edges.push(e);
    cy.add({
        group: "edges",
        data: {id: 'e' + nodeId, source: nodeFromId, target: nodeToId, label: transitionChar}
    });
    nodeId++;
}


$(window).keypress(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) { // space
        addNode(__WEBPACK_IMPORTED_MODULE_0__Node__["d" /* NODE_NORMAL */]);
        addEdge(nodes[nodes.length- 2].id, nodes[nodes.length - 1].id, '1');
    }
});

/***/ })
/******/ ]);